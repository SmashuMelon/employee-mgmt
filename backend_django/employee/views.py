from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Employee
from .serializers import EmployeeSerializer
from .permissions import IsAdminUser

# View for admins to view or create employees
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def employees(request):
    if request.method == 'GET':
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for admins or employees to view, update, or delete a specific employee
@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def employee(request, pk):
    employee_obj = get_object_or_404(Employee, id=pk)

    if request.method == 'GET':
        # Employees can only view their own details
        if not request.user.is_admin and request.user.id != employee_obj.id:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = EmployeeSerializer(employee_obj)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if not request.user.is_admin:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = EmployeeSerializer(employee_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if not request.user.is_admin:
            return Response(status=status.HTTP_403_FORBIDDEN)
        employee_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# View for authenticated users to retrieve their own employee details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_details(request):
    serializer = EmployeeSerializer(request.user)
    return Response(serializer.data)
