from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExamViewSet

router = DefaultRouter()
router.register(r'exams', ExamViewSet, basename='exam')

urlpatterns = router.urls