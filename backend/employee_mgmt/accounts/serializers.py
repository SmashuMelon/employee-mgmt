from .models import Profile
from rest_framework import serializers
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):
    salary = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)  # Set salary as required

    class Meta:
        model = Profile
        fields = ['phone_number', 'employee_number', 'email_address', 'salary']
        

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        
        # Ensure 'salary' is in profile_data
        if 'salary' not in profile_data:
            raise serializers.ValidationError({"salary": "This field is required."})
        
        user = User.objects.create_user(**validated_data)
        profile_data['email_address'] = user.email  # Set the email_address field from user email
        Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Update profile fields
        profile.phone_number = profile_data.get('phone_number', profile.phone_number)
        profile.employee_number = profile_data.get('employee_number', profile.employee_number)
        profile.salary = profile_data.get('salary', profile.salary)
        profile.email_address = instance.email  # Ensure the email_address is updated with the user email
        profile.save()

        return instance
