from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import BillingInformation
from .serializers import BillingSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from datetime import datetime
from ml_model.predictor import preprocess_and_predict  # New import
from rest_framework.decorators import action

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
            
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def retrieve(self, request, pk=None):
        billing = get_object_or_404(BillingInformation, billing_id=pk)
        serializer = self.serializer_class(billing)
        return Response(serializer.data)