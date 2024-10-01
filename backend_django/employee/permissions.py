from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)

class IsAdminOrOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return bool(request.user and (request.user.is_admin or obj == request.user))
