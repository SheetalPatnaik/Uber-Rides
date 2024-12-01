from django.contrib import admin

# Register your models here.
from .models import Customer, Booking

admin.site.register(Customer)
admin.site.register(Booking)