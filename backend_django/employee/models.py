from django.db import models
from department.models import Department

class Employee(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=254)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    location = models.CharField(max_length=100)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.name} ({self.email})'

    class Meta:
        ordering = ['-created_at']
