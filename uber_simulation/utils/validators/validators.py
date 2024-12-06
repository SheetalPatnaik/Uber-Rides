# validators.py
from django.core.exceptions import ValidationError
import re

class DataValidators:
    @staticmethod
    def validate_ssn(value):
        pattern = r'^\d{3}-\d{2}-\d{4}$'
        print(value)
        if not re.match(pattern, value):
            raise ValidationError('Invalid SSN format. Must be XXX-XX-XXXX')

    @staticmethod
    def validate_zipcode(value):
        pattern = r'^\d{5}(-\d{4})?$'
        if not re.match(pattern, value):
            raise ValidationError('Invalid ZIP code format')

    @staticmethod
    def validate_state(value):
        valid_states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']  # Complete list of US states
        if value.upper() not in valid_states:
            raise ValidationError('Invalid state abbreviation')