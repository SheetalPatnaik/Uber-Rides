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
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from users.models import Booking
from rides.kafka_producer import send_kafka_message
from rides.constants import RIDE_ACCEPTED, RIDE_COMPLETED, PICKED_RIDER
from rest_framework.exceptions import NotFound
from utils.util import getRideRequest
from datetime import datetime
from billing.models import getRandomBillId, BillingInformation
from haversine import haversine, Unit
from django.views.decorators.csrf import csrf_exempt


@api_view(['POST'])
@permission_classes([AllowAny])
def driver_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(email=email, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        # user.update_current_location()
        
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_ride(request, ride_id):
        print("Authenticated driver:", request.user.id)
        print("Received ride acceptance request")
        print("Complete request data:", request.data)

        # Step 1: Get authenticated driver's ID
        driver_id = request.user.id  # Fetch driver_id from the authenticated user
        print("driver", driver_id)

        # Verify driver exists
        driver = get_object_or_404(Driver, id=driver_id)

        # Step 2: check if driver is already in ride
        drive_ride = Booking.objects.filter(
            status='accepted',driver=driver).first()
        if drive_ride:
            return Response(
                {'error': 'Driver is already in another ride.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Step 3: Validate the ride acceptance data
        if not ride_id:
            return Response(
                {'error': 'ride_id is required to accept a ride'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 4: Check if the ride exists and is pending
        try:
            ride = Booking.objects.get(booking_id=ride_id, status='pending')
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Ride not found or is not in a pending state'},
                status=status.HTTP_404_NOT_FOUND
            )
        # Step 5: Assign the ride to the driver
        try:
            ride.driver = driver
            ride.status = 'accepted'
            ride.save()
            ride_data = {
                'ride_id': ride_id,
                "driver_id":driver_id,
                "driver_name":"{} {}".format(driver.first_name, driver.last_name),
                'predicted_fare': float(ride.predicted_fare),
                'pickup_coordinates': {
                    'lat': float(ride.pickup_latitude),
                    'lng': float(ride.pickup_longitude)
                },
                'dropoff_coordinates': {
                    'lat': float(ride.dropoff_latitude),
                    'lng': float(ride.dropoff_longitude)
                }
            }
            send_kafka_message({
                "type":RIDE_ACCEPTED,
                "data":ride_data
            })
            return Response({
                'message': 'Ride accepted successfully',
                'ride_id': ride.booking_id,
                'status': ride.status,
                'customer_id': ride.customer.customer_id,
                'pickup_coordinates': {
                    'lat': ride.pickup_latitude,
                    'lng': ride.pickup_longitude
                },
                'dropoff_coordinates': {
                    'lat': ride.dropoff_latitude,
                    'lng': ride.dropoff_longitude
                },
                'predicted_fare': str(ride.predicted_fare)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error while accepting the ride: {e}")
            return Response(
                {'error': 'An error occurred while accepting the ride'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def pick_rider(request, ride_id):
        print("Authenticated driver:", request.user.id)
        print("Received ride acceptance request")
        print("Complete request data:", request.data)
        now = datetime.now()
        # Step 1: Get authenticated driver's ID
        driver_id = request.user.id  # Fetch driver_id from the authenticated user
        print("driver", driver_id)

        # Verify driver exists
        driver = get_object_or_404(Driver, id=driver_id)

        # Step 2: Check if the ride exists and is accepted by driver
        try:
            ride = Booking.objects.get(booking_id=ride_id, status='accepted',driver=driver)
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Ride not found or is not accepted by this driver'},
                status=status.HTTP_404_NOT_FOUND
            )
        # Step 3: pick rider
        try:
            ride.status = 'picked'
            ride.picked_date = now
            ride.save()
            ride_data = {
                'ride_id': ride_id,
                "driver_id":driver_id,
                "driver_name":"{} {}".format(driver.first_name, driver.last_name),
                'predicted_fare': float(ride.predicted_fare),
                'pickup_coordinates': {
                    'lat': float(ride.pickup_latitude),
                    'lng': float(ride.pickup_longitude)
                },
                'dropoff_coordinates': {
                    'lat': float(ride.dropoff_latitude),
                    'lng': float(ride.dropoff_longitude)
                }
            }
            send_kafka_message({
                "type":PICKED_RIDER,
                "data":ride_data
            })
            return Response({
                'message': 'Rider picked successfully',
                'ride_id': ride.booking_id,
                'status': ride.status,
                'customer_id': ride.customer.customer_id,
                'pickup_coordinates': {
                    'lat': ride.pickup_latitude,
                    'lng': ride.pickup_longitude
                },
                'dropoff_coordinates': {
                    'lat': ride.dropoff_latitude,
                    'lng': ride.dropoff_longitude
                },
                'predicted_fare': str(ride.predicted_fare)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error while accepting the ride: {e}")
            return Response(
                {'error': 'An error occurred while accepting the ride'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_ride(request, ride_id):
        now = datetime.now()
        print("Authenticated driver:", request.user.id)
        print("Received ride acceptance request")
        print("Complete request data:", request.data)

        # Step 1: Get authenticated driver's ID
        driver_id = request.user.id  # Fetch driver_id from the authenticated user
        print("driver", driver_id)

        # Verify driver exists
        driver = get_object_or_404(Driver, id=driver_id)

        # Step 2: Validate the ride acceptance data
        if not ride_id:
            return Response(
                {'error': 'ride_id is required to accept a ride'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 3: Check if the ride exists and is pending
        try:
            ride = Booking.objects.get(booking_id=ride_id, status='picked', driver=driver)
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Ride not found or is not picked by this driver'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Step 4: Assign the ride to the driver
        try:
            ride.status = 'completed'
            ride.drop_date = now
            ride.save()
            # Coordinates: (latitude, longitude)
            pickup_point = (ride.pickup_latitude, ride.pickup_longitude) 
            drop_point = (ride.dropoff_latitude, ride.dropoff_longitude) 
            billing_id = getRandomBillId()
            # print(billing_id)
            bill = BillingInformation(
                billing_id = billing_id,
                ride=ride,
                date = now.date(),
                pickup_time = ride.picked_date,
                drop_off_time = now,
                distance_covered = haversine(pickup_point, drop_point, unit=Unit.MILES),
                total_amount = ride.predicted_fare,
                source_location = ride.pickup_location,
                destination_location = ride.dropoff_location,
                driver=ride.driver,
                customer=ride.customer
            )
            bill.save()
            total_trips=Booking.objects.filter(driver=driver,status='completed').count()
            driver.total_trips = total_trips
            driver.save()
            ride_data = {
                'ride_id': ride_id,
                "driver_id":driver_id,
                "driver_name":"{} {}".format(driver.first_name, driver.last_name),
                'predicted_fare': float(ride.predicted_fare),
                'pickup_coordinates': {
                    'lat': float(ride.pickup_latitude),
                    'lng': float(ride.pickup_longitude)
                },
                'dropoff_coordinates': {
                    'lat': float(ride.dropoff_latitude),
                    'lng': float(ride.dropoff_longitude)
                }
            }
            send_kafka_message({
                "type":RIDE_COMPLETED,
                "data":ride_data
            })
            return Response({
                'message': 'Ride completed successfully',
                'ride_id': ride.booking_id,
                'status': ride.status,
                'customer_id': ride.customer.customer_id,
                'pickup_coordinates': {
                    'lat': ride.pickup_latitude,
                    'lng': ride.pickup_longitude
                },
                'dropoff_coordinates': {
                    'lat': ride.dropoff_latitude,
                    'lng': ride.dropoff_longitude
                },
                'predicted_fare': str(ride.predicted_fare)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error while completing the ride: {e}")
            return Response(
                {'error': 'An error occurred while completing the ride'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_ride_requests(request):
    print("Authenticated driver:", request.user.id)
    print("Fetching ride requests")

    # Step 1: Get authenticated driver's ID
    driver_id = request.user.id  # Fetch driver_id from the authenticated user
    print("driver", driver_id)

    # Verify driver exists
    driver = get_object_or_404(Driver, id=driver_id)

    # Step 2: Fetch rides that are pending or assigned to the driver
    try:
        # Filter rides where status is 'pending' or 'accepted' by the current driver
        drive_ride = Booking.objects.filter(
            status__in=['accepted','picked'],driver=driver).first()
        if drive_ride:
            rides = []
        else:
            ride_ids = getRideRequest(driver.current_location_lat, driver.current_location_lng)
            rides = Booking.objects.filter(
                booking_id__in=ride_ids
            ).filter(driver__isnull=True) 

        # Serialize the rides
        serialized_rides = [
            {
                'ride_id': ride.booking_id,
                'status': ride.status,
                'customer_id': ride.customer.customer_id,
                'pickup_coordinates': {
                    'lat': ride.pickup_latitude,
                    'lng': ride.pickup_longitude
                },
                'dropoff_coordinates': {
                    'lat': ride.dropoff_latitude,
                    'lng': ride.dropoff_longitude
                },
                'pickup_location': ride.pickup_location,
                'dropoff_location': ride.dropoff_location,
                'predicted_fare': str(ride.predicted_fare),
                'created_at': ride.created_at
            } for ride in rides
        ]

        return Response(serialized_rides, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error fetching ride requests: {e}")
        return Response(
            {'error': 'An error occurred while fetching ride requests'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_ongoing_ride(request):
    print("Authenticated driver:", request.user.id)
    print("Fetching ride requests")

    # Step 1: Get authenticated driver's ID
    driver_id = request.user.id  # Fetch driver_id from the authenticated user
    print("driver", driver_id)

    # Verify driver exists
    driver = get_object_or_404(Driver, id=driver_id)

    # Step 2: Fetch rides that are pending or assigned to the driver
    try:
        # Filter rides where status is 'pending' or 'accepted' by the current driver
        rides = Booking.objects.filter(
            driver=driver,status__in=['accepted', 'picked']
        )

        # Serialize the rides
        serialized_rides = [
            {
                'ride_id': ride.booking_id,
                'status': ride.status,
                'customer_id': ride.customer.customer_id,
                'pickup_coordinates': {
                    'lat': ride.pickup_latitude,
                    'lng': ride.pickup_longitude
                },
                'dropoff_coordinates': {
                    'lat': ride.dropoff_latitude,
                    'lng': ride.dropoff_longitude
                },
                'pickup_location': ride.pickup_location,
                'dropoff_location': ride.dropoff_location,
                'predicted_fare': str(ride.predicted_fare),
                'created_at': ride.created_at
            } for ride in rides
        ]

        return Response(serialized_rides, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error fetching ongoing ride: {e}")
        return Response(
            {'error': 'An error occurred while fetching ongoing ride'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_rides(request):
    print("Authenticated driver:", request.user.id)
    print("Fetching ride requests")

    # Step 1: Get authenticated driver's ID
    driver_id = request.user.id  # Fetch driver_id from the authenticated user
    print("driver", driver_id)

    # Verify driver exists
    driver = get_object_or_404(Driver, id=driver_id)

    # Step 2: Fetch rides that are pending or assigned to the driver
    try:
        # Filter rides where status is 'pending' or 'accepted' by the current driver
        rides = Booking.objects.filter(
            driver=driver, status='completed'
        )

        # Serialize the rides
        serialized_rides = [
            {
                'ride_id': ride.booking_id,
                'status': ride.status,
                'customer_id': ride.customer.customer_id,
                'pickup_coordinates': {
                    'lat': ride.pickup_latitude,
                    'lng': ride.pickup_longitude
                },
                'dropoff_coordinates': {
                    'lat': ride.dropoff_latitude,
                    'lng': ride.dropoff_longitude
                },
                'pickup_location': ride.pickup_location,
                'dropoff_location': ride.dropoff_location,
                'predicted_fare': str(ride.predicted_fare),
                'created_at': ride.created_at
            } for ride in rides
        ]

        return Response(serialized_rides, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error fetching ride requests: {e}")
        return Response(
            {'error': 'An error occurred while fetching ride requests'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_driver_video(request):
    driver = request.user
    video = request.FILES.get('video')
    
    if not video:
        return Response({'error': 'No video file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    driver.introduction_video = video
    driver.save()
    return Response({'message': 'Video uploaded successfully'}, status=status.HTTP_200_OK)

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
    #permission_classes = [IsAuthenticated]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = DriverFilter
    lookup_field = 'user_id'
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
    print(driver)
    serializer = DriverSerializer(driver, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_driver_profile(request):
    driver = request.user
    serializer = DriverSerializer(driver)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_review(request, driver_id):
    driver = get_object_or_404(Driver, id=driver_id)
    serializer = ReviewSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save(driver=driver, passenger=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Delete Driver view for admin
@api_view(['DELETE'])
@csrf_exempt
def delete_driver(request, driver_id):
   try:
       driver = Driver.objects.get(driver_id=driver_id)
       driver.delete()
       return Response({"message": "Driver deleted successfully"}, status=status.HTTP_200_OK)
   except Driver.DoesNotExist:
       return Response({"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND)
