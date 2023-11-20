# views.py
import json

from rest_framework import viewsets
from rest_framework.response import Response
from .models import Question
from .serializers import QuestionWithAnswersSerializer
from .serializers import AnswerSerializer
from django.db.models import Count
from django.http import JsonResponse
from rest_framework import viewsets, status, permissions
from rest_framework.permissions import IsAuthenticated

from questions.models import Answer, Question
from questions.serializers import AnswerSerializer, QuestionSerializer
from user.models import Teacher


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionWithAnswersSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        questions = self.get_queryset()
        serializer = self.get_serializer(questions, many=True)
        for question, data in zip(questions, serializer.data):
            data['answers'] = AnswerSerializer(question.answer_set.all(), many=True).data

        return Response(serializer.data)

    @staticmethod
    def list_topics(request):
        topics_count = Question.objects.values('topic').annotate(count=Count('topic'))
        unique_topics = [item['topic'] for item in topics_count]
        unique_topics.append("Scrum")
        return JsonResponse(unique_topics, safe=False)

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
                answer = Answer(question=answer_data['question'], text=answer_data['text'],
                                correct=answer_data['isCorrect'] or False)
                answer.save()
            if pk is not None:
                question = Question.objects.get(question_id=pk)
                question.latest_version = False
                question.save()

            return JsonResponse(QuestionSerializer(question).data, safe=False, status=status.HTTP_201_CREATED)

        return JsonResponse(question_serializer.errors, safe=False, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def import_json(request):

        if 'questions' not in request.data:
            return JsonResponse('No root called questions', safe=False, status=status.HTTP_400_BAD_REQUEST)

        questions = request.data['questions']
        teacher = Teacher.objects.get(email=request.user)
        errors = []

        for question in questions:
            if not all(k in question for k in ('text', 'score', 'topic')):
                errors.append('Missing mandatory field (text, score, topic)')

            else:

                question_serializer = QuestionSerializer(
                    data={'teacher': teacher.pk, 'text': question['text'], 'score': question['score'],
                          'topic': question['topic']}
                )

                if question_serializer.is_valid():
                    saved_question = question_serializer.save()
                    answers = question['answers']
                    for answer_data in answers:
                        answer = Answer(question=saved_question, text=answer_data['text'],
                                        correct=answer_data['correct'] or False)
                        answer.save()
                else:
                    errors.append(QuestionSerializer(question).data)

        if errors:
            return JsonResponse(errors, safe=False, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            return JsonResponse(len(questions), safe=False, status=status.HTTP_200_OK)

    @staticmethod
    def retrieve(request, pk=None):
        try:
            question = Question.objects.get(question_id=pk)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)

        question_serializer = QuestionSerializer(question)
        serialized_data = question_serializer.data

        # Retrieve answers related to the question
        answers = Answer.objects.filter(question=question)
        answer_serializer = AnswerSerializer(answers, many=True)

        serialized_data['answers'] = answer_serializer.data

        return Response(serialized_data, status=status.HTTP_200_OK)
