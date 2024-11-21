from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DriverViewSet, driver_login, update_profile, add_review

# Create a router for viewset
router = DefaultRouter()
router.register(r'drivers', DriverViewSet, basename='driver')

# Define URL patterns
urlpatterns = [
    path('login/', driver_login, name='driver-login'),  # Put login first
    path('profile/update/', update_profile, name='update_profile'),
    path('drivers/<int:driver_id>/reviews/', add_review, name='add_review'),
    path('', include(router.urls)),
]