import secrets
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from questions.models import Question
from .models import ActiveExam, Exam
from .serializers import ActiveExamDetailSerializer, ActiveExamSerializer, ActiveExamToStudentsSerializer, ExamSerializer, ExamDetailSerializer
from django.core.cache import cache
from django.db.models import Q, F

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
        exam_title = request.data['title']
        exam_description = request.data['description']
        questions = request.data['questions']
        exam_questions = []

        for question in questions:
            exam_questions.append(question['question_id'])

        exam_serializer = ExamSerializer(
            data={
                'teacher': request.user.pk,
                'title': exam_title,
                'description': exam_description,
                'questions': exam_questions
            }
        )
        exam_serializer.is_valid(raise_exception=True)
        exam_serializer.save()

        return Response(exam_serializer.data, status=201)

    @action(detail=False, methods=['post'], url_path='create-automatically')
    def create_automatically(self, request):
        title = request.data["title"]
        description = request.data["description"]
        topics_questions = request.data["requestData"]["items"]
        questions = []
        for dictionary in topics_questions:
            topic = dictionary['topic']
            num_questions = dictionary['num_questions']
            questions_of_topic = Question.objects.all().filter(
                    latest_version=True, topic=topic
                )\
                .order_by('?')[:num_questions]
            for question in questions_of_topic:
                questions.append(question.pk)
        exam_serializer = ExamSerializer(
            data={'teacher': request.user.pk, 'title': title, 'description': description,
                  'questions': questions
                  }
        )
        exam_serializer.is_valid(raise_exception=True)
        exam_serializer.save()
        return Response(status=201)
    
class ActiveExamViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ActiveExam.objects.filter()
    serializer_class = ActiveExamDetailSerializer
    
    def create(self, request, *args, **kwargs):
        self.serializer_class = ActiveExamSerializer
        token = secrets.token_hex(6)
        token = token[:6]
        request.data["token"] = token
        current_time = timezone.now()
        request.data["start_date"] = current_time
        if not request.data.get("end_date"):
            request.data["end_date"]=current_time
        response = super().create(request, *args, **kwargs)
        queryset = ActiveExam.objects.filter(active_exam_id=response.data["active_exam_id"]).first()
        serializer = ActiveExamToStudentsSerializer(queryset)
        duration = serializer.data["duration"]
        timeout = duration if duration > 0 else None
        cache.set(token, serializer.data, timeout=timeout)
        return Response(status=201)
    
    def get_queryset(self):
        return ActiveExam.objects.filter(Q(end_date__gt=timezone.now()) | Q(end_date__exact=F('start_date')))
    
    @action(detail=False, methods=['get'], url_path='get-exam')
    def get_exam(self, request):
        token = request.query_params.get('token')
        if token:
            token = token.strip()
            cached_exam_data = cache.get(token)
            if cached_exam_data:
                return Response(cached_exam_data)
            else:
                exam = ActiveExam.objects.filter(token=token).first()
                if exam:
                    exam_serializer = ActiveExamToStudentsSerializer(exam)
                    duration = exam_serializer.data["duration"]
                    timeout = duration if duration > 0 else None
                    cache.set(token, exam_serializer.data, timeout=timeout)   
                    return Response(exam_serializer.data)  
            return Response({'detail': 'Exam not found'}, status=404)
        else:
            return Response({'detail': 'Token parameter is missing'}, status=400)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if cache.get(instance.token):
            cache.delete(instance.token)
        self.perform_destroy(instance)
        return Response(status=204)

