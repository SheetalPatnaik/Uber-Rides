from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('register-customer/', views.register_customer, name='register_customer'),
    path('login/', views.login_customer, name='login_customer'),
    path('book-ride/', BookRideView.as_view(), name='book-ride'),
    path('filter-driver/', FilterDriversView.as_view(), name='filter-driver'),
    path('ongoing-ride/', get_ongoing_ride, name='ongoing-ride'),
    path('rides/', get_rides, name='rides'),
]