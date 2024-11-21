from rest_framework import serializers
from .models import Driver, Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'passenger', 'content', 'created_at']

class DriverSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Driver
        fields = '__all__'
        read_only_fields = ['rating', 'total_trips', 'document_verified', 'is_active']

    def create(self, validated_data):
        password = validated_data.pop('password')
        driver = Driver(**validated_data)
        driver.set_password(password)
        driver.save()
        return driver              