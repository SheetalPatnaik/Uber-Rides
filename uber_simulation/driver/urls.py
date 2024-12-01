from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DriverViewSet, driver_login, update_profile, add_review, accept_ride, get_ride_requests, get_rides

# Create a router for viewset
router = DefaultRouter()
router.register(r'drivers', DriverViewSet, basename='driver')

# Define URL patterns
urlpatterns = [
    path('register/', DriverViewSet.as_view({'post': 'create'}), name='driver-register'),
    path('login/', driver_login, name='driver-login'),  # Put login first
    path('profile/update/', update_profile, name='update_profile'),
    path('<int:driver_id>/reviews/', add_review, name='add_review'),
    path('accept-ride/<int:ride_id>', accept_ride, name='accept-ride'),
    path('ride-requests/', get_ride_requests, name='ride-requests'),
    path('rides/', get_rides, name='rides'),
    path('', include(router.urls)),
]