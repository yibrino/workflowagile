from exam.models import ActiveExam, Exam
from questions.serializers import QuestionSerializer
from rest_framework import serializers

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['exam_id', 'teacher', 'title', 'description', 'created_at', 'questions']
        
class ExamDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Exam
        fields = ['exam_id', 'title', 'description', 'created_at', 'questions']
        
class ActiveExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActiveExam
        fields = ['active_exam_id', 'exam', 'activated_at', 'duration', 'token']