from rest_framework import permissions
from .models import Profile

# Custom permission to check for admin role
class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            role = request.user.profile.role
        except Profile.DoesNotExist:
            return False
        return role == 'admin'

# Custom permission to allow both admin and manager access
class IsAdminOrManager(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            role = request.user.profile.role
        except Profile.DoesNotExist:
            return False
        return role in ['admin', 'manager']
