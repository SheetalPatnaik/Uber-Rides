from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Customer, Review
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import permission_classes, api_view, authentication_classes
from .serializers import CustomerSerializer
from driver.models import Driver
from django.db.models import Avg


# views.py

@csrf_exempt
def register_customer(request):
    print("Inside register_customer function")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract the customer ID (SSN) from the request
            customer_id = data.get('customer_id')
            print("customer_id", customer_id)
            # Check if the customer ID (SSN) already exists
            if Customer.objects.filter(customer_id=customer_id).exists():
                return JsonResponse(
                    {'error': 'Customer with this SSN already exists'}, 
                    status=400
                )

            # Validate password
            password = data.get('password')
            if not password:
                return JsonResponse(
                    {'error': 'Password is required'}, 
                    status=400
                )
            print(data)
            # Create a new customer record
            customer = Customer.objects.create(
                customer_id=customer_id,
                first_name=data['first_name'],
                last_name=data['last_name'],
                address=data['address'],
                city=data['city'],
                state=data['state'],
                zip_code=data['zip_code'],
                phone_number=data['phone_number'],
                email=data['email'],
                credit_card=data['credit_card'],
                password=make_password(password),
            )

            return JsonResponse(
                {'message': 'Customer registered successfully!'}, 
                status=201
            )

        except KeyError as e:
            return JsonResponse(
                {'error': f'Missing required field: {str(e)}'}, 
                status=400
            )
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)

## login with jwt toke

@csrf_exempt
def login_customer(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Extract the customer ID (SSN) and password from the request data
            customer_id = data.get('customer_id')
            password = data.get('password')
            
            if not customer_id or not password:
                return JsonResponse({'error': 'Customer ID and password are required'}, status=400)
            
            print("step1")

            # Check if the customer exists with the given SSN
            customer = Customer.objects.filter(customer_id=customer_id).first()
            if not customer:
                return JsonResponse({'error': 'Customer with this SSN does not exist'}, status=400)
            
            print("step2")
            
            # Check if the password matches the hashed password stored in the database
            if not check_password(password, customer.password):
                return JsonResponse({'error': 'Incorrect password'}, status=400)
            
            print("step3")
            
            print(data)
            # Generate custom JWT tokens (access and refresh) without using for_user
            refresh = RefreshToken()
            refresh['customer_id'] = customer.customer_id  # Custom claim
            print("Access Token:", str(refresh.access_token))
            print("Refresh Token:", str(refresh))

            print("step4")
            
            return JsonResponse({
                'message': 'Login successful',
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'customer_id': customer.customer_id, 
            }, status=200)
            

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
@api_view(['GET'])
def list_customers(request):
    try:
        customers = Customer.objects.all()
        customers_data = []
        for customer in customers:
            customer_data = {
                'customer_id': customer.customer_id,
                'first_name': customer.first_name,
                'last_name': customer.last_name,
                'email': customer.email,
                'phone_number': customer.phone_number,
                'city': customer.city,
                'state': customer.state,
                'is_active': True,  # You can add this field to your model if needed
                'total_rides': Booking.objects.filter(customer=customer).count()
            }
            customers_data.append(customer_data)
        return Response(customers_data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error fetching customers: {str(e)}")
        return Response(
            {'error': 'Failed to fetch customers'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@csrf_exempt
def delete_customer(request, customer_id):
   try:
       customer = get_object_or_404(Customer, customer_id=customer_id)
       customer.delete()
       return JsonResponse({'message': 'Customer deleted successfully'}, status=204)
   except Exception as e:
       return JsonResponse({'error': str(e)}, status=400)

##bookRide excluding fair amount

# from rest_framework import status
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from .serializers import BookingSerializer
# from .models import Booking
# from ml_model.predictor import preprocess_and_predict


# class BookRideView(APIView):
#     def post(self, request, *args, **kwargs):
#         print("Received booking request")
#         print("Complete request data:", request.data)
#         # Get customer_id from request data
#         customer_id = request.data.get('customerId')
        
#         if not customer_id:
#             return Response({
#                 "error": "Please login to book a ride"
#             }, status=status.HTTP_401_UNAUTHORIZED)
            
#         try:
#             # Verify customer exists
#             customer = Customer.objects.get(customer_id=customer_id)
#         except Customer.DoesNotExist:
#             return Response({
#                 "error": "Customer not found"
#             }, status=status.HTTP_404_NOT_FOUND)

#         serializer = BookingSerializer(data=request.data)
#         if serializer.is_valid():
#             booking = serializer.save()
#             return Response({
#                 'message': 'Booking successful', 
#                 'booking_id': booking.booking_id
#             }, status=status.HTTP_201_CREATED)
        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



#view including fair prediction
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Customer, Booking
from .serializers import BookingSerializer
from ml_model.predictor import preprocess_and_predict
import pickle
import os
from decimal import Decimal,ROUND_DOWN

## view include fair and JWT token
from .authentication import CustomJWTAuthentication
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Customer, Booking
from .serializers import BookingSerializer
from ml_model.predictor import preprocess_and_predict
import pickle
import os
from decimal import Decimal, ROUND_DOWN
from rides.kafka_producer import send_kafka_message
from rides.constants import CREATE_RIDE
# views.py
from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from utils.util import filterDrivers

class FilterDriversView(APIView):
    def post(self, request):
        try:
            # Get pickup coordinates from request parameters
            pickupCoordinates = request.data.get("pickupCoordinates")
            pickup_lat = float(pickupCoordinates.get('lat'))
            pickup_lng = float(pickupCoordinates.get('lng'))
        except (TypeError, ValueError):
            return Response({"error": "Invalid or missing coordinates."}, status=400)

        drivers = filterDrivers(pickup_lat, pickup_lng)
        return Response(drivers)


class BookRideView(APIView):
    authentication_classes = [CustomJWTAuthentication]  # Use the custom JWT authentication
    permission_classes = [IsAuthenticated]
    @csrf_exempt

    def post(self, request, *args, **kwargs):
        print("Authenticated user:", request.user.customer_id)
        print("Received booking request")
        print("Complete request data:", request.data)
        
        # Step 1: Get authenticated user's ID
        customer_id = request.user.customer_id  # Fetch customer_id from the authenticated user
        print("customer", customer_id)

        # Verify customer exists
        customer = get_object_or_404(Customer, customer_id=customer_id)
        # Step 2: check if customer is already in ride
        customer_ride = Booking.objects.filter(
            status__in=['pending','accepted'],customer=customer).first()
        if customer_ride:
            return Response(
                {'error': 'Customer cannot create 2 rides at a time.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = request.data.copy()
        try:
            # Get pickup coordinates from request parameters
            pickupCoordinates = data.get("pickupCoordinates")
            pickup_lat = float(pickupCoordinates.get('lat'))
            pickup_lng = float(pickupCoordinates.get('lng'))
        except (TypeError, ValueError):
            return Response({"error": "Invalid or missing coordinates."}, status=400)

        drivers = filterDrivers(pickup_lat, pickup_lng)
        if len(drivers)==0:
            return Response({"error": "No driver found within 10 miles"}, status=400)
        # print(drivers)
        data["customerId"] = customer_id
        # data["available_drivers"] = [ driver.get("driver_id") for driver in drivers]
        # Validate the booking request data
        serializer = BookingSerializer(data=data)
        # print(data)
        if serializer.is_valid():
            try:
                # Extract current datetime for booking
                current_datetime = datetime.now()

                # Extract hour, weekday, date, month, and year from current datetime
                hour = current_datetime.hour
                weekday = current_datetime.weekday()
                date = current_datetime.day
                month = current_datetime.month
                year = current_datetime.year

                input_data = {
                    "pickup_latitude": request.data.get("pickupCoordinates").get("lat"),
                    "pickup_longitude": request.data.get("pickupCoordinates").get("lng"),
                    "dropoff_latitude": request.data.get("dropoffCoordinates").get("lat"),
                    "dropoff_longitude": request.data.get("dropoffCoordinates").get("lng"),
                    "hour": hour,
                    "weekday": weekday,
                    "date": date,
                    "month": month,
                    "year": year,
                    "passenger_count": request.data.get("numPassengers"),
                    "customer_id": customer_id
                }

                # Make the prediction
                predicted_fare = preprocess_and_predict(input_data)

                # Convert np.float32 to Decimal and round to two decimal places
                predicted_fare_decimal = Decimal(float(predicted_fare)).quantize(Decimal('0.01'), rounding=ROUND_DOWN)

                print(f"Predicted Fare (Decimal): {predicted_fare_decimal}")

                # Add predicted fare to the request data and save the booking
                booking = serializer.save(customer=customer, predicted_fare=predicted_fare_decimal, status='pending')
                ride_data = {
                    'ride_id': booking.booking_id,
                    "customer_id":customer_id,
                    "customer_name":"{} {}".format(customer.first_name, customer.last_name),
                    'predicted_fare': float(predicted_fare_decimal),
                    'pickup_coordinates': {
                        'lat': booking.pickup_latitude,
                        'lng': booking.pickup_longitude
                    },
                    'dropoff_coordinates': {
                        'lat': booking.dropoff_latitude,
                        'lng': booking.dropoff_longitude
                    }
                }
                send_kafka_message({
                    "type":CREATE_RIDE,
                    "data":ride_data
                })
                return Response({
                    'message': 'Booking successful',
                    'booking_id': booking.booking_id,
                    'predicted_fare': str(predicted_fare_decimal),
                    'status': booking.status
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                print(f"Error during booking or prediction: {e}")
                return Response({
                    'error': 'An error occurred while processing the booking'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # If serializer is invalid, return errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def get(self, request, *args, **kwargs):
        print("Authenticated Customer:", request.user.customer_id)
        print("Fetching ride requests")

        # Step 1: Get authenticated driver's ID
        customer_id = request.user.customer_id # Fetch driver_id from the authenticated user
        print("Customer", customer_id)

        # Verify driver exists
        customer = get_object_or_404(Customer, customer_id=customer_id)

        # Step 2: Fetch rides that are pending or assigned to the driver
        try:
            # Filter rides where status is 'pending' or 'accepted' by the current driver
            rides = Booking.objects.filter(
                customer=customer,
            )

            # Serialize the rides
            serialized_rides = [
                {
                    'ride_id': ride.booking_id,
                    'status': ride.status,
                    'driver_id': ride.driver.id if ride.driver else None,
                    'pickup_coordinates': {
                        'lat': ride.pickup_latitude,
                        'lng': ride.pickup_longitude
                    },
                    'dropoff_coordinates': {
                        'lat': ride.dropoff_latitude,
                        'lng': ride.dropoff_longitude
                    },
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
@authentication_classes([CustomJWTAuthentication])
def get_ongoing_ride(request):
    print("Authenticated user:", request.user.customer_id)
    print("Received booking request")
    print("Complete request data:", request.data)
    
    # Step 1: Get authenticated user's ID
    customer_id = request.user.customer_id  # Fetch customer_id from the authenticated user
    print("customer", customer_id)

    # Verify customer exists
    customer = get_object_or_404(Customer, customer_id=customer_id)

    # Step 2: Fetch rides that are pending or assigned to the driver
    try:
        # Filter rides where status is 'pending' or 'accepted' by the current driver
        rides = Booking.objects.filter(
            customer=customer,status__in=['pending','accepted', 'picked']
        )

        # Serialize the rides
        serialized_rides = [
            {
                'ride_id': ride.booking_id,
                'status': ride.status,
                'driver_id': ride.driver.driver_id if ride.driver else None,
                'pickup_coordinates': {
                    'lat': ride.pickup_latitude,
                    'lng': ride.pickup_longitude
                },
                'dropoff_coordinates': {
                    'lat': ride.dropoff_latitude,
                    'lng': ride.dropoff_longitude
                },
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
@authentication_classes([CustomJWTAuthentication])
def get_rides(request):
    print("Authenticated user:", request.user.customer_id)
    print("Received booking request")
    print("Complete request data:", request.data)
    
    # Step 1: Get authenticated user's ID
    customer_id = request.user.customer_id  # Fetch customer_id from the authenticated user
    print("customer", customer_id)

    # Verify customer exists
    customer = get_object_or_404(Customer, customer_id=customer_id)

    # Step 2: Fetch rides that are pending or assigned to the driver
    try:
        # Filter rides where status is 'pending' or 'accepted' by the current driver
        rides = Booking.objects.filter(
            customer=customer, status='completed'
        )

        # Serialize the rides
        serialized_rides = [
            {
                'ride_id': ride.booking_id,
                'status': ride.status,
                'driver_id': ride.driver.driver_id if ride.driver else None,
                'pickup_location': ride.pickup_location,
                'dropoff_location': ride.dropoff_location,
                'pickup_coordinates': {
                    'lat': ride.pickup_latitude,
                    'lng': ride.pickup_longitude
                },
                'dropoff_coordinates': {
                    'lat': ride.dropoff_latitude,
                    'lng': ride.dropoff_longitude
                },
                'predicted_fare': str(ride.predicted_fare),
                'created_at': ride.created_at,
                'is_reviewed': ride.is_reviewed
            } for ride in rides
        ]

        return Response(serialized_rides, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error fetching ride requests: {e}")
        return Response(
            {'error': 'An error occurred while fetching ride requests'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
#Adding this new for update profile
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def get_customer_profile(request):
    customer = request.user
    serializer = CustomerSerializer(customer)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def update_customer_profile(request):
    customer = request.user
    serializer = CustomerSerializer(customer, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def add_review(request, ride_id):
    customer = request.user
    data=request.data
    if data.get('rating') is not None and data.get('content'):
        try:
            ride = Booking.objects.get(booking_id=ride_id)
            if ride.customer != customer:
                return Response({'error': 'You are not authorized to add a review for this ride'}, status=status.HTTP_403_FORBIDDEN)
            if ride.status != 'completed':
                return Response({'error': 'You can only add a review after the ride is completed'}, status=status.HTTP_400_BAD_REQUEST)
            rating = data.get('rating')
            content = data.get('content')
            driver = ride.driver
            review = Review.objects.filter(passenger=customer, driver=driver, booking=ride).first()
            if review:
                return Response({'error': 'You have already added a review for this ride'}, status=status.HTTP_400_BAD_REQUEST)
            review = Review.objects.create(passenger=customer, driver=driver, rating=rating, content=content)
            review.save()
            # Calculate the average rating for the driver
            average_rating = Review.objects.filter(driver=driver).aggregate(Avg('rating'))['rating__avg']
            driver.rating = average_rating
            driver.save()
            return Response({'message': 'Review added successfully'}, status=status.HTTP_201_CREATED)
        except Booking.DoesNotExist:
            return Response({'error': 'Ride not found'}, status=status.HTTP_404_NOT_FOUND)
        
    else:
        return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def get_ride_detail(request, ride_id):
    customer = request.user
    try:
        # Get the booking (ride) by the booking ID
        ride = Booking.objects.get(booking_id=ride_id, customer=customer)
        
        # Check if a review already exists for this booking
        review = Review.objects.filter(booking=ride).first()

        review_data = None
        if review:
            review_data = {
                'rating': review.rating,
                'content': review.content,
            }
        ride_details={
                'ride_id': ride.booking_id,
                'status': ride.status,
                'driver_id': ride.driver.driver_id if ride.driver else None,
                'pickup_location': ride.pickup_location,
                'dropoff_location': ride.dropoff_location,
                'pickup_coordinates': {
                    'lat': ride.pickup_latitude,
                    'lng': ride.pickup_longitude
                },
                'dropoff_coordinates': {
                    'lat': ride.dropoff_latitude,
                    'lng': ride.dropoff_longitude
                },
                "pickup_time":ride.picked_date.strftime("%I:%M %p") if ride.picked_date else None,
                "drop_off_time":ride.drop_date.strftime("%I:%M %p") if ride.drop_date else None,
                'predicted_fare': str(ride.predicted_fare),
                'created_at': ride.created_at,
                'is_reviewed': ride.is_reviewed
            }
        return Response({
            'ride_details': ride_details,
            'review': review_data,  # If a review exists, include it
        })
    except Booking.DoesNotExist:
        return Response({'error': 'Ride not found'}, status=status.HTTP_404_NOT_FOUND)

# class BookRideView(APIView):
#     def post(self, request, *args, **kwargs):
#         print("Received booking request")
#         print("Complete request data:", request.data)
        
#         # Step 1: Get customer_id from request data
#         customer_id = request.data.get('customerId')
#         print("customer",customer_id)
#         if not customer_id:
#             return Response({
#                 "error": "Please login to book a ride"
#             }, status=status.HTTP_401_UNAUTHORIZED)

#         # Step 2: Verify customer exists
#         customer = get_object_or_404(Customer, customer_id=customer_id)
       
#         # Step 3: Validate the booking request data
#         serializer = BookingSerializer(data=request.data)
#         if serializer.is_valid():
#             try:
#                 # Step 4: Process data and make a prediction
               
#                 # Extract current datetime for booking
#                 current_datetime = datetime.now()

#                 # Extract hour, weekday, date, month, and year from current datetime
#                 hour = current_datetime.hour
#                 weekday = current_datetime.weekday()  # Monday = 0, Sunday = 6
#                 date = current_datetime.day
#                 month = current_datetime.month
#                 year = current_datetime.year

#                 input_data = {
#                     "pickup_latitude": request.data.get("pickupCoordinates").get("lat"),
#                     "pickup_longitude": request.data.get("pickupCoordinates").get("lng"),
#                     "dropoff_latitude": request.data.get("dropoffCoordinates").get("lat"),
#                     "dropoff_longitude": request.data.get("dropoffCoordinates").get("lng"),
#                     "hour": hour,
#                     "weekday": weekday,
#                     "date": date,
#                     "month": month,
#                     "year": year,
#                     "passenger_count": request.data.get("numPassengers"),
#                     "customer_id": customer_id
#                 }

#                 print("before preprocess data", input_data)
#                 # Make the prediction
#                 predicted_fare = preprocess_and_predict(input_data)

#                 # Convert np.float32 to Decimal
#                 predicted_fare_decimal = Decimal(float(predicted_fare))

#                 # Round to two decimal places
#                 predicted_fare_decimal = predicted_fare_decimal.quantize(Decimal('0.01'), rounding=ROUND_DOWN)

#                 print("predictor.py ran")
#                 print(f"Predicted Fare (Decimal): {predicted_fare_decimal}")

#                 # Add predicted fare to the request data
#                 request.data['predictedFare'] = predicted_fare_decimal

#                 print("Request data with predicted fare:", request.data)

#                 print(f"Saving booking with predicted fare: {predicted_fare_decimal}")
#                 # Save the booking instance with the predicted fare
#                 booking = serializer.save(customer=customer,predicted_fare=predicted_fare_decimal, status='pending')
                
#                 print("passing data",request.data)
#                 return Response({
#                     'message': 'Booking successful',
#                     'booking_id': booking.booking_id,
#                     'predicted_fare': str(predicted_fare_decimal),
#                     'status': booking.status
#                 }, status=status.HTTP_201_CREATED)

#             except Exception as e:
#                 print(f"Error during booking or prediction: {e}")
#                 return Response({
#                     'error': 'An error occurred while processing the booking'
#                 }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         # If serializer is invalid, return errors
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
