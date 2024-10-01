from django.urls import path
from . import views

urlpatterns = [
    path('', views.departments),          # Change from '/' to ''
    path('<int:pk>/', views.department),  # Change from '/<int:pk>' to '<int:pk>/'
]
