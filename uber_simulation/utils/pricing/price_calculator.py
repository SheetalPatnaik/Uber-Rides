# billing/services/price_calculator.py
from decimal import Decimal
import joblib
from django.conf import settings
import numpy as np

class PriceCalculator:
    def __init__(self):
        self.BASE_FARE = getattr(settings, 'BASE_FARE', Decimal('2.50'))
        self.model = joblib.load('uber_price_model.pkl')
        
    def calculate_ml_price(self, pickup_lat, pickup_long, 
                          dropoff_lat, dropoff_long, 
                          passenger_count, distance):
        # Prepare features for prediction
        features = np.array([[
            pickup_lat, pickup_long,
            dropoff_lat, dropoff_long,
            passenger_count, distance
        ]])
        
        # Get ML prediction
        predicted_price = self.model.predict(features)[0]
        
        # Apply business rules
        final_price = max(predicted_price, float(self.BASE_FARE))
        return round(Decimal(str(final_price)), 2)
    
    def calculate_fallback_price(self, distance, duration_minutes, is_surge=False):
        # Original calculation logic as fallback
        price = self.BASE_FARE + (distance * Decimal('1.50'))
        return round(price, 2)
    
    def calculate_price(self, **kwargs):
        try:
            return self.calculate_ml_price(**kwargs)
        except Exception:
            # Fallback to traditional calculation if ML fails
            return self.calculate_fallback_price(
                kwargs.get('distance', 0),
                kwargs.get('duration_minutes', 0)
            )