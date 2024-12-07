from django.db import connection

def filterDrivers(pickup_lat, pickup_lng):
    # Define the query with the Haversine formula
        query = """
            select 
                driver.driver_id,
                driver.first_name,
                driver.last_name, 
                driver.address,
                driver.current_location_lat, 
                driver.current_location_lng, 
                ( 6371 * acos(
                    cos(radians(%s)) * cos(radians(driver.current_location_lat)) *
                    cos(radians(driver.current_location_lng) - radians(%s)) +
                    sin(radians(%s)) * sin(radians(driver.current_location_lat))
                )) AS distance
            FROM driver_driver driver
            left join users_booking ride on ride.driver_id=driver.id and ride.status in ('accepted', 'picked')
            where ride.booking_id is null
            HAVING distance <= 16.0934 -- 10 miles in kilometers
            ORDER BY distance;
        """

        # Execute the query
        with connection.cursor() as cursor:
            cursor.execute(query, [pickup_lat, pickup_lng, pickup_lat])
            results = cursor.fetchall()

        # Format the response
        drivers = [
            {
                "driver_id":row[0],
                "first_name": row[1],
                "last_name": row[2],
                "address": row[3],
                "lat": row[4],
                "lng": row[5],
                "distance": row[6]
            }
            for row in results
        ]

        return drivers

def getRideRequest(driver_lat, driver_lng):
    # Define the query with the Haversine formula
        query = """
            select 
                booking_id, 
                ( 6371 * acos(
                    cos(radians(%s)) * cos(radians(pickup_latitude)) *
                    cos(radians(pickup_longitude) - radians(%s)) +
                    sin(radians(%s)) * sin(radians(pickup_latitude))
                )) AS distance
            FROM users_booking ride
            where ride.status='pending'
            HAVING distance <= 16.0934 -- 10 miles in kilometers
            ORDER BY distance;
        """

        # Execute the query
        with connection.cursor() as cursor:
            cursor.execute(query, [driver_lat, driver_lng, driver_lat])
            results = cursor.fetchall()

        # Format the response
        rides = [
            row[0]
            for row in results
        ]

        return rides
