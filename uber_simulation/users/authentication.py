# users/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import get_authorization_header
from django.conf import settings
from .models import Customer

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token['customer_id']
            user = Customer.objects.get(customer_id=user_id)
            return user
        except Customer.DoesNotExist:
            return None
        except KeyError:
            return None

    def authenticate(self, request):
        print("Starting authentication...")
        
        header = get_authorization_header(request).decode('utf-8').strip()
        print(f"Raw Authorization header: {header}")
        
        if not header:
            print("No authorization header found")
            return None
            
        try:
            parts = header.split()
            print(f"Header parts: {parts}")
            
            if len(parts) != 2 or parts[0].lower() != 'bearer':
                print(f"Invalid header format: {parts}")
                return None
                
            token = parts[1]
            print(f"Attempting to validate token: {token[:10]}...")
            
            validated_token = self.get_validated_token(token)
            print("Token validated successfully")
            
            user = self.get_user(validated_token)
            if user is None:
                print("User not found")
                return None
                
            print(f"User authenticated: {user.customer_id}")
            return (user, validated_token)
            
        except Exception as e:
            print(f"Authentication failed: {str(e)}")
            return None