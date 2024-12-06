# administrator/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from driver.models import Driver
from users.models import Customer, Booking
from billing.models import BillingInformation
from driver.serializers import DriverSerializer
from users.serializers import BookingSerializer
from billing.serializers import BillingSerializer
from .models import Administrator
from .serializers import AdministratorSerializer
from django.db.models import Sum, Count
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

# Admin login view
@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    admin_user = authenticate(request, email=email, password=password)
    if admin_user is not None and isinstance(admin_user, Administrator):
        login(request, admin_user)
        return Response({'message': 'Admin logged in successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials!'}, status=status.HTTP_401_UNAUTHORIZED)

# Admin dashboard view
@login_required
def admin_dashboard(request):
    if not isinstance(request.user, Administrator):
        messages.error(request, "You are not authorized to access this page.")
        return redirect('admin_login')
    return render(request, 'administrator/dashboard.html')  # Update template path

# # Add driver view
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def add_driver(request):
#     if not isinstance(request.user, Administrator):
#         return Response({'error': 'Permission denied.'}, status=403)
#     serializer = DriverSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({'message': 'Driver added successfully.', 'data': serializer.data}, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # Add customer view
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def add_customer(request):
#     if not isinstance(request.user, Administrator):
#         return Response({'error': 'Permission denied.'}, status=403)
#     serializer = CustomerSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({'message': 'Customer added successfully.', 'data': serializer.data}, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Review account view
# class ReviewAccountView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         if not isinstance(request.user, Administrator):
#             return Response({'error': 'Permission denied.'}, status=403)

#         driver_id = request.query_params.get('driver_id')
#         customer_id = request.query_params.get('customer_id')

#         if driver_id:
#             driver = get_object_or_404(Driver, id=driver_id)
#             serializer = DriverSerializer(driver)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#         if customer_id:
#             customer = get_object_or_404(Customer, customer_id=customer_id)
#             serializer = CustomerSerializer(customer)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#         return Response({"error": "Please provide a driver_id or customer_id"}, status=status.HTTP_400_BAD_REQUEST)

# Statistics view
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def statistics_view(request):
    if not isinstance(request.user, Administrator):
        return Response({'error': 'Permission denied.'}, status=403)

    # Revenue per day
    revenue_per_day = BillingInformation.objects.values('date').annotate(total_revenue=Sum('total_amount'))

    # Total rides area-wise (assuming area is determined by pickup_location)
    rides_per_area = Booking.objects.values('pickup_location').annotate(total_rides=Count('booking_id'))

    data = {
        'revenue_per_day': list(revenue_per_day),
        'rides_per_area': list(rides_per_area)
    }

    return Response(data, status=status.HTTP_200_OK)

# Graphs data view
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def graphs_data_view(request):
    if not isinstance(request.user, Administrator):
        return Response({'error': 'Permission denied.'}, status=403)

    # Rides per area
    rides_per_area = Booking.objects.values('pickup_location').annotate(total_rides=Count('booking_id'))

    # Rides per driver
    rides_per_driver = Booking.objects.values('driver__first_name').annotate(total_rides=Count('booking_id'))

    # Rides per customer
    rides_per_customer = Booking.objects.values('customer__first_name').annotate(total_rides=Count('booking_id'))

    data = {
        'rides_per_area': list(rides_per_area),
        'rides_per_driver': list(rides_per_driver),
        'rides_per_customer': list(rides_per_customer),
    }

    return Response(data, status=status.HTTP_200_OK)

# # Bill search view
# class BillSearchView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         if not isinstance(request.user, Administrator):
#             return Response({'error': 'Permission denied.'}, status=403)

#         params = request.query_params
#         bills = BillingInformation.objects.all()

#         # Filter based on provided attributes
#         if 'billing_id' in params:
#             bills = bills.filter(billing_id=params['billing_id'])
#         if 'driver_id' in params:
#             bills = bills.filter(driver_id=params['driver_id'])
#         if 'customer_id' in params:
#             bills = bills.filter(customer_id=params['customer_id'])
#         if 'start_date' in params and 'end_date' in params:
#             bills = bills.filter(date__range=[params['start_date'], params['end_date']])

#         serializer = BillingSerializer(bills, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

# # Bill detail view
# class BillDetailView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, billing_id):
#         if not isinstance(request.user, Administrator):
#             return Response({'error': 'Permission denied.'}, status=403)

#         bill = get_object_or_404(BillingInformation, billing_id=billing_id)
#         serializer = BillingSerializer(bill)
#         return Response(serializer.data, status=status.HTTP_200_OK)

# Driver list view
class DriverListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not isinstance(request.user, Administrator):
            return Response({'error': 'Permission denied.'}, status=403)

        drivers = Driver.objects.all()
        serializer = DriverSerializer(drivers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Customer list view
# class CustomerListView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         if not isinstance(request.user, Administrator):
#             return Response({'error': 'Permission denied.'}, status=403)

#         customers = Customer.objects.all()
#         serializer = CustomerSerializer(customers, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
