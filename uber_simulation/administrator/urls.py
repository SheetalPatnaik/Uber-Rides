from django.urls import path
from .views import AdministratorViewSet


urlpatterns = [
   path('register/', AdministratorViewSet.as_view({'post': 'register'}), name='admin-register'),
   path('login/', AdministratorViewSet.as_view({'post': 'login'}), name='admin-login'),
   path('profile/', AdministratorViewSet.as_view({'get': 'profile', 'put': 'update_profile'}), name='admin-profile'),
   path('manage-drivers/', AdministratorViewSet.as_view({'get': 'manage_drivers'}), name='admin-manage-drivers'),
   path('manage-customers/', AdministratorViewSet.as_view({'get': 'manage_customers'}), name='admin-manage-customers'),
   path('manage-billing/', AdministratorViewSet.as_view({'get': 'manage_billing'}), name='admin-manage-billing'),
]
