from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from questions.models import Question
from user.models import Teacher


class QuestionIntegrationTest(APITestCase):

    def setUp(self):
        self.teacher = Teacher.objects.create(
            first_name="John",
            last_name="Doe",
            email="john@example.com"
        )
        self.question_data = {
            'text': 'What is the capital of Spain?',
            'score': 10,
            'topic': 'Geography',
            'teacher': self.teacher.id
        }
        self.url_create = reverse('question-create')
        self.url_list = reverse('question-list')

    def test_create_and_retrieve_question_integration(self):
        # Crea una nuova domanda
        response_create = self.client.post(self.url_create, self.question_data, format='json')
        self.assertEqual(response_create.status_code, status.HTTP_201_CREATED)

        # Ottieni l'ID della nuova domanda creata
        question_id = response_create.data['question_id']

        # Recupera la domanda appena creata
        response_retrieve = self.client.get(reverse('question-retrieve', args=[question_id]))
        self.assertEqual(response_retrieve.status_code, status.HTTP_200_OK)

        # Verifica che i dati della domanda recuperata corrispondano ai dati inviati inizialmente
        self.assertEqual(response_retrieve.data['text'], self.question_data['text'])
        self.assertEqual(response_retrieve.data['score'], self.question_data['score'])
        self.assertEqual(response_retrieve.data['topic'], self.question_data['topic'])
        self.assertEqual(response_retrieve.data['teacher'], self.teacher.id)

    def test_list_questions_integration(self):
        # Crea alcune domande per il test
        Question.objects.create(
            teacher=self.teacher,
            text='What is the capital of France?',
            score=10,
            topic='Geography'
        )
        Question.objects.create(
            teacher=self.teacher,
            text='What is the capital of Italy?',
            score=15,
            topic='Geography'
        )

        # Esegue una richiesta GET per ottenere la lista delle domande
        response_list = self.client.get(self.url_list)
        self.assertEqual(response_list.status_code, status.HTTP_200_OK)

        # Verifica che ci siano almeno due domande nella risposta
        self.assertGreaterEqual(len(response_list.data), 2)
