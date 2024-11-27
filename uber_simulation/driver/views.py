from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from django.db import transaction
from .models import Driver
from .serializers import DriverSerializer, ReviewSerializer
import googlemaps
from django.conf import settings
from django_filters import rest_framework as filters

@api_view(['POST'])
@permission_classes([AllowAny])
def driver_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(email=email, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        user.update_current_location()
        
        # Cache user data
        cache_key = f'driver_auth_{user.id}'
        user_data = {
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user_id': user.id,
            'email': user.email,
            'name': f"{user.first_name} {user.last_name}",
            'current_location_lat': user.current_location_lat,
            'current_location_lng': user.current_location_lng
        }
        cache.set(cache_key, user_data, timeout=3600)
        
        return Response(user_data)
    return Response(
        {'error': 'Invalid credentials'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )

class DriverFilter(filters.FilterSet):
    class Meta:
        model = Driver
        fields = {
            'first_name': ['icontains'],
            'last_name': ['icontains'],
            'email': ['icontains'],
            'city': ['exact'],
            'state': ['exact'],
            'vehicle_type': ['exact'],
            'rating': ['gte', 'lte'],
        }

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [AllowAny]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = DriverFilter

    def get_object(self):
        pk = self.kwargs.get('pk')
        cache_key = Driver.DRIVER_CACHE_KEY.format(pk)
        
        # Try to get from cache
        driver = cache.get(cache_key)
        if not driver:
            driver = super().get_object()
            cache.set(cache_key, driver, timeout=3600)
        
        return driver

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        # Check for duplicate driver
        email = request.data.get('email')
        phone = request.data.get('phone_number')
        
        if Driver.objects.filter(email=email).exists():
            return Response(
                {'error': 'Driver with this email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if Driver.objects.filter(phone_number=phone).exists():
            return Response(
                {'error': 'Driver with this phone number already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, 
            status=status.HTTP_201_CREATED, 
            headers=headers
        )
    
    @action(detail=True, methods=['post'])
    def update_location(self, request, pk=None):
        driver = self.get_object()
        
        if driver.update_current_location():
            # Clear cache for this driver
            cache_key = Driver.DRIVER_CACHE_KEY.format(driver.id)
            cache.delete(cache_key)
            return Response({'status': 'location updated'})
            
        return Response(
            {'error': 'Failed to update location'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['get'])
    def available_drivers(self, request):
        cache_key = Driver.AVAILABLE_DRIVERS_CACHE_KEY
        result = cache.get(cache_key)
        
        if not result:
            available = Driver.objects.filter(
                status='available',
                is_active=True
            )
            serializer = self.get_serializer(available, many=True)
            result = serializer.data
            cache.set(cache_key, result, timeout=300)  # Cache for 5 minutes
            
        return Response(result)

    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        cache_key = Driver.TOP_RATED_DRIVERS_CACHE_KEY
        result = cache.get(cache_key)
        
        if not result:
            top_drivers = Driver.objects.filter(
                is_active=True
            ).order_by('-rating')[:10]
            serializer = self.get_serializer(top_drivers, many=True)
            result = serializer.data
            cache.set(cache_key, result, timeout=3600)  # Cache for 1 hour
            
        return Response(result)
    
    

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()
@api_view(['PUT'])
def update_profile(request):
    driver = request.user
    serializer = DriverSerializer(driver, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_review(request, driver_id):
    driver = get_object_or_404(Driver, id=driver_id)
    serializer = ReviewSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save(driver=driver, passenger=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
