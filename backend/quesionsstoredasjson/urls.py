# api/urls.py
from django.urls import path
from .views import get_items
urlpatterns=[path('jsonquestions/',get_items,name='get_items')]
