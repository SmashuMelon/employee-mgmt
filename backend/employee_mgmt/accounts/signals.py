from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile

@receiver(post_save, sender=User)
def create_or_update_profile(sender, instance, created, **kwargs):
    if created:
        # Use get_or_create to avoid duplicates when creating a new profile
        Profile.objects.get_or_create(user=instance, defaults={'email_address': instance.email})
    else:
        # Update the profile with the current user's email address if it exists
        profile, _ = Profile.objects.get_or_create(user=instance)
        profile.email_address = instance.email
        profile.save()
