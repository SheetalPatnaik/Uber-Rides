from django.urls import path
from . import views
from .views import BookRideView

urlpatterns = [
    path('register-customer/', views.register_customer, name='register_customer'),
    path('login/', views.login_customer, name='login_customer'),
    path('book-ride/', BookRideView.as_view(), name='book-ride'),
]
