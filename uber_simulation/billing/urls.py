# billing/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.BillingViewSet.as_view({'post': 'create'}), name='billing-create'),
    path('delete/<str:pk>/', views.BillingViewSet.as_view({'delete': 'destroy'}), name='billing-delete'),
    path('search/', views.BillingViewSet.as_view({'get': 'search'}), name='billing-search'),
    path('get-bill/<int:ride_id>/', views.getBillInfo, name='get-bill')
]