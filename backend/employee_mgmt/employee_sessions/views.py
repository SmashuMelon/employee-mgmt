from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import EmployeeSession
from .serializers import EmployeeSessionSerializer
from rest_framework.permissions import IsAuthenticated

class EmployeeSessionListCreateView(generics.ListCreateAPIView):
    queryset = EmployeeSession.objects.all()
    serializer_class = EmployeeSessionSerializer
    permission_classes = [IsAuthenticated]

class EmployeeSessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EmployeeSession.objects.all()
    serializer_class = EmployeeSessionSerializer
    permission_classes = [IsAuthenticated]
