from rest_framework.serializers import ModelSerializer, CharField
from .models import Employee

class EmployeeSerializer(ModelSerializer):
    is_admin = CharField(read_only=True) 
    class Meta:
        model = Employee
        fields = [
            'id',
            'name',
            'email',
            'department',
            'location',
            'is_admin',
            'created_at',
            'updated_at',
            'salary',
        ]
        read_only_fields = ['created_at', 'updated_at', 'dep_name']
