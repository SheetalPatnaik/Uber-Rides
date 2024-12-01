from django.urls import path
from .views import admin_login, admin_dashboard
from .views import DriverListView, CustomerListView, ReviewAccountView, BillSearchView

urlpatterns = [
    path('login/', admin_login, name='admin_login'),
    path('dashboard/', admin_dashboard, name='admin_dashboard'),
    path('drivers/', DriverListView.as_view(), name='view_drivers'),
    path('customers/', CustomerListView.as_view(), name='view_customers'),
    path('review-account/', ReviewAccountView.as_view(), name='review_account'),
    path('search-bill/', BillSearchView.as_view(), name='search_bill'),
]
