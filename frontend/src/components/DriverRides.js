import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import '../styles/DriverRides.css';
import DriverWebSocket from './DriverWebSocket';

const DriverRides = () => {
  const [currentRides, setCurrentRides] = useState([]);
  const [previousRides, setPreviousRides] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRideRequests();
    fetchRides();
  }, []);

  const fetchRideRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/driver/ride-requests/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setCurrentRides(response.data);
    } catch (err) {
      setError('Failed to fetch ride requests');
      console.error('Error fetching ride requests:', err);
    }
  };

  const fetchRides = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/driver/rides/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setPreviousRides(response.data);
    } catch (err) {
      setError('Failed to fetch rides history');
      console.error('Error fetching rides:', err);
    }
  };

  const handleRideAction = async (rideId, action) => {
    if (action === 'accepted') {
      try {
        await axios.post(`http://localhost:8000/api/driver/accept-ride/${rideId}`, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        fetchRideRequests(); // Refresh the rides lists
        fetchRides();
      } catch (err) {
        setError('Failed to accept ride');
        console.error('Error accepting ride:', err);
      }
    }
  };

  return (
    <div className="driver-rides">
      <Nav className="driver-rides-nav">
        {/* Navigation section remains the same */}
      </Nav>

      <Container className="driver-rides-container">
        {error && <div className="error-message">{error}</div>}
        
        <section className="driver-rides-current">
          <h2>Available Ride Requests</h2>
          <Row>
            {currentRides.map(ride => (
              <Col lg={4} md={6} sm={12} key={ride.ride_id} className="mb-4">
                <div className="ride-card">
                  <div className="ride-card-header">
                    <h3>Ride #{ride.ride_id}</h3>
                    <span className={`ride-status ${ride.status.toLowerCase()}`}>
                      {ride.status}
                    </span>
                  </div>
                  <div className="ride-card-body">
                    <p><strong>Customer ID:</strong> {ride.customer_id}</p>
                    <p><strong>Pickup Location:</strong> ({ride.pickup_coordinates.lat}, {ride.pickup_coordinates.lng})</p>
                    <p><strong>Dropoff Location:</strong> ({ride.dropoff_coordinates.lat}, {ride.dropoff_coordinates.lng})</p>
                    <p><strong>Predicted Fare:</strong> ${ride.predicted_fare}</p>
                    <p><strong>Created:</strong> {new Date(ride.created_at).toLocaleString()}</p>
                  </div>
                  {ride.status === 'Pending' && (
                    <div className="ride-card-actions">
                      <button 
                        className="accept-btn"
                        onClick={() => handleRideAction(ride.ride_id, 'accepted')}
                      >
                        Accept
                      </button>
                    </div>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </section>

        <section className="driver-rides-history">
          <h2>My Rides</h2>
          <div className="rides-table-wrapper">
            <table className="rides-table">
              <thead>
                <tr>
                  <th>Ride ID</th>
                  <th>Created</th>
                  <th>Customer</th>
                  <th>Pickup</th>
                  <th>Dropoff</th>
                  <th>Fare</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {previousRides.map(ride => (
                  <tr key={ride.ride_id}>
                    <td>{ride.ride_id}</td>
                    <td>{new Date(ride.created_at).toLocaleString()}</td>
                    <td>{ride.customer_id}</td>
                    <td>({ride.pickup_coordinates.lat}, {ride.pickup_coordinates.lng})</td>
                    <td>({ride.dropoff_coordinates.lat}, {ride.dropoff_coordinates.lng})</td>
                    <td>${ride.predicted_fare}</td>
                    <td>
                      <span className={`status-badge ${ride.status.toLowerCase()}`}>
                        {ride.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Container>
      <DriverWebSocket callback={()=>{fetchRideRequests()}} />
    </div>
  );
};

export default DriverRides;