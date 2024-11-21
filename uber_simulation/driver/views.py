from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
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
        # Update driver's location
        user.update_current_location()
        
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user_id': user.id,
            'email': user.email,
            'name': f"{user.first_name} {user.last_name}",
            'current_location_lat': user.current_location_lat,
            'current_location_lng': user.current_location_lng
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'])
    def update_location(self, request, pk=None):
        driver = self.get_object()
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        
        if latitude and longitude:
            driver.current_location_lat = latitude
            driver.current_location_lng = longitude
            driver.save()
            return Response({'status': 'location updated'})
        return Response({'error': 'latitude and longitude required'}, 
                      status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        driver = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(Driver.STATUS_CHOICES):
            driver.status = new_status
            driver.save()
            return Response({'status': 'driver status updated'})
        return Response({'error': 'invalid status'}, 
                      status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def available_drivers(self, request):
        available = Driver.objects.filter(
            status='available',
            is_active=True
        )
        serializer = self.get_serializer(available, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        top_drivers = Driver.objects.filter(
            is_active=True
        ).order_by('-rating')[:10]
        serializer = self.get_serializer(top_drivers, many=True)
        return Response(serializer.data)

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
