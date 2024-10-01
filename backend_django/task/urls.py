from django.urls import path
from .views import tasks, complete_task, task

urlpatterns = [
    path('', tasks, name='task-list'),
    path('<int:pk>/',task, name='task-detail'),  
    path('<int:pk>/complete/', complete_task, name='complete-task'),
]
