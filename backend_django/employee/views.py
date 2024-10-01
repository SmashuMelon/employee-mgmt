from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Employee
from .serializers import EmployeeSerializer
from employee.permissions import IsAdminUser, IsAdminOrOwner

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow any user to access this view
def register_view(request):
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        # If valid, save the new employee
        employee = serializer.save()
        return Response({
            'id': employee.id,
            'message': 'Employee registered successfully.'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow any user to access this view
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# View for admins to view or create employees
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def employees(request):
    if request.method == 'GET':
        # Admins can view all employees, non-admins can only view their own details
        if request.user.is_admin:
            employees = Employee.objects.all()
        else:
            employees = Employee.objects.filter(id=request.user.id)

        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'id': serializer.data['id'], 'message': 'Employee created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View for admins or employees to view, update, or delete a specific employee
@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminOrOwner])
def employee(request, pk):
    employee_obj = get_object_or_404(Employee, id=pk)

    if request.method == 'GET':
        serializer = EmployeeSerializer(employee_obj)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = EmployeeSerializer(employee_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        serializer = EmployeeSerializer(employee_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Employee updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        employee_obj.delete()
        return Response({'message': 'Employee deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


# View for authenticated users to retrieve their own employee details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_details(request):
    serializer = EmployeeSerializer(request.user)
    return Response(serializer.data)
