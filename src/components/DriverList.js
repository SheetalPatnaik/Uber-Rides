import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDrivers } from '../services/api';

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await getDrivers();
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  return (
    <div>
      <h2>Driver List</h2>
      <Link to="/create">Create New Driver</Link>
      <ul>
        {drivers.map((driver) => (
          <li key={driver.id}>
            <Link to={`/driver/${driver.id}`}>{driver.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverList;