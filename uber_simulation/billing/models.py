from django.db import models
from utils.validators import DataValidators
from driver.models import Driver
from users.models import Customer
# Create your models here.

class BillingInformation(models.Model):
    
    billing_id = models.CharField(
        max_length=11, 
        validators=[DataValidators.validate_ssn], 
        unique=True,
        primary_key=True
    )
    date = models.DateField()
    pickup_time = models.DateTimeField()
    drop_off_time = models.DateTimeField()
    distance_covered = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    source_location = models.CharField(max_length=255)
    destination_location = models.CharField(max_length=255)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-date']