// DriverDashboard.js
import React from 'react';
import { Container, Nav, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import '../styles/DriverDashboard.css';
import Footer from './Footer';
import DriverImage from '../images/5.jpg'
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../services/api-services';

const DriverDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('driverData');
    
    // Redirect to login page
    navigate('/driver/login');
  };
  return (
    <div className="driver-dash">
      <Nav className="driver-dash-nav navbar navbar-expand-lg navbar-dark bg-black py-3">
        <Container fluid>
          <NavLink to="/" className="driver-dash-brand">
            Uber Drive
          </NavLink>
          <div className="driver-dash-nav-links">
            <NavLink to="/driver/dashboard" className="driver-dash-link">
              Home
            </NavLink>
            <NavLink to="/driver/earnings" className="driver-dash-link">
              Earnings
            </NavLink>
            <NavLink to="/driver/rides" className="driver-dash-link">
              Rides
            </NavLink>
            <NavLink to="/driver/profile" className="driver-dash-link">
              Profile
            </NavLink>
            <button 
              onClick={handleLogout}
              className="driver-dash-logout-btn"
            >
              Logout
            </button>
          </div>
        </Container>
      </Nav>

      <Container fluid className="driver-dash-hero p-0">
        <Row className="align-items-center mx-0">
          <Col lg={6} md={12} className="ps-lg-5">
            <h1 className="driver-dash-title">
              Drive when you want, make what you need
            </h1>
            <p className="driver-dash-subtitle">
              Earn on your own schedule.
            </p>
          </Col>
          <Col lg={6} md={12} className="p-0">
            <div className="driver-dash-image-wrapper">
              <img 
                src={DriverImage} 
                alt="Driver in car" 
                className="driver-dash-hero-image"
              />
            </div>
          </Col>
        </Row>
      </Container>

      <Container>
        <section className="driver-dash-safety">
          <h2 className="driver-dash-section-title">Safety on the road</h2>
          <p className="driver-dash-section-subtitle">
            Your safety drives us to continuously raise the bar.
          </p>
          
          <Row className="driver-dash-safety-features">
            <Col lg={4} md={12} className="driver-dash-feature">
              <div className="driver-dash-feature-icon protection"></div>
              <h3>Protection on every trip</h3>
              <p>On each trip you take with the Driver app, we maintain auto insurance on your behalf to protect you and your rider.</p>
              <a href="#" className="driver-dash-link-text">Get details</a>
            </Col>

            <Col lg={4} md={12} className="driver-dash-feature">
              <div className="driver-dash-feature-icon help"></div>
              <h3>Help if you need it</h3>
              <p>The Emergency Button calls 911. The app displays your trip details so you can quickly share them with authorities.</p>
              <a href="#" className="driver-dash-link-text">Learn more</a>
            </Col>

            <Col lg={4} md={12} className="driver-dash-feature">
              <div className="driver-dash-feature-icon community"></div>
              <h3>Community Guidelines</h3>
              <p>Our standards help to create safe connections and positive interactions with everyone. Learn how our guidelines apply to you.</p>
              <a href="#" className="driver-dash-link-text">Learn more</a>
            </Col>
          </Row>
        </section>
      </Container>
      <Footer />
    </div>
  );
};

export default DriverDashboard;