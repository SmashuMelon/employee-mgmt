from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile
import uuid  # Import UUID to generate unique employee numbers

@receiver(post_save, sender=User)
def create_or_update_profile(sender, instance, created, **kwargs):
    if created:
        # Automatically generate a unique employee number
        employee_number = str(uuid.uuid4())  # You can replace this with your custom logic

        # Create a new profile with default values
        Profile.objects.create(
            user=instance,
            email_address=instance.email,
            employee_number=employee_number,  # Assign the generated employee number
            role='employee'  # Default role for new users
        )
    else:
        # Update the profile with the current user's email address if it exists
        profile, _ = Profile.objects.get_or_create(user=instance)
        profile.email_address = instance.email
        profile.save()
