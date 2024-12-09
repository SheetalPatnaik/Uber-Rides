from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.exceptions import ValidationError
from .models import Administrator
from .serializers import AdministratorSerializer, AdministratorProfileSerializer


class AdministratorViewSet(viewsets.ViewSet):
   parser_classes = (MultiPartParser, FormParser)


   def format_ssn(self, ssn):
       # Remove any non-digits
       digits = ''.join(filter(str.isdigit, ssn))
       # Format as XXX-XX-XXXX
       return f"{digits[:3]}-{digits[3:5]}-{digits[5:]}"


   @action(detail=False, methods=['post'], permission_classes=[AllowAny])
   def register(self, request):
       try:
           print("Received data:", request.data)
           print("Received files:", request.FILES)
          
           # Create a mutable copy of the data
           mutable_data = request.data.copy()
          
           # Format the admin_id if present
           if 'admin_id' in mutable_data:
               mutable_data['admin_id'] = self.format_ssn(mutable_data['admin_id'])
          
           # Handle profile image
           if 'profile_image' in request.FILES:
               mutable_data['profile_image'] = request.FILES['profile_image']
          
           serializer = AdministratorSerializer(data=mutable_data)
           if serializer.is_valid():
               admin = serializer.save()
              
               # Build response data
               response_data = {
                   'message': 'Administrator registered successfully',
                   'admin_id': admin.admin_id,
               }
              
               # Add profile image URL to response if it exists
               if admin.profile_image:
                   response_data['profile_image'] = request.build_absolute_uri(
                       admin.profile_image.url
                   )
              
               return Response(response_data, status=status.HTTP_201_CREATED)
          
           print("Serializer errors:", serializer.errors)
           return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
          
       except ValidationError as e:
           print("Validation error:", str(e))
           return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
       except Exception as e:
           print("Unexpected error:", str(e))
           return Response(
               {'error': 'An unexpected error occurred'},
               status=status.HTTP_500_INTERNAL_SERVER_ERROR
           )


   @action(detail=False, methods=['post'], permission_classes=[AllowAny])
   def login(self, request):
       email = request.data.get('email')
       password = request.data.get('password')
       user = authenticate(email=email, password=password)


       if user and isinstance(user, Administrator):
           refresh = RefreshToken.for_user(user)
           profile_image_url = None
           if user.profile_image:
               profile_image_url = request.build_absolute_uri(user.profile_image.url)
          
           return Response({
               'access_token': str(refresh.access_token),
               'refresh_token': str(refresh),
               'user_id': user.id,
               'email': user.email,
               'name': f"{user.first_name} {user.last_name}",
               'admin_id': self.format_ssn(user.admin_id),  # Format the admin_id
               'profile_image': profile_image_url
           }, status=status.HTTP_200_OK)


       return Response({'error': 'Invalid credentials or not an administrator'},
                     status=status.HTTP_401_UNAUTHORIZED)


   @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
   def profile(self, request):
       if not isinstance(request.user, Administrator):
           return Response({'error': 'Not an administrator'},
                         status=status.HTTP_403_FORBIDDEN)


       serializer = AdministratorProfileSerializer(request.user)
       data = serializer.data
       # Format the admin_id in the response
       if 'admin_id' in data:
           data['admin_id'] = self.format_ssn(data['admin_id'])
          
       if request.user.profile_image:
           data['profile_image'] = request.build_absolute_uri(request.user.profile_image.url)
       return Response(data, status=status.HTTP_200_OK)


   @action(detail=False, methods=['put'], permission_classes=[IsAuthenticated])
   def update_profile(self, request):
       if not isinstance(request.user, Administrator):
           return Response({'error': 'Not an administrator'},
                         status=status.HTTP_403_FORBIDDEN)


       # Create a mutable copy of the data
       data = request.data.copy()
       if 'admin_id' in data:
           data['admin_id'] = self.format_ssn(data['admin_id'])


       serializer = AdministratorProfileSerializer(
           request.user,
           data=data,
           partial=True
       )
      
       if serializer.is_valid():
           try:
               # Handle profile image separately if it exists in request.FILES
               if 'profile_image' in request.FILES:
                   request.user.profile_image = request.FILES['profile_image']
              
               serializer.save()
               response_data = serializer.data
               if 'admin_id' in response_data:
                   response_data['admin_id'] = self.format_ssn(response_data['admin_id'])
                  
               if request.user.profile_image:
                   response_data['profile_image'] = request.build_absolute_uri(
                       request.user.profile_image.url
                   )
               return Response(response_data, status=status.HTTP_200_OK)
           except ValidationError as e:
               return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)