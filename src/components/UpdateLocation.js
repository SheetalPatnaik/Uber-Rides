import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { updateDriverLocation } from '../services/api';

const UpdateLocation = () => {
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const { id } = useParams();

  const handleChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDriverLocation(id, location);
      // Redirect to driver details after update
      window.location.href = `/driver/${id}`;
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  };

  return (
    <div>
      <h2>Update Driver Location</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="latitude"
          value={location.latitude}
          onChange={handleChange}
          placeholder="Latitude"
          required
        />
        <input
          type="number"
          name="longitude"
          value={location.longitude}
          onChange={handleChange}
          placeholder="Longitude"
          required
        />
        <button type="submit">Update Location</button>
      </form>
    </div>
  );
};

export default UpdateLocation;