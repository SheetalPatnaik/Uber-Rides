from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('register-customer/', views.register_customer, name='register_customer'),
    path('login/', views.login_customer, name='login_customer'),
    path('profile', views.get_customer_profile, name='get_customer_profile'),
    path('profile/update', views.update_customer_profile, name='update_customer_profile'),
    path('create-ride/', BookRideView.as_view(), name='create-ride'),
    path('filter-driver/', FilterDriversView.as_view(), name='filter-driver'),
    path('ongoing-ride/', get_ongoing_ride, name='ongoing-ride'),
    path('rides/', get_rides, name='rides'),
    path('ride/<int:ride_id>/detail/', get_ride_detail, name='get_ride_detail'),
    path('add-review/<int:ride_id>/', add_review, name='add_review'),
    path('users/', list_customers, name='list_customers'),
    path('delete-user/<str:customer_id>/', delete_customer, name='delete_customer'),

]