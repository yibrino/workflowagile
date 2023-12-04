# Register your models here.
from django.contrib import admin

from .models import Answer
from .models import Question

admin.site.register(Answer)
admin.site.register(Question)
