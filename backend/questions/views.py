from django.db.models import Count
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from questions.models import Answer, Question
from questions.serializers import QuestionSerializer, AnswerSerializer
from user.models import Teacher


class QuestionViewSet(viewsets.ViewSet):
    permission_classes=[IsAuthenticated]
    @staticmethod
    def list(request):
        questions = Question.objects.all()
        question_serializer = QuestionSerializer(questions, many=True)
        return JsonResponse(question_serializer.data, safe=False)

    @staticmethod
    def list_topics(request):
        topics_count = Question.objects.values('topic').annotate(count=Count('topic'))
        unique_topics = [item['topic'] for item in topics_count]
        unique_topics.append("Scrum")
        return JsonResponse(unique_topics, safe=False)
        return Response({'topics': unique_topics}, status=200)

    @staticmethod
    def create(request, pk=None):
        question_text = request.data['text']
        question_score = request.data['score']
        question_topic = request.data['topic']
        teacher = Teacher.objects.get(email=request.user)
        question_serializer = QuestionSerializer(
            data={'teacher': teacher.pk, 'text': question_text, 'score': question_score,
                  'topic': question_topic})
        if question_serializer.is_valid():
            question = question_serializer.save()
            answers_data = request.data.get('answers', [])  # Ottieni la lista delle risposte
            for answer_data in answers_data:
                answer_data['question'] = question  # Collega la risposta alla nuova domanda
                answer = Answer(question=answer_data['question'],text=answer_data['text'],correct=answer_data['isCorrect'] or False)
                answer.save()
            if pk is not None:
                question = Question.objects.get(question_id=pk)
                question.latest_version = False
                question.save()

            return JsonResponse(QuestionSerializer(question).data,safe=False, status=status.HTTP_201_CREATED)

        return JsonResponse(question_serializer.errors, safe=False, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def retrieve(request, pk=None):
        question = Question.objects.get(question_id=pk)
        question_serializer = QuestionSerializer(question)
        return Response(question_serializer.data, status=status.HTTP_200_OK)
