from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
import re
import random
from django.contrib.auth.base_user import BaseUserManager
import uuid


class AdministratorManager(BaseUserManager):
   def create_user(self, email, password=None, **extra_fields):
       if not email:
           raise ValueError('The Email field must be set')
       email = self.normalize_email(email)
       user = self.model(email=email, **extra_fields)
       user.set_password(password)
       user.save(using=self._db)
       return user


   def create_superuser(self, email, password=None, **extra_fields):
       extra_fields.setdefault('is_staff', True)
       extra_fields.setdefault('is_superuser', True)
       return self.create_user(email, password, **extra_fields)


class Administrator(AbstractUser):
   id = models.BigAutoField(primary_key=True)
   username = None
   email = models.EmailField(unique=True)
   def generate_default_admin_id():
       # Generate a random 9-digit number and format it
       random_digits = str(uuid.uuid4().int)[:9].zfill(9)
       return f"{random_digits[:3]}-{random_digits[3:5]}-{random_digits[5:]}"


   admin_id = models.CharField(
       max_length=11,
       unique=True,
       default=generate_default_admin_id,
       null=True,
   )
  
   phone_number = models.CharField(max_length=16, unique=True, null=True, blank=True)
   address = models.CharField(max_length=255, null=True, blank=True)
   city = models.CharField(max_length=100, null=True, blank=True)
   state = models.CharField(max_length=2, null=True, blank=True)
   zipcode = models.CharField(max_length=10, null=True, blank=True)
  
   # New field for profile image
   profile_image = models.ImageField(
       upload_to='admin_profiles/',
       null=True,
       blank=True
   )


   USERNAME_FIELD = 'email'
   REQUIRED_FIELDS = ['first_name', 'last_name']


   objects = AdministratorManager()


   def clean(self):
       # Validate admin_id format: XXX-XX-XXXX
       if self.admin_id and not re.match(r"^\d{3}-\d{2}-\d{4}$", self.admin_id):
           raise ValidationError("Admin ID must be in the format XXX-XX-XXXX.")


       # Ensure that the email ends with @uber.com
       if self.email and not self.email.endswith('@uber.com'):
           raise ValidationError("Administrator email must end with '@uber.com'.")


   def save(self, *args, **kwargs):
       # Format admin_id before saving
       if self.admin_id:
           # Remove any non-digits
           digits = ''.join(filter(str.isdigit, self.admin_id))
           # Format as XXX-XX-XXXX
           self.admin_id = f"{digits[:3]}-{digits[3:5]}-{digits[5:]}"
       super().save(*args, **kwargs)


   def generate_unique_admin_id(self):
       while True:
           admin_id = f"{random.randint(100, 999)}-{random.randint(10, 99)}-{random.randint(1000, 9999)}"
           if not Administrator.objects.filter(admin_id=admin_id).exists():
               return admin_id