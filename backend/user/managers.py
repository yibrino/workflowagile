from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    error_messages = {
        'email_required': _('An email address is required'),
        'invalid_email': _('Invalid email address'),
        'first_name_required': _('First name is required'),
        'last_name_required': _('Last name is required'),
        'superuser_password_required': _('Superusers must have a password'),
        'superuser_is_staff': _('Superusers must have is_staff=True'),
        'superuser_is_superuser': _('Superusers must have is_superuser=True'),
    }

    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError(self.error_messages['invalid_email'])

    def create_user(self, first_name, last_name, email, password, **extra_fields):
        if not first_name:
            raise ValueError(self.error_messages['first_name_required'])
        if not last_name:
            raise ValueError(self.error_messages['last_name_required'])
        if not email:
            raise ValueError(self.error_messages['email_required'])
        self.email_validator(email)

        email = self.normalize_email(email)
        user = self.model(first_name=first_name, last_name=last_name, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, first_name, last_name, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(self.error_messages['superuser_is_staff'])
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(self.error_messages['superuser_is_superuser'])
        if not password:
            raise ValueError(self.error_messages['superuser_password_required'])

        return self.create_user(first_name, last_name, email, password, **extra_fields)
