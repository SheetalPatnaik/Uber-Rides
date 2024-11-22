import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTopRatedDrivers } from '../services/api';

const TopRatedDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchTopRatedDrivers();
  }, []);

  const fetchTopRatedDrivers = async () => {
    try {
      const response = await getTopRatedDrivers();
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching top-rated drivers:', error);
    }
  };

  return (
    <div>
      <h2>Top Rated Drivers</h2>
      <ul>
        {drivers.map((driver) => (
          <li key={driver.id}>
            <Link to={`/driver/${driver.id}`}>{driver.name}</Link> - Rating: {driver.rating}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopRatedDrivers;