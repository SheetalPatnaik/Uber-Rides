# administrator/urls.py

from django.urls import path
from .views import (
    admin_login, admin_dashboard, add_driver, add_customer,
    DriverListView, CustomerListView, ReviewAccountView, BillSearchView,
    statistics_view, graphs_data_view, BillDetailView
)

urlpatterns = [
    path('login/', admin_login, name='admin_login'),
    path('dashboard/', admin_dashboard, name='admin_dashboard'),
    # path('add-driver/', add_driver, name='add_driver'),
    # path('add-customer/', add_customer, name='add_customer'),
    # path('drivers/', DriverListView.as_view(), name='view_drivers'),
    # path('customers/', CustomerListView.as_view(), name='view_customers'),
    # path('review-account/', ReviewAccountView.as_view(), name='review_account'),
    # path('statistics/', statistics_view, name='statistics'),
    # path('graphs-data/', graphs_data_view, name='graphs_data'),
    # path('search-bill/', BillSearchView.as_view(), name='search_bill'),
    # path('bill/<str:billing_id>/', BillDetailView.as_view(), name='bill_detail'),
]
