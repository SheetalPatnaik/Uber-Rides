// DriverRides.js
import React, { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import '../styles/DriverRides.css';

const DriverRides = () => {
  const [currentRides, setCurrentRides] = useState([
    {
      id: 1,
      passenger: "Alice Smith",
      pickup: "123 Market St",
      dropoff: "456 Mission St",
      distance: "2.5 miles",
      fare: "$25",
      status: "pending"
    },
    // Add more rides as needed
  ]);

  const [previousRides, setPreviousRides] = useState([
    {
      id: 101,
      passenger: "Bob Johnson",
      pickup: "789 Howard St",
      dropoff: "321 Pine St",
      distance: "3.2 miles",
      fare: "$30",
      date: "2024-03-15",
      status: "completed"
    },
    // Add more previous rides
  ]);

  const handleRideAction = (rideId, action) => {
    setCurrentRides(prev => 
      prev.map(ride => 
        ride.id === rideId 
          ? { ...ride, status: action } 
          : ride
      )
    );
  };

  return (
    <div className="driver-rides">
      <Nav className="driver-rides-nav">
        <Container fluid>
          <div className="driver-rides-nav-content">
            <NavLink to="/" className="driver-rides-brand">
              Uber
            </NavLink>
            <div className="driver-rides-nav-links">
              <NavLink to="/driver/dashboard" className="driver-rides-link">
                Home
              </NavLink>
              <NavLink to="/driver/earnings" className="driver-rides-link">
                Earnings
              </NavLink>
              <NavLink to="/driver/ratings" className="driver-rides-link">
                Ratings
              </NavLink>
              <NavLink to="/driver/profile" className="driver-rides-link">
                Profile
              </NavLink>
            </div>
            <div className="driver-rides-profile">
              <img 
                src="/path-to-profile-photo.jpg" 
                alt="Driver" 
                className="driver-rides-avatar"
              />
              <span className="driver-rides-name">John Doe</span>
            </div>
          </div>
        </Container>
      </Nav>

      <Container className="driver-rides-container">
        <section className="driver-rides-current">
          <h2>Current Rides</h2>
          <Row>
            {currentRides.map(ride => (
              <Col lg={4} md={6} sm={12} key={ride.id} className="mb-4">
                <div className="ride-card">
                  <div className="ride-card-header">
                    <h3>Ride #{ride.id}</h3>
                    <span className={`ride-status ${ride.status}`}>
                      {ride.status}
                    </span>
                  </div>
                  <div className="ride-card-body">
                    <p><strong>Passenger:</strong> {ride.passenger}</p>
                    <p><strong>Pickup:</strong> {ride.pickup}</p>
                    <p><strong>Dropoff:</strong> {ride.dropoff}</p>
                    <p><strong>Distance:</strong> {ride.distance}</p>
                    <p><strong>Fare:</strong> {ride.fare}</p>
                  </div>
                  {ride.status === 'pending' && (
                    <div className="ride-card-actions">
                      <button 
                        className="accept-btn"
                        onClick={() => handleRideAction(ride.id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleRideAction(ride.id, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </section>

        <section className="driver-rides-history">
          <h2>Previous Rides</h2>
          <div className="rides-table-wrapper">
            <table className="rides-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Passenger</th>
                  <th>Pickup</th>
                  <th>Dropoff</th>
                  <th>Distance</th>
                  <th>Fare</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {previousRides.map(ride => (
                  <tr key={ride.id}>
                    <td>{ride.date}</td>
                    <td>{ride.passenger}</td>
                    <td>{ride.pickup}</td>
                    <td>{ride.dropoff}</td>
                    <td>{ride.distance}</td>
                    <td>{ride.fare}</td>
                    <td>
                      <span className={`status-badge ${ride.status}`}>
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
    </div>
  );
};

export default DriverRides;