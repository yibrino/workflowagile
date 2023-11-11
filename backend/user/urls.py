from django.urls import re_path
from user import views

urlpatterns = [
    re_path(r'^register', views.RegisterView.as_view(), name='register_teacher'),
    re_path(r'^login', views.LoginView.as_view(), name='login_teacher')
]