from django.urls import path
from .views import tasks, complete_task

urlpatterns = [
    path('', tasks, name='task-list'),
    path('<int:pk>/complete/', complete_task, name='complete-task'),
]
