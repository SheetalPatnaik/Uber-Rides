from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from django.core.validators import RegexValidator
from django.conf import settings
import googlemaps

class Driver(AbstractUser):
    # Add related_names to resolve the conflicts
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

    # Rest of your existing model code remains the same
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

    def update_current_location(self):
        """
        Updates driver's current location using Google Maps Geolocation API
        """
        gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
        
        try:
            geolocation_result = gmaps.geolocate()
            if geolocation_result:
                self.current_location_lat = geolocation_result['location']['lat']
                self.current_location_lng = geolocation_result['location']['lng']
                self.save()
                return True
        except Exception as e:
            return False

    username = None
    email = models.EmailField(unique=True)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}')    
    phone_number = models.CharField(validators=[phone_regex], max_length=17, unique=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=10)
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
    #reviews = models.ManyToManyField('Review', related_name='driver_reviews', blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']

class Review(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='reviews')
    passenger = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.driver.get_full_name()} by {self.passenger.get_full_name()}"
