from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from questions.models import Question
from .models import ActiveExam, Exam
from .serializers import ActiveExamSerializer, ExamSerializer, ExamDetailSerializer


class ExamViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        queryset = Exam.objects.filter(teacher=request.user)
        serializer = ExamSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Exam.objects.filter(teacher=request.user, pk=pk).first()
        serializer = ExamDetailSerializer(queryset)
        return Response(serializer.data)

    def create(self, request):
        request.data["teacher"] = request.user.pk
        serializer = ExamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=['post'], url_path='create-manually')
    def create_manually(self, request):
        return Response(status=201)

    @action(detail=False, methods=['post'], url_path='create-automatically')
    def create_automatically(self, request):
        topics_questions = request.data["items"]
        questions = []
        for (topic, num_questions) in topics_questions:
            question_of_topic = Question.objects.all().filter(latest_version=True, topic=topic) \
                                    .order_by('?')[:num_questions]
            questions.extend(question_of_topic)
        serializer = ExamSerializer(questions=questions)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    """def update(self, request, pk=None):
        queryset = Exam.objects.get(pk=pk)
        serializer = ExamSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        queryset = Exam.objects.get(pk=pk)
        queryset.delete()
        return Response(status=204)
        
    def create(self, request):
        request.data["teacher"]=request.user.pk
        serializer = ExamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400) 
        
        """


class ActiveExamViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ActiveExam.objects.all()
    serializer_class = ActiveExamSerializer
