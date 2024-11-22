import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { updateDriverStatus } from '../services/api';

const UpdateStatus = () => {
  const [status, setStatus] = useState('');
  const { id } = useParams();

  const handleChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDriverStatus(id, { status });
      // Redirect to driver details after update
      window.location.href = `/driver/${id}`;
    } catch (error) {
      console.error('Error updating driver status:', error);
    }
  };

  return (
    <div>
      <h2>Update Driver Status</h2>
      <form onSubmit={handleSubmit}>
        <select name="status" value={status} onChange={handleChange} required>
          <option value="">Select Status</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>
        <button type="submit">Update Status</button>
      </form>
    </div>
  );
};

export default UpdateStatus;