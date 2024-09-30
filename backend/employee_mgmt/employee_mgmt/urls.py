"""
URL configuration for employee_mgmt project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.views import UserCreate
from django.urls import path, include
from employee_sessions.views import EmployeeSessionListCreateView, EmployeeSessionDetailView
from payments.views import PaymentListCreateView, PaymentDetailView
from accounts.views import UserCreateView, UserDetailView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', UserCreate.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/sessions/', EmployeeSessionListCreateView.as_view(), name='session-list-create'),
    path('api/sessions/<int:pk>/', EmployeeSessionDetailView.as_view(), name='session-detail'),
    path('api/payments/', PaymentListCreateView.as_view(), name='payment-list-create'),
    path('api/payments/<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('api/employees/', UserCreateView.as_view(), name='employee-create'),
    path('api/employees/<int:pk>/', UserDetailView.as_view(), name='employee-detail'),
]
