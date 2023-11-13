from rest_framework import viewsets, status
from rest_framework.response import Response

from questions.models import Question
from questions.serializers import QuestionSerializer, AnswerSerializer


class QuestionViewSet(viewsets.ViewSet):

    @staticmethod
    def list(request):
        questions = Question.objects.all()
        question_serializer = QuestionSerializer(questions, many=True)
        return Response(question_serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def create(request, pk=None):
        question_text = request.data['text']
        question_score = request.data['score']
        question_topic = request.data['topic']
        question_serializer = QuestionSerializer(
            data={'text': question_text, 'score': question_score, 'topic': question_topic})
        if question_serializer.is_valid():
            question = question_serializer.save()

            answers_data = request.data.get('answers', [])  # Ottieni la lista delle risposte
            answer_serializer_list = []
            for answer_data in answers_data:
                answer_data['question'] = question.id  # Collega la risposta alla nuova domanda
                answer_serializer = AnswerSerializer(data=answer_data)
                if answer_serializer.is_valid():
                    answer_serializer.save()
                    answer_serializer_list.append(answer_serializer)

            if pk is not None:
                question = Question.objects.get(question_id=pk)
                question.latest_version = False
                question.save()

            return Response(QuestionSerializer(question).data, status=status.HTTP_201_CREATED)

        return Response(question_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def retrieve(request, pk=None):
        question = Question.objects.get(question_id=pk)
        question_serializer = QuestionSerializer(question)
        return Response(question_serializer.data, status=status.HTTP_200_OK)
