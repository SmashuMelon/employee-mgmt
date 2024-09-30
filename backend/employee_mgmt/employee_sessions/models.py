from django.db import models
from django.contrib.auth.models import User

class EmployeeSession(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.employee.username} - {self.start_time} to {self.end_time if self.end_time else 'Ongoing'}"

    @property
    def session_duration(self):
        if self.end_time:
            return self.end_time - self.start_time
        return None
