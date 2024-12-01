# rides/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RideViewSet

router = DefaultRouter()
router.register(r'rides', RideViewSet)

urlpatterns = [
    path('', include(router.urls)),
]