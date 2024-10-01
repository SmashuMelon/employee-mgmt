from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer
from employee.permissions import IsAdminUser  # Make sure this permission exists

# View for admin to create and list tasks
@api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated, IsAdminUser])
def tasks(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View for admins or tasks to view, update, or delete a specific task
@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
# @permission_classes([IsAuthenticated, IsAdminOrOwner])
def task(request, pk):
    task_obj = get_object_or_404(Task, id=pk)

    if request.method == 'GET':
        serializer = TaskSerializer(task_obj)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = TaskSerializer(task_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        serializer = TaskSerializer(task_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Task updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        task_obj.delete()
        return Response({'message': 'Task deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

# View for marking a task as complete
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdminUser])
def complete_task(request, pk):
    task = get_object_or_404(Task, pk=pk)
    task.is_completed = True
    task.save()
    return Response({'message': 'Task marked as complete'}, status=status.HTTP_200_OK)

