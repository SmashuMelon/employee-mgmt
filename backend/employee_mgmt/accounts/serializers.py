from .models import Profile
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import exceptions
from rest_framework import permissions
import uuid  # Using UUID for generating unique employee numbers


# ProfileSerializer for handling profile data
class ProfileSerializer(serializers.ModelSerializer):
    salary = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    phone_number = serializers.CharField(max_length=15, required=True)
    email_address = serializers.EmailField(required=True)

    class Meta:
        model = Profile
        fields = ['phone_number', 'employee_number', 'email_address', 'salary']


# UserSerializer for creating and updating users, along with their profiles
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')

        # Automatically generate a unique employee number (UUID)
        employee_number = str(uuid.uuid4())  # or use any logic you prefer
        profile_data['employee_number'] = employee_number

        # Create the user
        user = User.objects.create(username=validated_data['username'], email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()

        # Set email_address from the user's email
        profile_data['email_address'] = user.email  
        Profile.objects.create(user=user, **profile_data)

        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        profile = instance.profile

        # Update the user fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Update profile if needed
        if profile_data:
            profile_serializer = ProfileSerializer(profile, data=profile_data, partial=True)
            profile_serializer.is_valid(raise_exception=True)
            profile_serializer.save()

        return instance


# CustomTokenObtainPairSerializer to include role in JWT token
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        # Add the user's role from their profile to the JWT token
        try:
            profile = Profile.objects.get(user=user)
            data['role'] = profile.role  # Assuming 'role' exists in the Profile model
        except Profile.DoesNotExist:
            raise exceptions.AuthenticationFailed('Profile not found.')

        return data


# Custom permission to check for admin role
class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            role = request.user.profile.role  # Assuming the role field is in the profile model
        except Profile.DoesNotExist:
            return False
        return role == 'admin'


# Custom permission to allow both admin and manager access
class IsAdminOrManager(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            role = request.user.profile.role  # Assuming the role field is in the profile model
        except Profile.DoesNotExist:
            return False
        return role in ['admin', 'manager']
