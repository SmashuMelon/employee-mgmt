from django.db import models
from employee_sessions.models import EmployeeSession
from accounts.models import Profile

class Payment(models.Model):
    session = models.ForeignKey(EmployeeSession, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    payment_date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Calculate payment based on session duration and employee's salary
        if not self.amount:
            hours_worked = (self.session.end_time - self.session.start_time).total_seconds() / 3600
            salary_per_hour = self.session.employee.profile.salary / 160  # Assuming 160 working hours in a month
            self.amount = hours_worked * salary_per_hour
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment for session {self.session.id} - {self.amount}"