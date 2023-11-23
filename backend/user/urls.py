from django.urls import re_path

from user import views

urlpatterns = [
    re_path(r'^register', views.RegisterView.as_view(), name='register_teacher'),
    re_path(r'^login', views.LoginView.as_view(), name='login_teacher'),
    re_path(r'^logout', views.LogoutView.as_view(), name='logout_teacher'),
    re_path(r'^refreshToken', views.CookieTokenRefreshView.as_view(), name='refresh_token'),
    re_path(r'^teacher', views.TeacherView.as_view(), name='get_teacher'),
]
