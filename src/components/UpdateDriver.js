import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDriver, updateDriver } from '../services/api';

const UpdateDriver = () => {
  const [driverData, setDriverData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const { id } = useParams();

  useEffect(() => {
    fetchDriver();
  }, [fetchDriver, id]);
  
  const fetchDriver = async () => {
    try {
      const response = await getDriver(id);
      setDriverData(response.data);
    } catch (error) {
      console.error('Error fetching driver:', error);
    }
  };

  const handleChange = (e) => {
    setDriverData({ ...driverData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDriver(id, driverData);
      // Redirect to driver details after update
      window.location.href = `/driver/${id}`;
    } catch (error) {
      console.error('Error updating driver:', error);
    }
  };

  return (
    <div>
      <h2>Update Driver</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={driverData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={driverData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="tel"
          name="phone"
          value={driverData.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        <button type="submit">Update Driver</button>
      </form>
    </div>
  );
};

export default UpdateDriver;