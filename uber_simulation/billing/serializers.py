from rest_framework import serializers
from .models import BillingInformation

class BillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingInformation
        fields = '__all__'
        
    def validate(self, data):
        if data['pickup_time'] >= data['drop_off_time']:
            raise serializers.ValidationError("Pickup time must be before drop-off time")
        if data['total_amount'] <= 0:
            raise serializers.ValidationError("Total amount must be greater than zero")
        if data['distance_covered'] <= 0:
            raise serializers.ValidationError("Distance covered must be greater than zero")
        return data