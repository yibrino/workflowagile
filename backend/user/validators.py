from django.core.exceptions import ValidationError
import re

def validate_first_name(value):
    if len(value) < 3:
        raise ValidationError("First name should contain at least 3 characters.")
    if not re.match("^[a-zA-Z]+$", value):
        raise ValidationError("First name should contain only letters.")
    return value

def validate_last_name(value):
    if len(value) < 3:
        raise ValidationError("Last name should contain at least 3 characters.")
    if not re.match("^[a-zA-Z]+$", value):
        raise ValidationError("Last name should contain only letters.")
    return value