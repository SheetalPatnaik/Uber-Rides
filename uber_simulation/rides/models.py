from django.db import models
from driver.models import Driver
from users.models import Customer
from datetime import datetime
# Create your models here.
# rides/models.py

class Ride(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    )

    ride_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    pickup_location_lat = models.DecimalField(max_digits=9, decimal_places=6)
    pickup_location_lng = models.DecimalField(max_digits=9, decimal_places=6)
    dropoff_location_lat = models.DecimalField(max_digits=9, decimal_places=6)
    dropoff_location_lng = models.DecimalField(max_digits=9, decimal_places=6)
    pickup_time = models.DateTimeField()
    dropoff_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    passenger_count = models.IntegerField(default=1)
    predicted_fare = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'rides'
        ordering = ['-created_at']