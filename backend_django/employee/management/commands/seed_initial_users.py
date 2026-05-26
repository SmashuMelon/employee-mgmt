from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from department.models import Department
from employee.models import Employee


class Command(BaseCommand):
    help = 'Seed initial admin and employee accounts with safe defaults.'

    def handle(self, *args, **options):
        User = get_user_model()

        self.stdout.write('Seeding departments...')
        management_department, _ = Department.objects.get_or_create(name='Management')
        operations_department, _ = Department.objects.get_or_create(name='Operations')

        self.stdout.write('Seeding users...')

        admin_user, admin_created = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@example.com', 'is_staff': True, 'is_superuser': True},
        )
        if admin_created:
            admin_user.set_password('admin')
            admin_user.save()
            self.stdout.write('Created Django admin user: admin')
        else:
            self.stdout.write('Django admin user already exists: admin')

        employee_user, employee_created = User.objects.get_or_create(
            username='employee',
            defaults={'email': 'employee@example.com', 'is_staff': False, 'is_superuser': False},
        )
        if employee_created:
            employee_user.set_password('employee')
            employee_user.save()
            self.stdout.write('Created Django employee user: employee')
        else:
            self.stdout.write('Django employee user already exists: employee')

        self.stdout.write('Seeding employee profiles...')

        admin_profile, admin_profile_created = Employee.objects.get_or_create(
            email=admin_user.email,
            defaults={
                'name': 'Admin User',
                'department': management_department,
                'location': 'Head Office',
                'salary': 0,
                'is_admin': True,
            },
        )
        if admin_profile_created:
            self.stdout.write('Created Employee profile for admin user')
        else:
            self.stdout.write('Employee profile for admin user already exists')

        employee_profile, employee_profile_created = Employee.objects.get_or_create(
            email=employee_user.email,
            defaults={
                'name': 'Employee User',
                'department': operations_department,
                'location': 'Remote',
                'salary': 30000,
                'is_admin': False,
            },
        )
        if employee_profile_created:
            self.stdout.write('Created Employee profile for employee user')
        else:
            self.stdout.write('Employee profile for employee user already exists')

        self.stdout.write(self.style.SUCCESS('Initial admin and employee accounts seeded.'))
