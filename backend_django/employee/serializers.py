from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(ModelSerializer):
    dep_name = serializers.CharField(source='department.name', read_only=True)
    is_admin = serializers.BooleanField(read_only=True)  # Only readable by clients

    class Meta:
        model = Employee
        fields = [
            'id',
            'name',
            'email',
            'department',
            'dep_name',
            'location',
            'is_admin',
            'created_at',
            'updated_at',
            'salary',
        ]
        read_only_fields = ['created_at', 'updated_at', 'dep_name']
