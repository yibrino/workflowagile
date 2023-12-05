from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActiveExamViewSet, ExamViewSet

router = DefaultRouter()
router.register(r'exams', ExamViewSet, basename='exam')
router.register(r'active-exam', ActiveExamViewSet, basename='active_exam')

urlpatterns = [
    path('', include(router.urls)),
    path('exams/create', ExamViewSet.as_view({'post': 'create_manually'}), name='create-manually'),
]
