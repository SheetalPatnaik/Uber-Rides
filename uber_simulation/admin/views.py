from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from driver.models import Driver
from users.models import Customer
from billing.models import BillingInformation
from driver.serializers import DriverSerializer
from users.serializers import BookingSerializer
from billing.serializers import BillingSerializer

def admin_login(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_superuser:  # Check if the user is a superuser
            login(request, user)
            return redirect('admin_dashboard')  # Redirect to admin dashboard
        else:
            messages.error(request, "Invalid credentials or not authorized!")
    return render(request, 'admin/login.html')


@login_required
def admin_dashboard(request):
    if not request.user.is_superuser:  # Restrict to superusers only
        messages.error(request, "You are not authorized to access this page.")
        return redirect('admin_login')
    return render(request, 'admin/dashboard.html')


class DriverListView(APIView):
    def get(self, request):
        drivers = Driver.objects.all()
        serializer = DriverSerializer(drivers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CustomerListView(APIView):
    def get(self, request):
        customers = Customer.objects.all()
        serializer = BookingSerializer(customers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReviewAccountView(APIView):
    def get(self, request):
        driver_id = request.query_params.get('driver_id')
        customer_id = request.query_params.get('customer_id')

        if driver_id:
            try:
                driver = Driver.objects.get(id=driver_id)
                serializer = DriverSerializer(driver)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Driver.DoesNotExist:
                return Response({"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND)

        if customer_id:
            try:
                customer = Customer.objects.get(customer_id=customer_id)
                serializer = BookingSerializer(customer)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Customer.DoesNotExist:
                return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"error": "Please provide a driver_id or customer_id"}, status=status.HTTP_400_BAD_REQUEST)


class BillSearchView(APIView):
    def get(self, request):
        params = request.query_params
        bills = BillingInformation.objects.all()

        # Filter based on provided attributes
        if 'driver_id' in params:
            bills = bills.filter(driver_id=params['driver_id'])
        if 'customer_id' in params:
            bills = bills.filter(customer_id=params['customer_id'])
        if 'start_date' in params and 'end_date' in params:
            bills = bills.filter(date__range=[params['start_date'], params['end_date']])

        serializer = BillingSerializer(bills, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



