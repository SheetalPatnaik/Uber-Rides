from rest_framework import serializers
from .models import Administrator


class AdministratorSerializer(serializers.ModelSerializer):
   admin_id = serializers.CharField(required=True)  # Add this field
  
   class Meta:
       model = Administrator
       fields = ['admin_id', 'email', 'password', 'first_name', 'last_name',
                'phone_number', 'address', 'city', 'state', 'zipcode',
                'profile_image']
       extra_kwargs = {
           'password': {'write_only': True},
           'phone_number': {'required': False},
           'address': {'required': False},
           'city': {'required': False},
           'state': {'required': False},
           'zipcode': {'required': False},
           'profile_image': {'required': False},
       }


   def validate_admin_id(self, value):
       # Format admin_id as XXX-XX-XXXX
       digits = ''.join(filter(str.isdigit, value))
       if len(digits) != 9:
           raise serializers.ValidationError("Admin ID must be 9 digits")
       return f"{digits[:3]}-{digits[3:5]}-{digits[5:]}"


   def create(self, validated_data):
       password = validated_data.pop('password')
       admin_id = validated_data.pop('admin_id')  # Get the formatted admin_id
      
       instance = Administrator.objects.create_user(
           email=validated_data.pop('email'),
           password=password,
           admin_id=admin_id,  # Pass the formatted admin_id
           **validated_data
       )
       return instance


class AdministratorProfileSerializer(serializers.ModelSerializer):
   admin_id = serializers.CharField(read_only=True)
   profile_image = serializers.ImageField(required=False)


   class Meta:
       model = Administrator
       fields = [
           'id', 'email', 'first_name', 'last_name', 'phone_number',
           'address', 'city', 'state', 'zipcode', 'admin_id', 'profile_image'
       ]
       read_only_fields = ['email', 'admin_id']


   def to_representation(self, instance):
       # Format admin_id in the response
       data = super().to_representation(instance)
       if 'admin_id' in data and data['admin_id']:
           digits = ''.join(filter(str.isdigit, data['admin_id']))
           data['admin_id'] = f"{digits[:3]}-{digits[3:5]}-{digits[5:]}"
       return data