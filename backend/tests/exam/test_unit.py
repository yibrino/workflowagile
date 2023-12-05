from exam.models import ActiveExam, Exam
from exam.serializers import ActiveExamDetailSerializer, ActiveExamSerializer, ActiveExamToStudentsSerializer, ExamSerializer
import pytest
from django.core.exceptions import ValidationError
from mixer.backend.django import mixer
from django.utils import timezone
from questions.models import Answer, Question
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

@pytest.mark.django_db
def test_get_is_active(create_teacher):
    exam = Exam.objects.create(
        teacher=create_teacher,
        title='Test Title',
        description='Test Description',
    )
    active_exam = ActiveExam.objects.create(
        exam=exam,
        start_date=timezone.now() - timezone.timedelta(minutes=20),
        end_date=timezone.now() - timezone.timedelta(minutes=10),
    )
    serializer = ExamSerializer(instance=exam)
    is_active = serializer.get_is_active(exam)

    assert not is_active
    assert ActiveExam.objects.filter(pk=active_exam.pk).first() == None

@pytest.mark.django_db
def test_get_duration(create_teacher):
    exam = Exam.objects.create(
        teacher=create_teacher,
        title='Test Title',
        description='Test Description',
    )

    date = timezone.now()
    start_date = date
    end_date = date
    active_exam_instance = ActiveExam(exam=exam, start_date=start_date, end_date=end_date)
    serializer = ActiveExamDetailSerializer(instance=active_exam_instance)
    result = serializer.get_duration(active_exam_instance)
    expected_duration = (end_date - start_date).total_seconds()

    assert result == expected_duration

@pytest.mark.django_db
def test_get_duration_with_none_dates(create_teacher):
    exam = Exam.objects.create(
        teacher=create_teacher,
        title='Test Title',
        description='Test Description',
    )
    active_exam_instance = ActiveExam(exam=exam, start_date=None, end_date=None)
    serializer = ActiveExamDetailSerializer(instance=active_exam_instance)
    serializer1 = ActiveExamSerializer(instance=active_exam_instance)
    serializer2 = ActiveExamToStudentsSerializer(instance=active_exam_instance)

    assert serializer.get_duration(active_exam_instance) is None
    assert serializer1.get_duration(active_exam_instance) is None
    assert serializer2.get_duration(active_exam_instance) is None
