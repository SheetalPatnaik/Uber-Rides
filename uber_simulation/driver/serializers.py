# from rest_framework import serializers
# from .models import Driver, Review

# class ReviewSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Review
#         fields = ['id', 'passenger', 'content', 'created_at']

# class DriverSerializer(serializers.ModelSerializer):
#     reviews = ReviewSerializer(many=True, read_only=True)
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = Driver
#         fields = '__all__'
#         read_only_fields = ['rating', 'total_trips', 'document_verified', 'is_active']

#     def create(self, validated_data):
#         password = validated_data.pop('password')
#         driver = Driver(**validated_data)
#         driver.set_password(password)
#         driver.save()
#         return driver              
from rest_framework import serializers
from .models import Driver
from users.models import Review

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
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone_number': {'required': True}
        }

    def validate_driver_id(self, value):
        if Driver.objects.exclude(id=self.initial_data.get('id')).filter(driver_id=value).exists():
            raise serializers.ValidationError("Driver ID already exists")
        return value

    def validate_email(self, value): 
        print(self.initial_data)
        if Driver.objects.exclude(id=self.initial_data.get('id')).filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_phone_number(self, value):
        if Driver.objects.exclude(id=self.initial_data.get('id')).filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number already exists")
        return value

    def create(self, validated_data):
        groups = validated_data.pop('groups', None)
        permissions = validated_data.pop('user_permissions', None)
        password = validated_data.pop('password')

        driver = Driver(**validated_data)
        driver.set_password(password)
        driver.save()

        if groups is not None:
            driver.groups.set(groups)
        if permissions is not None:
            driver.user_permissions.set(permissions)

        return driver

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        
        groups = validated_data.pop('groups', None)
        permissions = validated_data.pop('user_permissions', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()

        if groups is not None:
            instance.groups.set(groups)
        if permissions is not None:
            instance.user_permissions.set(permissions)

        return instance