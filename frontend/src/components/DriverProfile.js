import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import '../styles/DriverProfile.css';
import DriverNavbar from './DriverNavbar';
import { baseUrl } from '../services/api-services';

const DriverProfile = () => {
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now()); // Add this line for force re-render

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  const fetchDriverProfile = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/driver/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setDriverData(response.data);
      if (response.data.profile_photo) {
        setPreviewImage(baseUrl+response.data.profile_photo);
        setImageKey(Date.now()); // Update the key to force re-render
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile data');
      setLoading(false);
    }
  };

  //Adding location update
  const updateLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        let { latitude, longitude } = position.coords;
        // Round latitude and longitude to 6 decimal places
        latitude = parseFloat(latitude.toFixed(6));
        longitude = parseFloat(longitude.toFixed(6));
  
        try {
          await axios.put(
            `${baseUrl}/api/driver/profile/update`,
            {
              current_location_lat: latitude,
              current_location_lng: longitude,
            },
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              },
            }
          );
  
          alert('Location updated successfully!');
          fetchDriverProfile(); // Refresh profile data after update
        } catch (err) {
          console.error('Error updating location:', err);
          alert('Failed to update location. Please try again.');
        }
      },
      (error) => {
        alert(`Failed to get current location: ${error.message}`);
      }
    );
  };
  
  // 
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Create immediate preview
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        setImageKey(Date.now()); // Update image key when new image is selected
 
 
        const formData = new FormData();
        formData.append('profile_photo', file);
 
 
        const response = await axios.put(
          `${baseUrl}/api/driver/profile/update`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
 
 
        // Clean up the preview URL
        URL.revokeObjectURL(previewUrl);
       
        setDriverData(prev => ({
          ...prev,
          profile_photo: response.data.photo_url
        }));
      } catch (err) {
        setError('Failed to upload profile photo');
      }
    }
  };
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriverData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Exclude sensitive fields like 'is_superuser', 'is_staff' from the update
      const { is_superuser, is_staff, profile_photo, ...updateData } = driverData;

      // Send the update request without sensitive fields
      await axios.put(
        `${baseUrl}/api/driver/profile/update`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      setIsEditing(false);
      fetchDriverProfile(); // Refresh data after update
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="driver-profile-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="driver-profile-error">
        <p>{error}</p>
        <button onClick={fetchDriverProfile}>Retry</button>
      </div>
    );
  }

  return (
    <div className="driver-profile">
      <DriverNavbar />
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
                  key={imageKey} // Add key to force re-render when image changes
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
                {/* Form fields with API data */}
                {Object.entries(driverData || {}).map(([key, value]) => {
                  if (
                    key !== 'profile_photo' &&
                    key !== 'id' &&
                    key !== 'reviews' &&
                    key !== 'is_superuser' &&
                    key !== 'is_staff' &&
                    key !== 'groups' &&
                    key !== 'user_permissions'
                  ) {
                    return (
                      <Col md={6} key={key}>
                        <div className="driver-profile-input-group">
                          <label>{key.split('_').join(' ').toUpperCase()}</label>
                          <input
                            type="text"
                            name={key}
                            value={value || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing || key =='rating' || key =='total_trips'} 
                          />
                        </div>
                      </Col>
                    );
                  }
                  return null;
                })}
              </Row>

              {isEditing && (
                <div className="driver-profile-actions">
                  <button type="submit" className="driver-profile-save-btn">
                    Save Changes
                  </button>
                </div>
                )}
                  {/* Button to update location */}
                <div className="driver-profile-actions">
                  <button type="button" className="driver-profile-save-btn" onClick={updateLocation}>
                  Update Location
                  </button>
                </div>
            </Col>
          </Row>
        </form>
      </Container>
    </div>
  );
};

export default DriverProfile;