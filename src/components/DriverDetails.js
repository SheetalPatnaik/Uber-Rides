import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDriver, deleteDriver } from '../services/api';

const DriverDetails = () => {
  const [driver, setDriver] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchDriver();
  }, [fetchDriver, id]);
  
  const fetchDriver = async () => {
    try {
      const response = await getDriver(id);
      setDriver(response.data);
    } catch (error) {
      console.error('Error fetching driver:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDriver(id);
      // Redirect to driver list after deletion
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };

  if (!driver) return <div>Loading...</div>;

  return (
    <div>
      <h2>Driver Details</h2>
      <p>Name: {driver.name}</p>
      <p>Email: {driver.email}</p>
      <p>Status: {driver.status}</p>
      <Link to={`/update/${id}`}>Update Driver</Link>
      <button onClick={handleDelete}>Delete Driver</button>
      <Link to={`/update-location/${id}`}>Update Location</Link>
      <Link to={`/update-status/${id}`}>Update Status</Link>
      <Link to={`/trips/${id}`}>View Trips</Link>
    </div>
  );
};

export default DriverDetails;