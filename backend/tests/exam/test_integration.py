from django.urls import reverse
from django.core.cache import cache
from django.utils import timezone
from exam.models import ActiveExam, Exam
from exam.serializers import ActiveExamToStudentsSerializer, ExamDetailSerializer, ExamSerializer
from questions.models import Question
from rest_framework.test import APITestCase
from rest_framework import status
from user.models import Teacher


class ExamViewSetAPITestCase(APITestCase):
    def setUp(self):
        self.user = Teacher.objects.create_user(
            first_name='Firstname',
            last_name='Lastname',
            email='test@example.com',
            password='password1A_'
        )
        self.client.force_authenticate(user=self.user)
        self.exam1 = Exam.objects.create(teacher=self.user, title='Exam 1', description='Description 1')
        self.exam2 = Exam.objects.create(teacher=self.user, title='Exam 2', description='Description 2')

    def test_list_exams(self):
        url = reverse('exam-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_data = ExamSerializer(Exam.objects.filter(teacher=self.user), many=True).data
        self.assertEqual(response.data, expected_data)

    def test_retrieve_exam(self):
        url = reverse('exam-detail', args=[self.exam1.exam_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_data = ExamDetailSerializer(Exam.objects.get(exam_id=self.exam1.exam_id)).data
        self.assertEqual(response.data, expected_data)
        
    def test_post_exam(self):
        Question.objects.create(teacher=self.user, text='Textqqqq', score=5, topic='Topic')
        url = reverse('create-manually')
        data = {
          "title": "Exam 1",
          "description": "Description 1",
          "questions": [
            {
              "question_id": 1,
              "teacher": 1,
              "text": "Text",
              "score": 5,
              "topic": "Topic"
            }
          ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        expected_data = ExamDetailSerializer(Exam.objects.get(exam_id=self.exam1.exam_id)).data
        self.assertEqual(response.data['title'], expected_data['title'])
        self.assertEqual(response.data['description'], expected_data['description'])
        self.assertEqual(response.data['teacher'], self.user.pk)
        self.assertEqual(len(response.data['questions']), 1)

    def test_post_exam_questions_not_found_throws_error(self):
        url = reverse('create-manually')
        data = {
          "title": "Exam 1",
          "description": "Description 1",
          "questions": [
            {
              "question_id": 1
            }
          ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_exam_without_questions_throws_error(self):
        url = reverse('create-manually')
        data = {
          "title": "Exam 1",
          "description": "Description 1",
          "questions": []
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ActiveExamViewSetTests(APITestCase):
    def setUp(self):
        self.user = Teacher.objects.create_user(
            first_name='Firstname',
            last_name='Lastname',
            email='test@example.com',
            password='password1A_'
        )
        self.client.force_authenticate(user=self.user)
        self.exam = Exam.objects.create(teacher=self.user, title='Exam 1', description='Description 1')

    def test_create_active_exam(self):
        url = reverse('active_exam-list')

        data = {
            'exam': self.exam.exam_id,
            'start_date': timezone.now(),
            'end_date': timezone.now(),
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_active_exam_with_valid_token(self):
        active_exam = ActiveExam.objects.create(
            exam=self.exam,
            start_date=timezone.now(),
            end_date=timezone.now() + timezone.timedelta(minutes=10),
            token='123456',
        )
        serializer = ActiveExamToStudentsSerializer(active_exam)
        cache_key = active_exam.token
        cache.set(cache_key, serializer.data, timeout=None)
        url = reverse('active_exam-get-exam')
        params = {'token': cache_key}
        response = self.client.get(url, params, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_exam_with_invalid_token(self):
        invalid_token = 'invalid-token'
        url = reverse('active_exam-get-exam')
        params = {'token': invalid_token}
        response = self.client.get(url, params, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'detail': 'Exam not found'})

    def test_get_exam_without_token_parameter(self):
        url = reverse('active_exam-get-exam')
        response = self.client.get(url,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'detail': 'Token parameter is missing'})

    def test_destroy_active_exam(self):
        active_exam = ActiveExam.objects.create(
            exam=self.exam,
            start_date=timezone.now(),
            end_date=timezone.now() + timezone.timedelta(minutes=10),
            token='123456',
        )
        cache_key = active_exam.token
        serializer = ActiveExamToStudentsSerializer(active_exam)
        cache.set(cache_key, serializer.data, timeout=None)
        print(active_exam.pk)
        url = reverse('active_exam-detail', args=[active_exam.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertIsNone(cache.get(cache_key))
