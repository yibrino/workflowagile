from exam.models import ActiveExam, Exam
from questions.serializers import QuestionSerializer, QuestionToStudentSerializer, QuestionWithAnswersSerializer
from rest_framework import serializers
from django.utils import timezone

class ExamSerializer(serializers.ModelSerializer):
    is_active = serializers.SerializerMethodField()
    class Meta:
        model = Exam
        fields = ['exam_id', 'teacher', 'title', 'description', 'created_at', 'questions', 'is_active']
    
    def get_is_active(self, obj):
        active_exam = ActiveExam.objects.filter(exam=obj).first()
        if active_exam and active_exam.end_date<timezone.now() and active_exam.end_date!=active_exam.start_date:
            ActiveExam.delete(active_exam)
            return False
        return active_exam and (active_exam.end_date>timezone.now() or active_exam.end_date==active_exam.start_date)

class ExamDetailSerializer(serializers.ModelSerializer):
    questions = QuestionWithAnswersSerializer(many=True, read_only=True)
    class Meta:
        model = Exam
        fields = ['exam_id', 'title', 'description', 'created_at', 'questions']
        
        

class ActiveExamSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = ActiveExam
        fields = ['active_exam_id', 'exam', 'start_date', 'end_date', 'token', 'duration']
    
    def get_duration(self, obj):
        if obj.start_date and obj.end_date:
            return (obj.end_date - obj.start_date).total_seconds()/60
        else:
            return None


class ActiveExamDetailSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    exam = ExamSerializer(read_only=True)
    
    class Meta:
        model = ActiveExam
        fields = ['active_exam_id', 'exam', 'start_date', 'end_date', 'token', 'duration']
        
    def get_duration(self, obj):
        if obj.start_date and obj.end_date:
            return (obj.end_date - obj.start_date).total_seconds()
        else:
            return None

class ExamToStudentsSerializer(serializers.ModelSerializer):
    questions = QuestionToStudentSerializer(many=True, read_only=True)
    class Meta:
        model = Exam
        fields = ['exam_id', 'title', 'description', 'questions']
        
class ActiveExamToStudentsSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    exam = ExamToStudentsSerializer(read_only=True)
    
    class Meta:
        model = ActiveExam
        fields = ['active_exam_id', 'exam', 'start_date', 'end_date', 'token', 'duration']
        
    def get_duration(self, obj):
        if obj.start_date and obj.end_date:
            return (obj.end_date - obj.start_date).total_seconds()//60
        else:
            return None
