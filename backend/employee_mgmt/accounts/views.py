from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.contrib.auth.models import User
from .models import Profile
from .serializers import UserSerializer
from .permissions import IsAdmin, IsAdminOrManager  # Import custom permissions

# View for creating new users (only accessible by admins)
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]  # Only allow admins to create users

# View for retrieving, updating, and deleting user details
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  # Allow authenticated users to access

# View for listing all users (accessible by admins and managers)
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrManager]  # Allow admin or manager to list users
