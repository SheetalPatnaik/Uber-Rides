from django.urls import re_path
from .consumers import DriverConsumerWebSocket, CustomerConsumerWebSocket

websocket_urlpatterns = [
    re_path(r'ws/driver/(?P<token>.+)/$', DriverConsumerWebSocket.as_asgi()),
    re_path(r'ws/customer/(?P<token>.+)/$', CustomerConsumerWebSocket.as_asgi()),
]