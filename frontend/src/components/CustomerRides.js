import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import '../styles/DriverRides.css';
import WebSocketComponent from './WebSocket';

const CustomerRides = () => {
  const [currentRides, setCurrentRides] = useState([]);
  const [previousRides, setPreviousRides] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOngoingRides();
    fetchRides();
  }, []);


  const fetchOngoingRides = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/ongoing-ride/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setCurrentRides(response.data);
    } catch (err) {
      setError('Failed to fetch ongoing rides');
      console.error('Error fetching ongoing rides:', err);
    }
  };

  const fetchRides = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/rides/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setPreviousRides(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch rides history');
      console.error('Error fetching rides:', err);
    }
  };


  return (
    <div className="driver-rides">
      <Nav className="driver-rides-nav">
        {/* Navigation section remains the same */}
      </Nav>

      <Container className="driver-rides-container">
        {error && <div className="error-message">{error}</div>}


        {
          currentRides.length > 0 ? (
            <section className="driver-rides-current">
              <h2>Ongoing Rides</h2>
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
                        <p><strong>Driver ID:</strong> {ride.driver_id}</p>
                        <p><strong>Pickup Location:</strong> ({ride.pickup_coordinates.lat}, {ride.pickup_coordinates.lng})</p>
                        <p><strong>Dropoff Location:</strong> ({ride.dropoff_coordinates.lat}, {ride.dropoff_coordinates.lng})</p>
                        <p><strong>Predicted Fare:</strong> ${ride.predicted_fare}</p>
                        <p><strong>Created:</strong> {new Date(ride.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          ) : null
        }

        <section className="driver-rides-history">
          <h2>My Rides</h2>
          <div className="rides-table-wrapper">
            <table className="rides-table">
              <thead>
                <tr>
                  <th>Ride ID</th>
                  <th>Created</th>
                  <th>Driver</th>
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
                    <td>{ride.driver_id}</td>
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
      <WebSocketComponent type={'customer'} callback={() => { fetchOngoingRides(); fetchRides() }} />
    </div>
  );
};

export default CustomerRides;