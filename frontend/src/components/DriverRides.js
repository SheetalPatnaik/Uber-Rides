import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import '../styles/DriverRides.css';
import WebSocketComponent from './WebSocket';
import DriverNavbar from './DriverNavbar';
import { baseUrl } from '../services/api-services';

const DriverRides = () => {
  const [currentRides, setCurrentRides] = useState([]);
  const [acceptedRides, setAcceptedRides] = useState([]);
  const [previousRides, setPreviousRides] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRideRequests();
    fetchOngoingRides();
    fetchRides();
  }, []);

  const fetchRideRequests = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/driver/ride-requests/`, {
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

  const fetchOngoingRides = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/driver/ongoing-ride/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setAcceptedRides(response.data);
    } catch (err) {
      setError('Failed to fetch ongoing rides');
      console.error('Error fetching ongoing rides:', err);
    }
  };

  const fetchRides = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/driver/rides/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setPreviousRides(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch rides history');
      console.error('Error fetching rides:', err);
    }
  };

  // Function to calculate the cumulative earnings from previous rides
  const calculateTotalEarnings = (rides) => {
    return rides.reduce((total, ride) => total + (ride.predicted_fare * 0.80), 0).toFixed(2);
  };

  const handleRideAction = async (rideId, action) => {
    var url = action === 'accept'?`${baseUrl}/api/driver/accept-ride/${rideId}`:(
      action=='pick'?`${baseUrl}/api/driver/pick-rider/${rideId}`:(
        action=='complete'?`${baseUrl}/api/driver/complete-ride/${rideId}`:''
      )
    );
    if(url) {
      try {
        await axios.post(url, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        fetchRideRequests(); // Refresh the rides lists
        fetchOngoingRides();
        fetchRides();
        setError(null);
      } catch (err) {
        setError(`Failed to accept ${action}`);
        console.error(err);
      }
    }
  };

  return (
    <div className="driver-rides">
      <DriverNavbar />

      <Container className="driver-rides-container">
        {error && <div className="error-message">{error}</div>}

        {
          currentRides.length > 0 ? (
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
                        <p><strong>Pickup Location:</strong>{ride.pickup_location} </p>
                        <p><strong>Dropoff Location:</strong>{ride.dropoff_location}</p>
                        <p><strong>Predicted Fare:</strong> ${ride.predicted_fare}</p>
                        <p><strong>Created:</strong> {new Date(ride.created_at).toLocaleString()}</p>
                      </div>
                      {ride.status === 'Pending' && (
                        <div className="ride-card-actions">
                          <button
                            className="accept-btn"
                            onClick={() => handleRideAction(ride.ride_id, 'accept')}
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
          ) : null
        }

        {
          acceptedRides.length > 0 ? (
            <section className="driver-rides-current">
              <h2>Ongoing Rides</h2>
              <Row>
                {acceptedRides.map(ride => (
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
                        <p><strong>Pickup Location:</strong>{ride.pickup_location} </p>
                        <p><strong>Dropoff Location:</strong>{ride.dropoff_location}</p>
                        <p><strong>Predicted Fare:</strong> ${ride.predicted_fare}</p>
                        <p><strong>Created:</strong> {new Date(ride.created_at).toLocaleString()}</p>
                      </div>

                      <div className="ride-card-actions" >
                        <button
                          className="accept-btn"
                          onClick={() =>{
                            if(ride.status=='accepted'){
                              handleRideAction(ride.ride_id, 'pick')
                            }else{
                              handleRideAction(ride.ride_id, 'complete')
                            }
                          }}
                        >
                          {
                            ride.status=='accepted'?'Pickup rider':'Complete ride'
                          }
                        </button>
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
            {/* Display Total Earnings */}
            <div className="total-earnings">
              <h4>Total Earnings: ${calculateTotalEarnings(previousRides)}</h4>
            </div>
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
                    <td><p>{ride.pickup_location} </p></td>
                    <td><p>{ride.dropoff_location}</p></td>
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
      <WebSocketComponent type={'driver'} callback={() => { fetchRideRequests(); fetchOngoingRides(); fetchRides() }} />
    </div>
  );
};

export default DriverRides;