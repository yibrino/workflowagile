import pytest

from exam.models import Exam
from questions.models import Question
from user.models import Teacher


@pytest.fixture
def create_teacher():
    teacher = Teacher.objects.create(first_name="Firstname", last_name="Lastname", email="e@example.com",
                                     password='password1A_')
    return teacher


@pytest.fixture
def create_questions(create_teacher):
    created_teacher = create_teacher
    question1 = Question.objects.create(
        teacher=create_teacher,
        text="What is the capital of France?",
        score=10,
        topic="Geography"
    )
    question2 = Question.objects.create(
        teacher=created_teacher, text='What is your favorite color?',
        score=8,
        topic="Colors"
    )
    return [question1, question2]


@pytest.mark.django_db
def test_exam_model(create_teacher, create_questions):
    teacher = create_teacher
    question1, question2 = create_questions

    exam = Exam.objects.create(
        teacher=teacher,
        title='Sample Exam',
        description='This is a sample exam',
    )
    exam.questions.add(question1, question2)
    saved_exam = Exam.objects.get(pk=exam.exam_id)

    assert saved_exam.teacher == teacher
    assert saved_exam.title == 'Sample Exam'
    assert saved_exam.description == 'This is a sample exam'
    assert saved_exam.created_at is not None
    assert saved_exam.questions.count() == 2
    assert set(saved_exam.questions.all()) == set([question1, question2])
