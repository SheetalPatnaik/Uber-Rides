from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from driver.models import Driver
import random

def getRandomId():
    random_number1 = random.randint(1000, 9999)
    random_number2 = random.randint(1000, 9999)
    chatId = 'C{}{}'.format(random_number1, random_number2)
    customer = Customer.objects.filter(chat_id=chatId).first()
    while customer is not None:
        random_number1 = random.randint(1000, 9999)
        random_number2 = random.randint(1000, 9999)
        chatId = 'C{}{}'.format(random_number1, random_number2)
        customer = Customer.objects.filter(chat_id=chatId).first()

    return chatId

# models.py
class Customer(AbstractBaseUser):
    customer_id = models.CharField(max_length=11, primary_key=True, unique=True)  # Changed to primary_key=True
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    credit_card = models.CharField(max_length=20)
    password = models.CharField(max_length=255, null=True)
    chat_id = models.CharField(max_length=255, null=True)


    # for jwt
    USERNAME_FIELD = 'customer_id'
    REQUIRED_FIELDS = ['username']

    def save(self, *args, **kwargs) -> None:
        if not self.chat_id:
            self.chat_id = getRandomId() 
        return super().save(*args, **kwargs)


class Booking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
        ('Completed', 'Completed'),
    ]

    booking_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(
        Customer,
        to_field='customer_id',
        db_column='customer_id',  # Added this
        on_delete=models.CASCADE
    )
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, null=True)
    pickup_location = models.CharField(max_length=255)
    pickup_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    pickup_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    dropoff_location = models.CharField(max_length=255)
    dropoff_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    dropoff_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    ride_type = models.CharField(max_length=10, choices=[('XL', 'XL (4 passengers)'), ('XXL', 'XXL (6 passengers)')], default='XL')
    num_passengers = models.IntegerField(choices=[(i, str(i)) for i in range(1, 7)], default=1)
    predicted_fare = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=True)
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')  # status field
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    class Meta:
        db_table = 'users_booking'

    def __str__(self):
        return f"Booking {self.booking_id} by {self.customer.customer_id}"
