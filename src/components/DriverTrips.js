import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDriverTrips } from '../services/api';

const DriverTrips = () => {
  const [trips, setTrips] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips, id]);

  const fetchTrips = async () => {
    try {
      const response = await getDriverTrips(id);
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching driver trips:', error);
    }
  };

  return (
    <div>
      <h2>Driver Trips</h2>
      <p>Total Trips: {trips.length}</p>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            Trip ID: {trip.id}, Date: {trip.date}, Distance: {trip.distance}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverTrips;