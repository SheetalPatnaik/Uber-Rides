import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker } from '@react-google-maps/api';
import axios from 'axios';
import '../styles/BookRide.css';
import CustomerNavbar from './CustomerNavbar';
import { baseUrl } from '../services/api-services';

const BookRide = () => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [rideType, setRideType] = useState('XL');
  const [numPassengers, setNumPassengers] = useState(1);
  const [predictedFare, setPredictedFare] = useState(null);
  const [isProceedClicked, setIsProceedClicked] = useState(false);
  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  const googleMapsApiKey = ''; // Replace with your Google Maps API Key

  const handlePlaceSelect = (address, isPickup) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK') {
        const { lat, lng } = results[0].geometry.location;
        const location = { lat: lat(), lng: lng() };
        if (isPickup) {
          setPickupLocation(location);
        } else {
          setDropoffLocation(location);
        }
      }
    });
  };

  const handleRideTypeChange = (event) => {
    setRideType(event.target.value);
  };

  const handleNumPassengersChange = (event) => {
    setNumPassengers(Number(event.target.value));
  };

  const handleProceed = async (event) => {
    event.preventDefault();
    const customer_id = localStorage.getItem('customer_id');

    if (!customer_id) {
      alert('Please login first!');
      window.location.href = '/customer/login';
      return;
    }

    if (!pickupLocation || !dropoffLocation) {
      alert('Please select both pickup and dropoff locations!');
      return;
    }
    console.log("Creating booking data...");
    const bookingData = {
      pickupLocation: pickupAddress,
      dropoffLocation: dropoffAddress,
      pickupCoordinates: { lat: pickupLocation.lat, lng: pickupLocation.lng },
      dropoffCoordinates: { lat: dropoffLocation.lat, lng: dropoffLocation.lng },
      rideType,
      numPassengers,
      customer_id,
      date: new Date().toISOString().split('T')[0],
      hour: new Date().getHours(),
      weekday: new Date().getDay(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    };
    console.log("Booking data:", bookingData);
    try {
      const response = await axios.post(`${baseUrl}/api/create-ride/`, bookingData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
      });
      console.log('Booking response:', response.data);
      const fare = parseFloat(response.data.predicted_fare).toFixed(2);
      setPredictedFare(fare);
      setIsProceedClicked(true); // Enable the confirm button
    } catch (error) {
      console.error('Error during proceed:', error);
      alert(error.response.data.error);
    }
  };

  const handleConfirm = async () => {
    alert('Ride booking placed!'); // Placeholder for actual confirmation logic
    // Further logic for booking confirmation can go here
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['places']}>
      <CustomerNavbar />
      <div className="booking-container">
        <h2>Book Your Ride</h2>

        <form onSubmit={handleProceed}>
          <div className="input-container">
            <label htmlFor="pickup-location">Pickup Location</label>
            <Autocomplete
              onLoad={(autocomplete) => (pickupRef.current = autocomplete)}
              onPlaceChanged={() => {
                const place = pickupRef.current.getPlace();
                setPickupAddress(place.formatted_address);
                handlePlaceSelect(place.formatted_address, true);
              }}
            >
              <input
                id="pickup-location"
                type="text"
                placeholder="Enter pickup location"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="input-field"
              />
            </Autocomplete>
          </div>

          <div className="input-container">
            <label htmlFor="dropoff-location">Dropoff Location</label>
            <Autocomplete
              onLoad={(autocomplete) => (dropoffRef.current = autocomplete)}
              onPlaceChanged={() => {
                const place = dropoffRef.current.getPlace();
                setDropoffAddress(place.formatted_address);
                handlePlaceSelect(place.formatted_address, false);
              }}
            >
              <input
                id="dropoff-location"
                type="text"
                placeholder="Enter dropoff location"
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                className="input-field"
              />
            </Autocomplete>
          </div>

          <div className="input-container">
            <label htmlFor="ride-type">Ride Type</label>
            <select
              id="ride-type"
              value={rideType}
              onChange={handleRideTypeChange}
              className="input-field"
            >
              <option value="XL">XL (4 passengers)</option>
              <option value="XXL">XXL (6 passengers)</option>
            </select>
          </div>

          <div className="input-container">
            <label htmlFor="num-passengers">Number of Passengers</label>
            <select
              id="num-passengers"
              value={numPassengers}
              onChange={handleNumPassengersChange}
              className="input-field"
            >
              {[...Array(6).keys()].map((i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="map-container">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={{ lat: 37.7749, lng: -122.4194 }}
              zoom={12}
            >
              {pickupLocation && <Marker position={pickupLocation} />}
              {dropoffLocation && <Marker position={dropoffLocation} />}
            </GoogleMap>
          </div>

          <button type="submit" className="submit-btn">
            Proceed
          </button>
        </form>

        {predictedFare !== null && (
          <div className="predicted-fare-container">
            <h3>Predicted Fare: ${predictedFare}</h3>
            <button
              className="confirm-btn"
              onClick={handleConfirm}
              disabled={!isProceedClicked}
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default BookRide;