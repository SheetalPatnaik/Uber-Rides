from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.db.models import Sum, Count
from billing.models import BillingInformation
from rides.models import Ride


def revenue_per_day(request):
   data = BillingInformation.objects.values('date').annotate(revenue=Sum('total_amount')).order_by('date')
   return JsonResponse(list(data), safe=False)


def rides_per_area(request):
   data = Ride.objects.values('source_location').annotate(rides=Count('ride_id')).order_by('source_location')
   return JsonResponse(list(data), safe=False)


def rides_per_driver(request):
   data = Ride.objects.values('driver__first_name', 'driver__last_name').annotate(rides=Count('ride_id')).order_by('driver__first_name')
   return JsonResponse(list(data), safe=False)


def rides_per_customer(request):
   data = Ride.objects.values('customer__first_name', 'customer__last_name').annotate(rides=Count('ride_id')).order_by('customer__first_name')
   return JsonResponse(list(data), safe=False)