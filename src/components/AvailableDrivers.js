import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAvailableDrivers } from '../services/api';

const AvailableDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchAvailableDrivers();
  }, []);

  const fetchAvailableDrivers = async () => {
    try {
      const response = await getAvailableDrivers();
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching available drivers:', error);
    }
  };

  return (
    <div>
      <h2>Available Drivers</h2>
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

export default AvailableDrivers;