from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from driver.models import Driver
import random
from django.core.cache import cache

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
    profile_photo = models.ImageField(upload_to='customer_photos/', null=True, blank=True)
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
        ('pending', 'pending'),
        ('accepted', 'accepted'),
        ('rejected', 'rejected'),
        ('picked', 'picked'),
        ('completed', 'completed'),
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
    picked_date = models.DateTimeField(null=True)
    drop_date = models.DateTimeField(null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')  # status field
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    is_reviewed = models.BooleanField(default=False, null=True)
    class Meta:
        db_table = 'users_booking'

    def __str__(self):
        return f"Booking {self.booking_id} by {self.customer.customer_id}"

class Review(models.Model):
    REVIEW_CACHE_KEY = 'review_{}'
    
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='reviews')
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='reviews', null=True)
    passenger = models.ForeignKey(Customer, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(0, 5)])
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Clear cache on save
        cache.delete(self.REVIEW_CACHE_KEY.format(self.id))
        cache.delete(Driver.DRIVER_CACHE_KEY.format(self.driver_id))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Review for {self.driver.get_full_name()} by {self.passenger.get_full_name()}"