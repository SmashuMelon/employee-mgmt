from rest_framework.serializers import ModelSerializer, CharField
from rest_framework import serializers
from .models import Employee
from django.contrib.auth.hashers import make_password

class EmployeeSerializer(ModelSerializer):
    dep_name = CharField(source='department.name', read_only=True)
    is_admin = CharField(read_only=True)  # Only readable by clients
    password = CharField(write_only=True)  # Make password write-only

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
            'password',  # Include password in the fields
        ]
        read_only_fields = ['created_at', 'updated_at', 'dep_name']

    def create(self, validated_data):
        # Hash the password before saving
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
