import joblib
import pandas as pd

# Load the model, encoders, and scalers
xgb_model = joblib.load('ml_model/xgb_model.pkl')
encoders = joblib.load('ml_model/encoders.pkl')
scalers = joblib.load('ml_model/scalers.pkl')


from math import radians, sin, cos, asin, sqrt

# function to calculate the travel distance from the longitudes and latitudes
def distance_transform(longitude1, latitude1, longitude2, latitude2):
    travel_dist = []
    
    for pos in range(len(longitude1)):
        long1,lati1,long2,lati2 = map(radians,[longitude1[pos],latitude1[pos],longitude2[pos],latitude2[pos]])
        dist_long = long2 - long1
        dist_lati = lati2 - lati1
        a = sin(dist_lati/2)**2 + cos(lati1) * cos(lati2) * sin(dist_long/2)**2
        c = 2 * asin(sqrt(a))*6371
        travel_dist.append(c)
       
    return travel_dist


import subprocess
import sys

try:
    import utm
except ImportError:
    print("utm module not found. Installing...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "utm"])
    print('utm module installed successfully.')

import utm

# Function to convert lat/lon to UTM coordinates
def convert_to_utm(lat, lon):
    u = utm.from_latlon(lat, lon)
    return u[0], u[1]

# Function to assign a box based on UTM coordinates and box size
def assign_box(lat, lon, box_size, mapping_dict):
    utm_x, utm_y = convert_to_utm(lat, lon)
    box_x = int(utm_x // box_size)
    box_y = int(utm_y // box_size)
    box_id = box_x * 1e6 + box_y
    mapping_dict[(lat, lon)] = box_id
    return box_id


# Function to categorize hours
def categorize_hour(hour):
    if 0 <= hour <= 5:
        return 'Early Morning'
    elif 6 <= hour <= 11:
        return 'Morning'
    elif 12 <= hour <= 15:
        return 'Afternoon'
    elif 16 <= hour <= 21:
        return 'Evening'
    elif 22 <= hour <= 23:
        return 'Late Night'

# Function to categorize days of the month
def categorize_date(date):
    if 0 <= date <= 10:
        return 'Early'
    elif 11 <= date <= 20:
        return 'Middle'
    elif 21 <= date <= 31:
        return 'End'
    


# function to categorize month of the year
def categorize_month(month):
    if 1 <= month <= 3:
        return 1
    elif 4 <= month <= 6:
        return 2
    elif 7 <= month <= 9:
        return 3
    elif 10 <= month <= 12:
        return 4




# Define preprocessing and prediction function
def preprocess_and_predict(input_data):
    print("Inside preprocess_and_predict")
    # Convert input data to DataFrame
    df = pd.DataFrame([input_data])
    print("dataframe is",df)
    # Preprocessing
    df['distance'] = distance_transform(
        df['pickup_longitude'], 
        df['pickup_latitude'], 
        df['dropoff_longitude'], 
        df['dropoff_latitude']
    )
    print("Distance is",df['distance'])
    df['pickup'] = df.apply(lambda row: assign_box(row['pickup_latitude'], row['pickup_longitude'], 500, {}), axis=1)
    df['dropoff'] = df.apply(lambda row: assign_box(row['dropoff_latitude'], row['dropoff_longitude'], 500, {}), axis=1)
    print("After assign_box:", df[['pickup', 'dropoff']])
    df['time'] = df['hour'].apply(categorize_hour)
    print("After categorize_hour:", df['time']) 
    # df['weekend'] = 1 if df['weekday'] in [4, 5, 6] else 0
    df['weekend'] = df['weekday'].apply(lambda x: 1 if x in [4, 5, 6] else 0)
    print(" weekend:", df['weekend'])
    df['tri_monthly'] = df['date'].apply(categorize_date)
    print("tri_monthly:", df['tri_monthly'])
    df['year_quater'] = df['month'].apply(categorize_month)
    print("year_quater:", df['year_quater'])
    
   
    # Encode categorical data
    for col, encoder in encoders.items():
        if col in df.columns:
            # Handle unseen labels for specific columns like 'year', 'passenger_count', 'pickup', and 'dropoff'
            if col in ['year', 'passenger_count', 'pickup', 'dropoff']:
                df[col] = df[col].apply(lambda x: encoder.transform([x])[0] if x in encoder.classes_ else len(encoder.classes_))
            else:
                df[col] = df[col].apply(lambda x: encoder.transform([x])[0] if x in encoder.classes_ else None)

    # Scale numerical data
    for col, scaler in scalers.items():
        if col in df.columns:  # Ensure the column is in the DataFrame before applying scaling
            df[col] = scaler.transform(df[[col]])

    # Drop unnecessary columns and select the relevant features for prediction
    features = ['year', 'passenger_count', 'pickup', 'dropoff', 'time', 'weekend', 'year_quater', 'tri_monthly', 'distance']
    X = df[features]

    # Predict the fare using the trained model
    predicted_fare = xgb_model.predict(X)[0]
    return round(predicted_fare, 2)
