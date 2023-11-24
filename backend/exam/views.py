"""from rest_framework import viewsets,response
from .models import Exam
from .serializers import ExamDetailSerializer, ExamSerializer
from rest_framework.permissions import IsAuthenticated

class ExamViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    
    def get_serializer_class(self):
        print(self.action)
        if self.action=="list":
            return ExamDetailSerializer
        return ExamSerializer"""
        
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Exam
from .serializers import ExamSerializer, ExamDetailSerializer

class ExamViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        queryset = Exam.objects.filter(teacher=request.user)
        serializer = ExamSerializer(queryset,many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Exam.objects.filter(teacher=request.user,pk=pk)
        serializer = ExamDetailSerializer(queryset,many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='create-manually')
    def create_manually(self, request):
        return Response(status=201)

    @action(detail=False, methods=['post'], url_path='create-automatically')
    def create_automatically(self, request):
        request.data["teacher"]=request.user.pk
        serializer = ExamSerializer(data=request.data)
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