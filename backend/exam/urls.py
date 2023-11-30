from rest_framework.routers import DefaultRouter

from .views import ActiveExamViewSet, ExamViewSet

router = DefaultRouter()
router.register(r'exams', ExamViewSet, basename='exam')
router.register(r'active-exam', ActiveExamViewSet, basename='active_exam')
urlpatterns = router.urls
