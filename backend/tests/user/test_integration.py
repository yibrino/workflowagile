from django.conf import settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from user.models import Teacher


class RegisterViewTests(APITestCase):
    def setUp(self):
        self.teacher_data = {
            'first_name': 'Firstname',
            'last_name': 'Lastname',
            'email': 'a@a.com',
            'password': 'password1A_',
            'repeat_password': 'password1A_',
        }
        self.url = reverse('register_teacher')

    def test_create_teacher_valid_data(self):
        response = self.client.post(self.url, self.teacher_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_teacher_invalid_data(self):
        self.teacher_data['first_name'] = 'Firstname1'  # Invalid data
        response = self.client.post(self.url, self.teacher_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Teacher.objects.count(), 0)

    def test_mismatch_passwords(self):
        self.teacher_data['repeat_password'] = 'abcd'
        response = self.client.post(self.url, self.teacher_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_repeat_password(self):
        self.teacher_data.pop('repeat_password')
        response = self.client.post(self.url, self.teacher_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_teacher_with_missing_field(self):
        del self.teacher_data['email']  # Missing 'email' field
        response = self.client.post(self.url, self.teacher_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Teacher.objects.count(), 0)


class LoginViewTests(APITestCase):
    def setUp(self):
        self.user = Teacher.objects.create_user(
            first_name='Firstname',
            last_name='Lastname',
            email='test@example.com',
            password='password1A_'
        )
        self.login_url = reverse('login_teacher')

    def test_successful_login(self):
        data = {
            'email': 'test@example.com',
            'password': 'password1A_',
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn('access', response.cookies.keys())
        self.assertIn('refresh', response.cookies.keys())

    def test_user_not_found(self):
        data = {
            'email': 'nonexistent@example.com',
            'password': 'password1A_',
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('access', response.cookies.keys())
        self.assertNotIn('refresh', response.cookies.keys())

    def test_incorrect_password(self):
        data = {
            'email': 'test@example.com',
            'password': 'password1B_',
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('access', response.cookies.keys())
        self.assertNotIn('refresh', response.cookies.keys())


class LogoutViewTests(APITestCase):
    def setUp(self):
        self.user = Teacher.objects.create_user(
            first_name='Firstname',
            last_name='Lastname',
            email='test@example.com',
            password='password1A_'
        )
        self.client.force_authenticate(user=self.user)
        self.logout_url = reverse('logout_teacher')

    def test_successful_logout(self):
        response = self.client.post(self.logout_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual("", response.cookies['access'].value)
        self.assertIn("", response.cookies['refresh'].value)


class CookieTokenRefreshViewTests(APITestCase):

    def setUp(self):
        self.user = Teacher.objects.create_user(
            first_name='Firstname',
            last_name='Lastname',
            email='test@example.com',
            password='password1A_'
        )
        self.url = reverse('refresh_token')
        self.client.force_authenticate(user=self.user)
        self.refresh_token = str(RefreshToken.for_user(self.user))

    def test_refresh_token_success(self):
        self.client.cookies[settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH']] = self.refresh_token

        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.json())
        self.assertIn(settings.SIMPLE_JWT['AUTH_COOKIE'], response.cookies)

    def test_refresh_token_expired(self):
        self.client.cookies[settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH']] = 'expired_refresh_token'

        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json()['code'], 'token_not_valid')

    def test_refresh_token_missing(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['detail'], 'No valid refresh token found in cookie')


class TeacherViewTest(APITestCase):

    def setUp(self):
        self.user = Teacher.objects.create_user(
            first_name='Firstname',
            last_name='Lastname',
            email='test@example.com',
            password='password1A_'
        )
        self.client.force_authenticate(user=self.user)
        self.url = reverse('get_teacher')

    def test_get_teacher(self):
        # Test GET request to the endpoint
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_teacher(self):
        # Test PATCH request to the endpoint
        data = {
            "email": "new_email@example.com",
            "password": "password1B_",
            "repeat_password": "password1B_",
            "first_name": "NewFirstName",
            "last_name": "NewLastName",
        }
        response = self.client.patch(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_teacher_different_repeat_password(self):
        # Test PATCH request to the endpoint
        data = {
            "email": "new_email@example.com",
            "password": "password1B_",
            "repeat_password": "password1C_",
            "first_name": "NewFirstName",
            "last_name": "NewLastName",
        }
        response = self.client.patch(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Passwords don't match", response.json()['Error'])

    def test_delete_teacher(self):
        # Test DELETE request to the endpoint
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
