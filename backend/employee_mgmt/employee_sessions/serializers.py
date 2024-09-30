from rest_framework import serializers
from .models import EmployeeSession

class EmployeeSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeSession
        fields = ['id', 'employee', 'start_time', 'end_time', 'is_active', 'session_duration']
        read_only_fields = ['session_duration']
