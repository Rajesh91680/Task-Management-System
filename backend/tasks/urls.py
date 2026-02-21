from django.urls import path
from .views import get_tasks

urlpatterns = [
    # This just handles your tasks now!
    path('', get_tasks, name='tasks'),
]