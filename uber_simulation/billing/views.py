from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import BillingInformation
from .serializers import BillingSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from utils.pricing.price_calculator import PriceCalculator

# Create your views here.

class BillingViewSet(viewsets.ModelViewSet):
    queryset = BillingInformation.objects.all()
    serializer_class = BillingSerializer
    
    def create(self, request):
        # Calculate price first
        calculator = PriceCalculator()
        try:
            calculated_price = calculator.calculate_price(
                pickup_lat=request.data.get('pickup_lat'),
                pickup_long=request.data.get('pickup_long'),
                dropoff_lat=request.data.get('dropoff_lat'),
                dropoff_long=request.data.get('dropoff_long'),
                passenger_count=request.data.get('passenger_count'),
                distance=request.data.get('distance')
            )
            
            # Add calculated price to request data
            request_data = request.data.copy()
            request_data['total_amount'] = calculated_price
            
            # Validate and save with serializer
            serializer = self.serializer_class(data=request_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {'error': 'Price calculation failed', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def destroy(self, request, pk=None):
        try:
            billing = get_object_or_404(BillingInformation, billing_id=pk)
            billing.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
            {'error': 'Delete operation failed', 'details': str(e)},
            status=status.HTTP_400_BAD_REQUEST
            )
    
    def search(self, request):
        params = request.query_params
        queryset = self.queryset
        
        # Date range search
        if 'start_date' in params:
            queryset = queryset.filter(date__gte=params['start_date'])
        if 'end_date' in params:
            queryset = queryset.filter(date__lte=params['end_date'])
        if 'date' in params:
            queryset = queryset.filter(date=params['date'])
        # ID searches
        if 'driver_id' in params:
            queryset = queryset.filter(driver_id=params['driver_id'])
        if 'customer_id' in params:
            queryset = queryset.filter(customer_id=params['customer_id'])
        if 'billing_id' in params:
            queryset = queryset.filter(billing_id=params['billing_id'])
            
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)