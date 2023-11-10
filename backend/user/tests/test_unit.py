import pytest
from mixer.backend.django import mixer
from user.models import Teacher
from user.serializers import TeacherSerializer
from django.core.exceptions import ValidationError

@pytest.fixture
def teacher_data():
    return {
        'first_name': 'Firstname',
        'last_name': 'Lastname',
        'email': 'a@a.com',
        'password': 'password1A_',
    }

@pytest.mark.django_db
def test_first_name_should_contain_only_letters():
    teacher = mixer.blend(Teacher,first_name="Firstname1")
    with pytest.raises(ValidationError):
        teacher.full_clean()
        
@pytest.mark.django_db
def test_last_name_should_contain_only_letters():
    teacher = mixer.blend(Teacher,last_name="Lastname1")
    with pytest.raises(ValidationError):
        teacher.full_clean()
        
@pytest.mark.django_db
def test_first_name_should_contain_at_least_three_characters():
    teacher = mixer.blend(Teacher,first_name="Fr")
    with pytest.raises(ValidationError):
        teacher.full_clean()
        
@pytest.mark.django_db
def test_last_name_should_contain_at_least_three_characters():
    teacher = mixer.blend(Teacher,last_name="La")
    with pytest.raises(ValidationError):
        teacher.full_clean()
        
@pytest.mark.django_db
def test_invalid_email():
    teacher = mixer.blend(Teacher,email="email")
    with pytest.raises(ValidationError):
        teacher.full_clean()
        
@pytest.mark.django_db
def test_password_should_contain_at_least_one_special_character(teacher_data):
    teacher_data['password'] = 'password1A'
    serializer = TeacherSerializer(data=teacher_data)
    assert not serializer.is_valid()
    assert 'password' in serializer.errors

@pytest.mark.django_db
def test_password_should_contain_at_least_one_digit(teacher_data):
    teacher_data['password'] = 'passwordA_'
    serializer = TeacherSerializer(data=teacher_data)
    assert not serializer.is_valid()
    assert 'password' in serializer.errors

@pytest.mark.django_db
def test_password_should_contain_at_least_one_uppercase(teacher_data):
    teacher_data['password'] = 'password1_'
    serializer = TeacherSerializer(data=teacher_data)
    assert not serializer.is_valid()
    assert 'password' in serializer.errors

@pytest.mark.django_db
def test_manager_create_user(teacher_data):
    teacher = Teacher.objects.create_user(**teacher_data)
    assert isinstance(teacher, Teacher)


def test_email_validator_invalid(monkeypatch):
    invalid_email = 'invalid_email'
    
    def mock_validate_email(email):
        raise ValidationError("Invalid email address")

    monkeypatch.setattr('user.managers.validate_email', mock_validate_email)

    with pytest.raises(ValueError, match='Invalid email address'):
        Teacher.objects.email_validator(invalid_email)

@pytest.mark.django_db
def test_manager_create_user_with_empty_first_name(teacher_data):
    teacher_data["first_name"] = ""
    with pytest.raises(ValueError, match='First name is required'):
        Teacher.objects.create_user(**teacher_data)

@pytest.mark.django_db
def test_manager_create_user_with_empty_last_name(teacher_data):
    teacher_data["last_name"] = ""
    with pytest.raises(ValueError, match='Last name is required'):
        Teacher.objects.create_user(**teacher_data)

@pytest.mark.django_db
def test_manager_create_user_with_empty_email(teacher_data):
    teacher_data["email"] = ""
    with pytest.raises(ValueError, match='An email address is required'):
        Teacher.objects.create_user(**teacher_data)

@pytest.fixture
def superuser_data():
    return {
        'first_name': 'Admin',
        'last_name': 'User',
        'email': 'admin@example.com',
        'password': 'password1A_',
    }

@pytest.mark.django_db
def test_create_superuser_success(superuser_data):
    superuser = Teacher.objects.create_superuser(**superuser_data)
    assert superuser.is_staff
    assert superuser.is_superuser
    assert superuser.is_active

@pytest.mark.django_db
def test_create_superuser_missing_is_staff(superuser_data):
    superuser_data["is_staff"]=False
    with pytest.raises(ValueError, match='Superusers must have is_staff=True'):
        Teacher.objects.create_superuser(**superuser_data)

@pytest.mark.django_db
def test_create_superuser_missing_is_superuser(superuser_data):
    superuser_data["is_superuser"]=False
    with pytest.raises(ValueError, match='Superusers must have is_superuser=True'):
        Teacher.objects.create_superuser(**superuser_data)

@pytest.mark.django_db
def test_create_superuser_missing_password(superuser_data):
    superuser_data["password"]=""
    with pytest.raises(ValueError, match='Superusers must have a password'):
        Teacher.objects.create_superuser(**superuser_data)