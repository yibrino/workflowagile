from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from questions.models import Question
from user.models import Teacher


class QuestionIntegrationTest(APITestCase):

    def setUp(self):
        self.user = Teacher.objects.create_user(
            first_name='Firstname',
            last_name='Lastname',
            email='test@example.com',
            password='password1A_'
        )
        self.client.force_authenticate(user=self.user)

    def test_list_questions(self):
        url = reverse('question-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_topics(self):
        url = reverse('question-list-topics')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_question(self):
        teacher = Teacher.objects.create(first_name="John", last_name="Doe", email="john@example.com")
        data = {
            'text': 'What is the capital of Spain?',
            'score': 10,
            'topic': 'Geography',
            'teacher': teacher.id
        }
        url = reverse('question-create')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_question(self):
        teacher = Teacher.objects.create(first_name="John", last_name="Doe", email="john@example.com")
        question = Question.objects.create(
            teacher=teacher,
            text="What is the capital of Italy?",
            score=10,
            topic="Geography"
        )
        url = reverse('question-retrieve', args=[question.question_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_import_json(self):
        teacher = Teacher.objects.create(first_name="John", last_name="Doe", email="john@example.com")

        data = [
            {
                "question_id": 1,
                "topic": "Scrum",
                "text": "What is the role of a Scrum Master?",
                "score": 1,
                "latest_version": True,
                "answers": [
                    {
                        "text": "Facilitator",
                        "correct": True
                    },
                    {
                        "text": "Servant-leader",
                        "correct": False
                    },
                    {
                        "text": "Coach",
                        "correct": True
                    },
                    {
                        "text": "None of the above",
                        "correct": False
                    }
                ]
            },
            {
                "question_id": 2,
                "topic": "Agile_Methodology",
                "text": "What does the term 'Sprint' mean in Agile?",
                "score": 2,
                "latest_version": False,
                "answers": [
                    {
                        "text": "Time-boxed iteration",
                        "correct": False
                    },
                    {
                        "text": "Project deadline",
                        "correct": True
                    },
                    {
                        "text": "Daily meeting",
                        "correct": False
                    },
                    {
                        "text": "Release cycle",
                        "correct": False
                    }
                ]
            }
        ]

        url = reverse('import-json')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_import_json_without_score_throws_422(self):
        teacher = Teacher.objects.create(first_name="John", last_name="Doe", email="john@example.com")
        data = {
            'text': 'What is the capital of Spain?',
            'score': 10,
            'topic': 'Geography',
            'teacher': teacher.id
        }

        data = {
            "questions": [
                {
                    "topic": "Scrum",
                    "text": "What is the role of a Scrum Master?",
                    "answers": [
                        {
                            "text": "Facilitator",
                            "correct": True
                        },
                        {
                            "text": "Servant-leader",
                            "correct": False
                        },
                        {
                            "text": "Coach",
                            "correct": True
                        },
                        {
                            "text": "None of the above",
                            "correct": False
                        }
                    ]
                }
            ]
        }
        url = reverse('import-json')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY)
