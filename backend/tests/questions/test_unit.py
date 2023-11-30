import pytest

from questions.models import Question, Answer
from user.models import Teacher


@pytest.mark.django_db
def test_question_model():
    teacher = Teacher.objects.create(first_name="John", last_name="Doe", email="john@example.com")
    question = Question.objects.create(
        teacher=teacher,
        text="What is the capital of France?",
        score=10,
        topic="Geography"
    )
    assert "What is the capital of France?", question.text


@pytest.mark.django_db
def test_answer_model():
    teacher = Teacher.objects.create(first_name="John", last_name="Doe", email="john@example.com")
    question = Question.objects.create(
        teacher=teacher,
        text="What is the capital of France?",
        score=10,
        topic="Geography"
    )
    answer = Answer.objects.create(
        question=question,
        text="Paris",
        correct=True
    )
    assert str(answer), answer.text


"""
class QuestionViewSetTest(APITestCase):

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
"""
