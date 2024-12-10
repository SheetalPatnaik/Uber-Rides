// CustomerProfile.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { baseUrl } from '../services/api-services';
import CustomerNavbar from './CustomerNavbar';
//import '../styles/CustomerProfile.css';

const CustomerProfile = () => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchCustomerProfile();
  }, []);

  const fetchCustomerProfile = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setCustomerData(response.data);
      if (response.data.profile_photo) {
        setPreviewImage(`${baseUrl}`+response.data.profile_photo);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile data');
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setProfilePhoto(file);
        // const formData = new FormData();
        // formData.append('profile_photo', file);

        // const response = await axios.post(
        //   
        //   formData,
        //   {
        //     headers: {
        //       'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        //       'Content-Type': 'multipart/form-data'
        //     }
        //   }
        // );

        setPreviewImage(URL.createObjectURL(file));
        // setCustomerData(prev => ({
        //   ...prev,
        //   profile_photo: response.data.profile_photo
        // }));

      } catch (err) {
        setError('Failed to upload profile photo');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Exclude sensitive fields like 'id' from the update
      const { id, profile_photo, ...updateData } = customerData;
      let formData = new FormData();
      for (let key in updateData) {
        formData.append(key, updateData[key]);
      }
      if (profilePhoto) {
        formData.append('profile_photo', profilePhoto);
      }

      await axios.put(
        `${baseUrl}/api/profile/update`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setIsEditing(false);
      fetchCustomerProfile(); // Refresh data after update
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="customer-profile-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-profile-error">
        <p>{error}</p>
        <button onClick={fetchCustomerProfile}>Retry</button>
      </div>
    );
  }

  return (
    <div className="customer-profile">
      <CustomerNavbar />
      <Container className="customer-profile-container">
        <div className="customer-profile-header">
          <h1>Profile Information</h1>
          <button
            className="customer-profile-edit-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="customer-profile-form">
          <Row>
            <Col lg={3} md={12} className="customer-profile-photo-section">
              <div className="customer-profile-photo-wrapper">
                <img
                  src={previewImage || '/default-avatar.png'}
                  alt="Profile"
                  className="customer-profile-photo"
                />
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="customer-profile-photo-input"
                  />
                )}
              </div>
            </Col>

            <Col lg={9} md={12}>
              <Row>
                {Object.entries(customerData || {}).map(([key, value]) => {
                  if (key !== 'profile_photo' && key !== 'id') {
                    return (
                      <Col md={6} key={key}>
                        <div className="customer-profile-input-group">
                          <label>{key.split('_').join(' ').toUpperCase()}</label>
                          <input
                            type="text"
                            name={key}
                            value={value || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </Col>
                    );
                  }
                  return null;
                })}
              </Row>

              {isEditing && (
                <div className="customer-profile-actions">
                  <button type="submit" className="customer-profile-save-btn">
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

export default CustomerProfile;