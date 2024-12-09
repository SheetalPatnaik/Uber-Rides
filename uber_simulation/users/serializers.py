from rest_framework import serializers
from .models import Booking, Customer  # Add Customer import here

class BookingSerializer(serializers.ModelSerializer):
    pickupLocation = serializers.CharField(source='pickup_location')
    dropoffLocation = serializers.CharField(source='dropoff_location')
    pickupCoordinates = serializers.DictField(write_only=True)
    dropoffCoordinates = serializers.DictField(write_only=True)
    rideType = serializers.CharField(source='ride_type')
    numPassengers = serializers.IntegerField(source='num_passengers')
    customerId = serializers.CharField(write_only=True, source='customer_id')
    predictedFare = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, source='predicted_fare')


    class Meta:
        model = Booking
        fields = [
            'pickupLocation',
            'dropoffLocation',
            'pickupCoordinates',
            'dropoffCoordinates',
            'rideType',
            'numPassengers',
            'customerId',
            'predictedFare',
            'status'
        ]
        read_only_fields = ['status']

    def create(self, validated_data):
        pickup_coords = validated_data.pop('pickupCoordinates')
        dropoff_coords = validated_data.pop('dropoffCoordinates')
        
        
        customer_id = validated_data.pop('customer_id')

        if 'status' not in validated_data:
            validated_data['status'] = 'pending'

        # Ensure customer exists with the given SSN (customer_id)
        try:
            customer = Customer.objects.get(customer_id=customer_id)
        except Customer.DoesNotExist:
            raise serializers.ValidationError("Customer with the provided SSN not found")

        # Extract predicted fare if available
        predicted_fare = validated_data.pop('predicted_fare', None)   # Handle the predicted fare
        
        booking = Booking.objects.create(
            # customer_id=validated_data.get('customer_id'),  # Use the customer instance, not the SSN
            customer=customer,
            pickup_location=validated_data.get('pickup_location'),
            pickup_latitude=pickup_coords['lat'],
            pickup_longitude=pickup_coords['lng'],
            dropoff_location=validated_data.get('dropoff_location'),
            dropoff_latitude=dropoff_coords['lat'],
            dropoff_longitude=dropoff_coords['lng'],
            ride_type=validated_data.get('ride_type'),
            num_passengers=validated_data.get('num_passengers'),
            predicted_fare=predicted_fare
        )
        return booking
    
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'first_name', 'last_name', 'address', 'city', 'state', 'zip_code', 
            'phone_number', 'email', 'credit_card', 'profile_photo'
        ]

    def validate_email(self, value):
        """
        Custom validation for email to ensure it's unique.
        """
        if Customer.objects.filter(email=value).exclude(customer_id=self.instance.customer_id).exists():
            raise serializers.ValidationError("Email is already in use by another customer.")
        return value

    def validate_phone_number(self, value):
        """
        Custom validation for phone number to ensure it's unique.
        """
        if Customer.objects.filter(phone_number=value).exclude(customer_id=self.instance.customer_id).exists():
            raise serializers.ValidationError("Phone number is already in use by another customer.")
        return value