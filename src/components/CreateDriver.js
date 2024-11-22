import React, { useState } from 'react';
import { createDriver } from '../services/api';

const CreateDriver = () => {
  const [driverData, setDriverData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    setDriverData({ ...driverData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDriver(driverData);
      // Redirect to driver list after creation
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating driver:', error);
    }
  };

  return (
    <div>
      <h2>Create New Driver</h2>
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
        <button type="submit">Create Driver</button>
      </form>
    </div>
  );
};

export default CreateDriver;