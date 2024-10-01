from django.urls import path
from . import views

urlpatterns = [
    path('', views.employees),         # Change from '/' to ''
    path('<int:pk>/', views.employee), # Change from '/<int:pk>' to '<int:pk>/'
]
