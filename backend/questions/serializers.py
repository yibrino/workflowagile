# serializers.py
from rest_framework import serializers

from .models import Question, Answer


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['answer_id', 'text', 'created_at', 'correct']


class QuestionWithAnswersSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['question_id', 'teacher', 'text', 'score', 'topic', 'created_at', 'latest_version', 'answers']

class AnswerToStudentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['answer_id', 'text']
          
class QuestionToStudentSerializer(serializers.ModelSerializer):
    answers = AnswerToStudentsSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['question_id', 'text', 'score', 'answers']