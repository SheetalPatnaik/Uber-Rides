from django.urls import path
from . import views


urlpatterns = [
   path('revenue/', views.revenue_per_day, name='revenue_per_day'),
   path('area-rides/', views.rides_per_area, name='rides_per_area'),
   path('driver-rides/', views.rides_per_driver, name='rides_per_driver'),
   path('customer-rides/', views.rides_per_customer, name='rides_per_customer'),
]