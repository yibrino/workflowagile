from exam.models import ActiveExam, Exam
from questions.serializers import QuestionSerializer, QuestionWithAnswersSerializer
from rest_framework import serializers

class ExamSerializer(serializers.ModelSerializer):
    is_active = serializers.SerializerMethodField()
    class Meta:
        model = Exam
        fields = ['exam_id', 'teacher', 'title', 'description', 'created_at', 'questions', 'is_active']
    
    def get_is_active(self, obj):
        active_exam = ActiveExam.objects.filter(exam=obj).first()
        return active_exam != None

class ExamDetailSerializer(serializers.ModelSerializer):
    questions = QuestionWithAnswersSerializer(many=True, read_only=True)
    class Meta:
        model = Exam
        fields = ['exam_id', 'title', 'description', 'created_at', 'questions']
        
class ActiveExamSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    class Meta:
        model = ActiveExam
        fields = ['active_exam_id', 'exam', 'activated_at', 'start_date', 'end_date', 'token', 'duration']
    
    def get_duration(self, obj):
        if obj.start_date and obj.end_date:
            return (obj.end_date - obj.start_date).total_seconds()
        else:
            return None