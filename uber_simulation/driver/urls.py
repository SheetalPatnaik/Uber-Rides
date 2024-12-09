from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Create a router for viewset
router = DefaultRouter()
router.register(r'drivers', DriverViewSet, basename='driver')

# Define URL patterns
urlpatterns = [
    path('profile', get_driver_profile, name='driver-profile'),
    path('register/', DriverViewSet.as_view({'post': 'create'}), name='driver-register'),
    path('login/', driver_login, name='driver-login'),  # Put login first
    path('profile/update', update_profile, name='update_profile'),
    path('<int:driver_id>/reviews/', add_review, name='add_review'),
    path('accept-ride/<int:ride_id>', accept_ride, name='accept-ride'),
    path('pick-rider/<int:ride_id>', pick_rider, name='pick-rider'),
    path('complete-ride/<int:ride_id>', complete_ride, name='complete-ride'),
    path('ride-requests/', get_ride_requests, name='ride-requests'),
    path('ongoing-ride/', get_ongoing_ride, name='ongoing-ride'),
    path('rides/', get_rides, name='rides'),
    path('delete-driver/<str:driver_id>/', delete_driver, name='delete_driver'),
    path('', include(router.urls)),
]