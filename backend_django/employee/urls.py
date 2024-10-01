from django.urls import path
from . import views

urlpatterns = [
    path('', views.employees, name='employee-list'),  # List of employees
    path('<int:pk>/', views.employee, name='employee-detail'),  # Specific employee detail
    path('register/', views.register_view, name='register'),  # New registration URL
    path('login/', views.login_view, name='login'),  # New login URL
]
