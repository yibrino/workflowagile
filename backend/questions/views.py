from rest_framework import viewsets, status
from rest_framework.response import Response

from questions.models import Question
from questions.serializers import QuestionSerializer, AnswerSerializer


class QuestionViewSet(viewsets.ViewSet):

    def list(self, request):
        pass

    def create(self, request, pk=None):
        question_text = request.data['text']
        question_score = request.data['score']
        question_topic = request.data['topic']
        question_serializer = QuestionSerializer(text=question_text, score=question_score, topic=question_topic)
        question_serializer.save()
        if pk is None:
            answers = request.data['answers']
            for answer in answers:
                answer_text = answer['text']
                answer_correct = answer['correct']
                answer_serializer = AnswerSerializer(text=answer_text, correct=answer_correct,
                                                     question=question_serializer)
                answer_serializer.save()
        if pk is not None:
            question = Question.objects.get(question_id=pk)
            question.latest_version = False
        return Response(question_serializer.data, status=status.HTTP_201_CREATED)


    def retrieve(self, request, pk=None):
        pass


class AnswerViewSet(viewsets.ViewSet):

    def create(self, request, pk=None):
        pass
