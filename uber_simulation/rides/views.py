from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Ride
from .serializers import RideSerializer
from ml_model.predictor import preprocess_and_predict
from datetime import datetime
from django.db.models import Avg
# Create your views here.
# rides/views.py

class RideViewSet(viewsets.ModelViewSet):
    queryset = Ride.objects.all()
    serializer_class = RideSerializer

    def create(self, request):
        try:
            # Calculate predicted fare
            input_data = {
                "pickup_latitude": request.data.get('pickup_location_lat'),
                "pickup_longitude": request.data.get('pickup_location_lng'),
                "dropoff_latitude": request.data.get('dropoff_location_lat'),
                "dropoff_longitude": request.data.get('dropoff_location_lng'),
                "passenger_count": request.data.get('passenger_count'),
                "hour": datetime.now().hour,
                "weekday": datetime.now().weekday(),
                "date": datetime.now().day,
                "month": datetime.now().month,
                "year": datetime.now().year
            }
            
            predicted_fare = preprocess_and_predict(input_data)
            request.data['predicted_fare'] = predicted_fare
            
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False)
    def customer_rides(self, request):
        customer_id = request.query_params.get('customer_id')
        rides = self.queryset.filter(customer_id=customer_id)
        serializer = self.get_serializer(rides, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def driver_rides(self, request):
        driver_id = request.query_params.get('driver_id')
        rides = self.queryset.filter(driver_id=driver_id)
        serializer = self.get_serializer(rides, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def location_statistics(self, request):
        location = request.query_params.get('location')
        rides = self.queryset.filter(
            pickup_location_lat__range=(location['lat'] - 0.1, location['lat'] + 0.1),
            pickup_location_lng__range=(location['lng'] - 0.1, location['lng'] + 0.1)
        )
        return Response({
            'total_rides': rides.count(),
            'average_fare': rides.aggregate(Avg('predicted_fare'))
        })