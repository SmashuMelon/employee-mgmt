from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/departments/', include('department.urls')),  # Added trailing slash
    path('api/employees/', include('employee.urls')),  # Added trailing slash
    path('api/tasks/', include('task.urls')),  # Ensure this is correct if it follows RESTful practices
    path('admin/', admin.site.urls),
]
