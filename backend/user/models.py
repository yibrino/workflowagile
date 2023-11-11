import uuid
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from .validators import *

class Teacher(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    first_name = models.CharField(verbose_name=_('First name'), max_length=20, blank=False,validators=[validate_first_name])
    last_name = models.CharField(verbose_name=_('Last name'),max_length=20, blank=False,validators=[validate_last_name])
    email = models.EmailField(verbose_name=_('Email Address'),unique=True,blank=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD="email"
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        self.is_active=True
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("Teacher")
        verbose_name_plural= _("Teachers")
        