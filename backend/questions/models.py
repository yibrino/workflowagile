from django.db import models

from user.models import Teacher


class Question(models.Model):
    question_id = models.AutoField(primary_key=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    text = models.TextField()
    score = models.IntegerField()
    topic = models.CharField(max_length=100, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    latest_version = models.BooleanField(default=True)


class Answer(models.Model):
    answer_id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    correct = models.BooleanField()
    latest_version = models.BooleanField(default=True)
