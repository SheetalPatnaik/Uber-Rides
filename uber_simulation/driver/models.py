from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.cache import cache
import googlemaps
from utils.validators import DataValidators


class Driver(AbstractUser):
    # Cache keys
    DRIVER_CACHE_KEY = 'driver_{}'
    AVAILABLE_DRIVERS_CACHE_KEY = 'available_drivers'
    TOP_RATED_DRIVERS_CACHE_KEY = 'top_rated_drivers'

    # Existing group and permission fields
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='driver_set',
        blank=True,
        verbose_name='groups',
        help_text='The groups this user belongs to.',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='driver_set',
        blank=True,
        verbose_name='user permissions',
        help_text='Specific permissions for this user.',
    )

    # Your existing fields with enhanced validation
    VEHICLE_TYPES = (
        ('sedan', 'Sedan'),
        ('suv', 'SUV'),
        ('van', 'Van'),
        ('luxury', 'Luxury'),
    )

    STATUS_CHOICES = (
        ('available', 'Available'),
        ('busy', 'Busy'),
        ('offline', 'Offline'),
    )

    username = None
    driver_id = models.CharField(max_length=11, unique=True, 
                                 validators=[DataValidators.validate_ssn], 
                                 null=False, blank=False, default="059-34-0593")
    email = models.EmailField(unique=True)
    phone_number = models.CharField(
        max_length=16,
        unique=True
    )
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(
        max_length=2, 
        validators=[DataValidators.validate_state]
    )
    zipcode = models.CharField(
        max_length=10, 
        validators=[DataValidators.validate_zipcode]
    )
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPES)
    vehicle_model = models.CharField(max_length=50)
    vehicle_plate = models.CharField(max_length=15, unique=True)
    license_number = models.CharField(max_length=20, unique=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    total_trips = models.IntegerField(default=0)
    current_location_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    current_location_lng = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='offline')
    introduction_video = models.FileField(upload_to='driver_videos/', null=True, blank=True)
    profile_photo = models.ImageField(upload_to='driver_photos/', null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']

    def save(self, *args, **kwargs):
        # Clear cache on save
        cache.delete(self.DRIVER_CACHE_KEY.format(self.id))
        cache.delete(self.AVAILABLE_DRIVERS_CACHE_KEY)
        cache.delete(self.TOP_RATED_DRIVERS_CACHE_KEY)
        super().save(*args, **kwargs)

    
    def update_current_location(self):
        """
        Updates driver's current location using Google Maps Geolocation API
        """
        gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
        
        try:
            geolocation_result = gmaps.geolocate()
            if geolocation_result and 'location' in geolocation_result:
                self.current_location_lat = geolocation_result['location']['lat']
                self.current_location_lng = geolocation_result['location']['lng']
                self.save()
                return True
        except Exception as e:
            return False

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['email'], 
                name='unique_driver_email'
            ),
            models.UniqueConstraint(
                fields=['phone_number'], 
                name='unique_driver_phone'
            ),
        ]