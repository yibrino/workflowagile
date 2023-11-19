from rest_framework import serializers

from .models import Question, Answer
# serializers.py
from rest_framework import serializers

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['answer_id', 'text', 'created_at', 'correct']

class QuestionWithAnswersSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['question_id', 'teacher', 'text', 'score', 'topic', 'created_at', 'latest_version', 'answers']
