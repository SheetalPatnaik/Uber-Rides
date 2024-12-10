import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import '../styles/CustomerRides.css';
import WebSocketComponent from './WebSocket';
import CustomerNavbar from './CustomerNavbar';
import { baseUrl } from '../services/api-services';

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
      const response = await axios.get(`${baseUrl}/api/ongoing-ride/`, {
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
      const response = await axios.get(`${baseUrl}/api/rides/`, {
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
      <div className="cr-wrapper">
      <CustomerNavbar />

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
                        <p><strong>Pickup Location:</strong>{ride.pickup_location} </p>
                        <p><strong>Dropoff Location:</strong>{ride.dropoff_location}</p>
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {previousRides.map(ride => (
                  <tr key={ride.ride_id}>
                    <td>{ride.ride_id}</td>
                    <td>{new Date(ride.created_at).toLocaleString()}</td>
                    <td>{ride.driver_id}</td>
                    <td><p>{ride.pickup_location} </p></td>
                    <td><p>{ride.dropoff_location}</p></td>
                    <td>${ride.predicted_fare}</td>
                    <td>
                      <span className={`status-badge ${ride.status.toLowerCase()}`}>
                        {ride.status}
                      </span>
                    </td>
                    {/* <td>
                    <NavLink to={`/customer/ride-detail/${ride.ride_id}`} className="customer-dash-link">
                          Details
                    </NavLink>
                    </td>
                    <br />
                    <NavLink to={`/customer/view-bill/${ride.ride_id}`} className="customer-dash-link">
                    View Bill
                    </NavLink> */}
                    <td className="cr-action-buttons">
                     <NavLink to={`/customer/ride-detail/${ride.ride_id}`} className="cr-action-btn">
                       Details
                     </NavLink>
                     <NavLink to={`/customer/view-bill/${ride.ride_id}`} className="cr-action-btn">
                       View Bill
                     </NavLink>
                   </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Container>
      </div>
      <WebSocketComponent type={'customer'} callback={() => { fetchOngoingRides(); fetchRides() }} />
    </div>
  );
};

export default CustomerRides;