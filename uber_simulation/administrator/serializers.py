# administrator/serializers.py

from rest_framework import serializers
from .models import Administrator
from utils.validators import DataValidators

class AdministratorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    admin_id = serializers.CharField(validators=[DataValidators.validate_ssn])

    class Meta:
        model = Administrator
        fields = [
            'admin_id', 'email', 'password', 'first_name', 'last_name',
            'address', 'city', 'state', 'zip_code', 'phone_number'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'is_staff': {'read_only': True},
            'is_active': {'read_only': True},
            'is_superuser': {'read_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        admin_user = Administrator(**validated_data)
        admin_user.set_password(password)
        admin_user.save()
        return admin_user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
