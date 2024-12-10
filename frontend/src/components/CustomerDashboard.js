import React from 'react';
import { Container, Nav, Row, Col } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/CustomerDashboard.css';
import Footer from './Footer';
import { baseUrl } from '../services/api-services';
import CustomerImage from '../images/booking_a_ride.jpeg'; // You can replace this image with a relevant one for customers

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('customerData');
    
    // Redirect to login page
    navigate('/customer/login');
  };

  return (
    <div className="customer-dash">
      {/* Navigation Bar */}
      <Nav className="customer-dash-nav navbar navbar-expand-lg navbar-dark bg-black py-3">
        <Container fluid>
          <NavLink to="/" className="customer-dash-brand">
            Uber Ride
          </NavLink>
          <div className="customer-dash-nav-links">
            <NavLink to="/customer/dashboard" className="customer-dash-link">
              Home
            </NavLink>
            <NavLink to="/customer/book-ride" className="customer-dash-link">
              Book Ride
            </NavLink>
            <NavLink to="/customer/rides" className="customer-dash-link">
              My Rides
            </NavLink>
            <NavLink to="/customer/profile" className="customer-dash-link">
              Profile
            </NavLink>
            <button 
              onClick={handleLogout}
              className="customer-dash-logout-btn"
            >
              Logout
            </button>
          </div>
        </Container>
      </Nav>

      {/* Hero Section */}
      <Container fluid className="customer-dash-hero p-0">
        <Row className="align-items-center mx-0">
          <Col lg={6} md={12} className="ps-lg-5">
            <h1 className="customer-dash-title">
              Ride with comfort and convenience
            </h1>
            <p className="customer-dash-subtitle">
              Your ride, your way – fast, easy, and safe.
            </p>
          </Col>
          <Col lg={6} md={12} className="p-0">
            <div className="customer-dash-image-wrapper">
              <img 
                src={CustomerImage} 
                alt="Customer booking a ride" 
                className="customer-dash-hero-image"
              />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Customer Features Section */}
      <Container>
        <section className="customer-dash-features">
          <h2 className="customer-dash-section-title">Ride with Confidence</h2>
          <p className="customer-dash-section-subtitle">
            The best transportation experience, from start to finish.
          </p>
          
          <Row className="customer-dash-feature-list">
            <Col lg={4} md={12} className="customer-dash-feature">
              <div className="customer-dash-feature-icon protection"></div>
              <h3>Safety First</h3>
              <p>Your safety is our top priority. Ride with peace of mind knowing you're covered at all times.</p>
              <a href="#" className="customer-dash-link-text">Get details</a>
            </Col>

            <Col lg={4} md={12} className="customer-dash-feature">
              <div className="customer-dash-feature-icon ride-tracking"></div>
              <h3>Track Your Ride</h3>
              <p>Follow your ride's progress in real-time and stay updated on your trip details.</p>
              <a href="#" className="customer-dash-link-text">Learn more</a>
            </Col>

            <Col lg={4} md={12} className="customer-dash-feature">
              <div className="customer-dash-feature-icon community"></div>
              <h3>Community Focused</h3>
              <p>Our guidelines ensure that everyone has a safe and positive experience when using the app.</p>
              <a href="#" className="customer-dash-link-text">Learn more</a>
            </Col>
          </Row>
        </section>
      </Container>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default CustomerDashboard;