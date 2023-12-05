from django.db import models
from questions.models import Question
from user.models import Teacher

class Exam(models.Model):
    exam_id = models.BigAutoField(primary_key=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    description = models.TextField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    questions = models.ManyToManyField(Question, related_name='exams')
   

class ActiveExam(models.Model):
    active_exam_id = models.BigAutoField(primary_key=True)
    exam = models.OneToOneField(Exam, on_delete=models.CASCADE, unique=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    token = models.CharField(max_length=6,unique=True)
