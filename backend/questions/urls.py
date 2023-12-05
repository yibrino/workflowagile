from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import QuestionViewSet

router = DefaultRouter()
router.register(r'questions', QuestionViewSet, basename='question')

urlpatterns = [
    path('', include(router.urls)),
    path('topics', QuestionViewSet.as_view({'get': 'list_topics'}), name='question-list-topics'),
    path('question/<int:pk>', QuestionViewSet.as_view({'get': 'retrieve'}), name='question-retrieve'),
    path('questions/create', QuestionViewSet.as_view({'post': 'create'}), name='question-create'),
    path('questions/update-latest-version/<int:pk>/', QuestionViewSet.as_view({'patch': 'update_latest_version'}), name='update-latest-version'),    path('questions/create', QuestionViewSet.as_view({'post': 'create'}), name='question-create'),

    path('questions/', QuestionViewSet.as_view({'get': 'list'}), name='question-list'),
    path('questions/import', QuestionViewSet.as_view({'post': 'import_json'}), name='import-json'),
    # Aggiunta questa riga
]
