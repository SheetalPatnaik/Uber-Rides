from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from utils.validators import DataValidators  # Assuming you have validators in utils/validators.py
from django.core.cache import cache
from django.contrib.auth.base_user import BaseUserManager

class AdministratorManager(BaseUserManager):
    def create_user(self, admin_id, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Administrators must have an email address')
        if not admin_id:
            raise ValueError('Administrators must have an Admin ID')
        email = self.normalize_email(email)
        DataValidators.validate_ssn(admin_id)
        user = self.model(admin_id=admin_id, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, admin_id, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        return self.create_user(admin_id, email, password, **extra_fields)

class Administrator(AbstractBaseUser, PermissionsMixin):
    ADMIN_CACHE_KEY = 'admin_{}'

    admin_id = models.CharField(
        max_length=11,
        unique=True,
        primary_key=True,
        validators=[DataValidators.validate_ssn],
        verbose_name='Admin ID'
    )
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(
        max_length=2,
        validators=[DataValidators.validate_state]
    )
    zip_code = models.CharField(
        max_length=10,
        validators=[DataValidators.validate_zipcode]
    )
    phone_number = models.CharField(
        max_length=16,
        unique=True
    )
    email = models.EmailField(unique=True)

    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    objects = AdministratorManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['admin_id', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.admin_id})"

    def save(self, *args, **kwargs):
        # Clear cache on save
        cache.delete(self.ADMIN_CACHE_KEY.format(self.admin_id))
        super().save(*args, **kwargs)
