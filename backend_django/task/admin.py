from django.contrib import admin
from .models import Task

class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'assigned_to', 'is_completed', 'created_at', 'updated_at')
    list_filter = ('is_completed', 'assigned_to')
    search_fields = ('title', 'description')
    ordering = ('-created_at',)

admin.site.register(Task, TaskAdmin)
