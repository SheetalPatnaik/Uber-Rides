from django.db import models
from utils.validators import DataValidators
from driver.models import Driver
from users.models import Customer, Booking
import random
# Create your models here.

def getRandomBillId():
    random_number1 = random.randint(100, 999)
    random_number2 = random.randint(10, 99)
    random_number3 = random.randint(1000, 9999)
    id = '{}-{}-{}'.format(random_number1, random_number2, random_number3)
    bill = BillingInformation.objects.filter(billing_id=id).first()
    while bill != None:
        random_number1 = random.randint(100, 999)
        random_number2 = random.randint(10, 99)
        random_number3 = random.randint(1000, 9999)
        id = '{}-{}-{}'.format(random_number1, random_number2, random_number3)
        bill = BillingInformation.objects.filter(billing_id=id).first()
    
    return id

class BillingInformation(models.Model):
    
    billing_id = models.CharField(
        max_length=11, 
        validators=[DataValidators.validate_ssn], 
        unique=True,
        primary_key=True
    )
    ride= models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True)
    date = models.DateField()
    pickup_time = models.DateTimeField()
    drop_off_time = models.DateTimeField()
    distance_covered = models.DecimalField(max_digits=10, decimal_places=2) # in miles
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    source_location = models.CharField(max_length=255)
    destination_location = models.CharField(max_length=255)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-date']