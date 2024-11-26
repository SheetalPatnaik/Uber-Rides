from django.db import models
from django.core.validators import RegexValidator
# Create your models here.

class BillingInformation(models.Model):
    ssn_regex = RegexValidator(
        regex=r'^\d{3}-\d{2}-\d{4}$',
        message="Billing ID must be in SSN format: XXX-XX-XXXX"
    )
    
    billing_id = models.CharField(
        max_length=11, 
        validators=[ssn_regex], 
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
    driver = models.ForeignKey('Driver', on_delete=models.CASCADE)
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-date']