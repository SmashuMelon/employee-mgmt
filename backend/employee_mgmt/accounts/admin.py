from django.contrib import admin
from django.contrib.auth.models import User
from .models import Profile

class ProfileInline(admin.StackedInline):
    model = Profile
    fields = ('phone_number', 'employee_number', 'email_address', 'salary')  # Specify fields to display
    can_delete = False
    verbose_name_plural = 'Profile'
    readonly_fields = ('email_address', 'employee_number')  # Make email_address and employee_number read-only

class UserAdmin(admin.ModelAdmin):
    inlines = (ProfileInline,)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_active')  # Specify fields for user list

# Unregister the default User admin and register the new one
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
