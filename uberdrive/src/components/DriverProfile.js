// DriverProfile.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import '../styles/DriverProfile.css';

const DriverProfile = () => {
  const [driverData, setDriverData] = useState({
    driver_id: '12345',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone_number: '123-456-7890',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zipcode: '94105',
    vehicle_type: 'sedan',
    vehicle_model: 'Toyota Camry',
    vehicle_plate: 'ABC123',
    license_number: 'DL12345',
    profile_photo: null,
    introduction_video: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDriverData(prev => ({
        ...prev,
        profile_photo: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriverData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Handle update logic here
  };

  return (
    <div className="driver-profile">
      <nav className="driver-profile-nav">
        <Container fluid>
          <div className="driver-profile-nav-content">
            <NavLink to="/" className="driver-profile-brand">
              Uber Drive
            </NavLink>
            <div className="driver-profile-nav-links">
              <NavLink to="/driver/dashboard" className="driver-profile-link">
                Home
              </NavLink>
              <NavLink to="/driver/earnings" className="driver-profile-link">
                Earnings
              </NavLink>
              <NavLink to="/driver/ratings" className="driver-profile-link">
                Ratings
              </NavLink>
              <NavLink to="/driver/rides" className="driver-profile-link">
              Rides
            </NavLink>
              <NavLink to="/driver/profile" className="driver-profile-link">
                Profile
              </NavLink>
            </div>
            <div className="driver-profile-user">
              <img 
                src={previewImage || '/default-avatar.png'} 
                alt="Profile" 
                className="driver-profile-avatar"
              />
              <span className="driver-profile-name">
                {driverData.first_name} {driverData.last_name}
              </span>
            </div>
          </div>
        </Container>
      </nav>

      <Container className="driver-profile-container">
        <div className="driver-profile-header">
          <h1>Profile Information</h1>
          <button 
            className="driver-profile-edit-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="driver-profile-form">
          <Row>
            <Col lg={3} md={12} className="driver-profile-photo-section">
              <div className="driver-profile-photo-wrapper">
                <img 
                  src={previewImage || '/default-avatar.png'} 
                  alt="Profile" 
                  className="driver-profile-photo"
                />
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="driver-profile-photo-input"
                  />
                )}
              </div>
            </Col>

            <Col lg={9} md={12}>
              <Row>
                <Col md={6}>
                  <div className="driver-profile-input-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={driverData.first_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="driver-profile-input-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={driverData.last_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="driver-profile-input-group">
                    <label>Email</label>
                    <input
                      type="text"
                      name="email"
                      value={driverData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="driver-profile-input-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="phone_number"
                      value={driverData.phone_number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="driver-profile-input-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={driverData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="driver-profile-input-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={driverData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="driver-profile-input-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={driverData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="driver-profile-input-group">
                    <label>Zipcode</label>
                    <input
                      type="text"
                      name="zipcode"
                      value={driverData.zipcode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="driver-profile-input-group">
                    <label>Vehicle Type</label>
                    <input
                      type="text"
                      name="vehicle_type"
                      value={driverData.vehicle_type}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="driver-profile-input-group">
                    <label>Vehicle Model</label>
                    <input
                      type="text"
                      name="vehicle_model"
                      value={driverData.vehicle_model}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="driver-profile-input-group">
                    <label>Vehicle Plate</label>
                    <input
                      type="text"
                      name="vehicle_plate"
                      value={driverData.vehicle_plate}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="driver-profile-input-group">
                    <label>License Number</label>
                    <input
                      type="text"
                      name="license_number"
                      value={driverData.license_number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="driver-profile-input-group">
                    <label>Introduction Video</label>
                    <input
                      type="text"
                      name="introduction_video"
                      value={driverData.introduction_video}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </Col>
                {/* Add all other fields similarly */}
              </Row>

              {isEditing && (
                <div className="driver-profile-actions">
                  <button type="submit" className="driver-profile-save-btn">
                    Save Changes
                  </button>
                </div>
              )}
            </Col>
          </Row>
        </form>
      </Container>
    </div>
  );
};

export default DriverProfile;