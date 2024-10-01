from django.db import models
from django.contrib.auth.models import User
import uuid  # Import UUID for unique employee numbers

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email_address = models.EmailField()  # No longer unique
    employee_number = models.CharField(max_length=36, default=uuid.uuid4, editable=False, unique=True)  # Automatically generate UUID
    phone_number = models.CharField(max_length=15)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    role = models.CharField(max_length=20, default='employee')  # Default role for new users

    def __str__(self):
        return f"{self.user.username}'s Profile"
