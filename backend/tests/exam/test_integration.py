from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from exam.models import Exam
from exam.serializers import ExamDetailSerializer, ExamSerializer
from questions.models import Question
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
        self.question1 = Question.objects.create(teacher=self.user, text='Textqqqq', score=5, topic='Topic')


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
        self.assertEqual(response.data['teacher'], 1)
        self.assertEqual(response.data['exam_id'], 3)
        self.assertEqual(len(response.data['questions']), 1)
