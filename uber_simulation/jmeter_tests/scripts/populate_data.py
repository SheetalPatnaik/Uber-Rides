# populate_data.py
from driver.models import Driver
import random
import string

def generate_random_string(length):
    return ''.join(random.choices(string.ascii_letters, k=length))

def populate_drivers(count=10000):
    drivers = []
    for i in range(count):
        driver = Driver(
            email=f"driver{i}@test.com",
            phone_number=f"{random.randint(100,999)}-{random.randint(10,99)}-{random.randint(1000,9999)}",
            first_name=generate_random_string(6),
            last_name=generate_random_string(8),
            address=f"{random.randint(100,999)} Test St",
            city="TestCity",
            state="CA",
            zipcode=f"{random.randint(10000,99999)}",
            vehicle_type="sedan",
            rating=random.uniform(3.0, 5.0)
        )
        drivers.append(driver)
    
    Driver.objects.bulk_create(drivers)

if __name__ == "__main__":
    populate_drivers()