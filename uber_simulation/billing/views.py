from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import BillingInformation
from .serializers import BillingSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from datetime import datetime
from ml_model.predictor import preprocess_and_predict  # New import
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from .models import BillingInformation
from rest_framework.permissions import IsAuthenticated
from users.authentication import CustomJWTAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from users.models import Booking



class BillingViewSet(viewsets.ModelViewSet):
    queryset = BillingInformation.objects.all()
    serializer_class = BillingSerializer
    
    def create(self, request):
        try:
            # Get current datetime for prediction
            current_datetime = datetime.now()
            
            # Prepare input data for prediction
            input_data = {
                "pickup_latitude": request.data.get('pickup_lat'),
                "pickup_longitude": request.data.get('pickup_long'),
                "dropoff_latitude": request.data.get('dropoff_lat'),
                "dropoff_longitude": request.data.get('dropoff_long'),
                "hour": current_datetime.hour,
                "weekday": current_datetime.weekday(),
                "date": current_datetime.day,
                "month": current_datetime.month,
                "year": current_datetime.year,
                "passenger_count": request.data.get('passenger_count'),
            }
            
            # Calculate price using ML model
            predicted_fare = preprocess_and_predict(input_data)
            
            # Add calculated price to request data
            request_data = request.data.copy()
            request_data['total_amount'] = predicted_fare
            
            # Validate and save with serializer
            serializer = self.serializer_class(data=request_data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Billing created successfully',
                    'data': serializer.data,
                    'predicted_fare': predicted_fare
                }, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'error': 'Price calculation failed', 
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    # Rest of your methods remain the same
    def destroy(self, request, pk=None):
        try:
            billing = get_object_or_404(BillingInformation, billing_id=pk)
            billing.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({
                'error': 'Delete operation failed', 
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def search(self, request):
        params = request.query_params
        queryset = self.queryset
        
        if 'start_date' in params:
            queryset = queryset.filter(date__gte=params['start_date'])
        if 'end_date' in params:
            queryset = queryset.filter(date__lte=params['end_date'])
        if 'date' in params:
            queryset = queryset.filter(date=params['date'])
        if 'driver_id' in params:
            queryset = queryset.filter(driver_id=params['driver_id'])
        if 'customer_id' in params:
            queryset = queryset.filter(customer_id=params['customer_id'])
        if 'billing_id' in params:
            queryset = queryset.filter(billing_id=params['billing_id'])

        bills_data_list = []
        for bill in queryset:
           bill_data = {
               'billing_id': bill.billing_id,
               'bill_date': bill.date,
               'pickup_time': bill.pickup_time.strftime("%Y-%m-%d %H:%M:%S"),
               'drop_off_time': bill.drop_off_time.strftime("%Y-%m-%d %H:%M:%S"),
               'distance_covered': float(bill.distance_covered),
               'total_amount': float(bill.total_amount),
               'source_location': bill.source_location,
               'destination_location': bill.destination_location,
               'driver_id': bill.driver.driver_id,
               'customer_id': bill.customer.customer_id,
               'ride_id': bill.ride.booking_id if bill.ride else None
           }
           bills_data_list.append(bill_data)
            
        
        return Response(bills_data_list, status=status.HTTP_200_OK)
    
@api_view(["GET"])
def getBillInfo(request, ride_id):
    try:
        ride = Booking.objects.get(booking_id=ride_id)
        bill = BillingInformation.objects.get(ride=ride)
        billInfo = {
            "billing_id":bill.billing_id,
            "bill_date":bill.date,
            "pickup_time":bill.pickup_time.strftime("%I:%M %p"),
            "drop_off_time":bill.drop_off_time.strftime("%I:%M %p"),
            "distance_covered":bill.distance_covered,
            "total_amount":bill.total_amount,
            "source_location":bill.source_location,
            "destination_location":bill.destination_location,
            "driver_id":bill.driver.driver_id,
            "customer_id":bill.customer.customer_id,
        }
        return Response(billInfo, status=status.HTTP_200_OK)
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Ride not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except BillingInformation.DoesNotExist:
        return Response(
            {'error': 'Bill not found'},
            status=status.HTTP_404_NOT_FOUND
        )
 #Dhruv's code   
@api_view(['GET'])
def get_all_bills(request):
   try:
       # Get all bills, ordered by date (most recent first, as per your model Meta)
       bills = BillingInformation.objects.all()
      
       # Format all bills
       bills_data = []
       for bill in bills:
           bill_data = {
               'billing_id': bill.billing_id,
               'bill_date': bill.date,
               'pickup_time': bill.pickup_time.strftime("%Y-%m-%d %H:%M:%S"),
               'drop_off_time': bill.drop_off_time.strftime("%Y-%m-%d %H:%M:%S"),
               'distance_covered': float(bill.distance_covered),
               'total_amount': float(bill.total_amount),
               'source_location': bill.source_location,
               'destination_location': bill.destination_location,
               'driver_id': bill.driver.driver_id,
               'customer_id': bill.customer.customer_id,
               'ride_id': bill.ride.booking_id if bill.ride else None
           }
           bills_data.append(bill_data)
      
       # Add summary statistics
       total_revenue = sum(float(bill.total_amount) for bill in bills)
       total_rides = len(bills)
       total_distance = sum(float(bill.distance_covered) for bill in bills)
      
       response_data = {
           'bills': bills_data,
           'summary': {
               'total_bills': total_rides,
               'total_revenue': round(total_revenue, 2),
               'total_distance_covered': round(total_distance, 2),
               'average_bill_amount': round(total_revenue/total_rides, 2) if total_rides > 0 else 0
           }
       }
      
       return Response(response_data, status=status.HTTP_200_OK)
      
   except Exception as e:
       print(f"Error fetching bills: {str(e)}")  # For debugging
       return Response(
           {'error': 'Failed to fetch bills'},
           status=status.HTTP_500_INTERNAL_SERVER_ERROR
       )


@api_view(['GET'])
def get_bill_details(request, ride_id):
   try:
       bill = get_object_or_404(BillingInformation, ride_id=ride_id)
      
       response_data = {
           'billing_id': bill.billing_id,
           'bill_date': bill.date,
           'pickup_time': bill.pickup_time.strftime("%Y-%m-%d %H:%M:%S"),
           'drop_off_time': bill.drop_off_time.strftime("%Y-%m-%d %H:%M:%S"),
           'distance_covered': float(bill.distance_covered),
           'total_amount': float(bill.total_amount),
           'source_location': bill.source_location,
           'destination_location': bill.destination_location,
           'driver_id': bill.driver.driver_id,
           'customer_id': bill.customer.customer_id,
           'ride_id': bill.ride.booking_id if bill.ride else None
       }
      
       return Response(response_data, status=status.HTTP_200_OK)
      
   except BillingInformation.DoesNotExist:
       return Response(
           {'error': 'Bill not found for this ride'},
           status=status.HTTP_404_NOT_FOUND
       )
   except Exception as e:
       print(f"Error fetching bill: {str(e)}")
       return Response(
           {'error': 'Failed to fetch bill details'},
           status=status.HTTP_500_INTERNAL_SERVER_ERROR
       )
@api_view(['GET'])
def search_bills(request):
   try:
       # Get query parameters
       billing_id = request.GET.get('billing_id', '')
       start_date = request.GET.get('start_date', '')
       end_date = request.GET.get('end_date', '')
       driver_id = request.GET.get('driver_id', '')
       customer_id = request.GET.get('customer_id', '')


       # Start with all bills
       queryset = BillingInformation.objects.all()


       # Apply filters based on provided parameters
       if billing_id:
           queryset = queryset.filter(billing_id__icontains=billing_id)
      
       if start_date:
           start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
           queryset = queryset.filter(date__gte=start_date)
      
       if end_date:
           end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
           queryset = queryset.filter(date__lte=end_date)
      
       if driver_id:
           queryset = queryset.filter(driver__driver_id=driver_id)
      
       if customer_id:
           queryset = queryset.filter(customer__customer_id=customer_id)


       # Format the response data
       bills_data = []
       for bill in queryset:
           bill_data = {
               'billing_id': bill.billing_id,
               'date': bill.date,
               'customer': {
                   'first_name': bill.customer.first_name,
                   'last_name': bill.customer.last_name,
                   'customer_id': bill.customer.customer_id
               },
               'driver': {
                   'first_name': bill.driver.first_name,
                   'last_name': bill.driver.last_name,
                   'driver_id': bill.driver.driver_id
               },
               'distance_covered': float(bill.distance_covered),
               'total_amount': float(bill.total_amount),
               'source_location': bill.source_location,
               'destination_location': bill.destination_location,
               'pickup_time': bill.pickup_time.strftime("%Y-%m-%d %H:%M:%S"),
               'drop_off_time': bill.drop_off_time.strftime("%Y-%m-%d %H:%M:%S"),
               'ride_id': bill.ride.booking_id if bill.ride else None
           }
           bills_data.append(bill_data)


       # Add summary statistics
       total_revenue = sum(float(bill.total_amount) for bill in queryset)
       total_rides = len(bills_data)
       total_distance = sum(float(bill.distance_covered) for bill in queryset)


       response_data = {
           'bills': bills_data,
           'summary': {
               'total_bills': total_rides,
               'total_revenue': round(total_revenue, 2),
               'total_distance': round(total_distance, 2),
               'average_bill_amount': round(total_revenue/total_rides, 2) if total_rides > 0 else 0
           }
       }


       return Response(response_data, status=status.HTTP_200_OK)


   except Exception as e:
       print(f"Error searching bills: {str(e)}")  # For debugging
       return Response(
           {'error': 'Failed to search bills'},
           status=status.HTTP_500_INTERNAL_SERVER_ERROR
       )
