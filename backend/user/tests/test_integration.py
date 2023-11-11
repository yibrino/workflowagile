from rest_framework import status
from django.urls import reverse
from user.models import Teacher
from rest_framework.test import APITestCase


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