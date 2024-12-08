// // DriverProfile.js
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import { NavLink } from 'react-router-dom';
// import axios from 'axios';
// import SharedNavbar from '../components/SharedNavbar';
// import '../styles/DriverProfile.css';


// const DriverProfile = () => {
//  const [driverData, setDriverData] = useState(null);
//  const [loading, setLoading] = useState(true);
//  const [error, setError] = useState(null);
//  const [previewImage, setPreviewImage] = useState(null);
//  const [isEditing, setIsEditing] = useState(false);


//  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


//  useEffect(() => {
//    fetchDriverProfile();
//  }, []);


//  const fetchDriverProfile = async () => {
//   try {
//     const response = await axios.get('http://localhost:8000/api/driver/profile', {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//       }
//     });
//     console.log(response);
//     //setCurrentRides(response.data);
//   } catch (err) {
//     //setError('Failed to fetch ride requests');
//     console.error('Error fetching ride requests:', err);
//   }
//    try {
//      console.log(axios.defaults);
//      const response = await axios.get(`http://localhost:8000/api/driver/profile`, {
//        headers: {
//          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//          'Content-Type': 'application/json',
//        }
//      });
//      console.log(response)
//      setDriverData(response.data);
//      if (response.data.profile_photo) {
//        setPreviewImage(response.data.profile_photo);
//      }
//      setLoading(false);
//    } catch (err) {
//      setError('Failed to fetch profile data');
//      setLoading(false);
//    }
//  };


//  const handleImageChange = async (e) => {
//    const file = e.target.files[0];
//    if (file) {
//      try {
//        const formData = new FormData();
//        formData.append('profile_photo', file);


//        const response = await axios.post(
//          `http://localhost:8000/api/driver/profile/update`,
//          formData,
//          {
//            headers: {
//              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//              'Content-Type': 'multipart/form-data'
//            }
//          }
//        );


//        setPreviewImage(URL.createObjectURL(file));
//        setDriverData(prev => ({
//          ...prev,
//          profile_photo: response.data.photo_url
//        }));
//      } catch (err) {
//        setError('Failed to upload profile photo');
//      }
//    }
//  };


//  const handleInputChange = (e) => {
//    const { name, value } = e.target;
//    setDriverData(prev => ({
//      ...prev,
//      [name]: value
//    }));
//  };


//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    try {
//      await axios.put(
//        `http://localhost:8000/api/driver/profile/update`,
//        driverData,
//        {
//          headers: {
//            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//          }
//        }
//      );
//      setIsEditing(false);
//      fetchDriverProfile(); // Refresh data after update
//    } catch (err) {
//      setError('Failed to update profile');
//    }
//  };


//  if (loading) {
//    return (
//      <div className="driver-profile-loading">
//        <div className="loading-spinner"></div>
//      </div>
//    );
//  }


//  if (error) {
//    return (
//      <div className="driver-profile-error">
//        <p>{error}</p>
//        <button onClick={fetchDriverProfile}>Retry</button>
//      </div>
//    );
//  }


//  return (
//    <div className="driver-profile">
//      {/* <SharedNavbar /> */}
    
//      <Container className="driver-profile-container">
//        <div className="driver-profile-header">
//          <h1>Profile Information</h1>
//          <button
//            className="driver-profile-edit-btn"
//            onClick={() => setIsEditing(!isEditing)}
//          >
//            {isEditing ? 'Cancel' : 'Edit Profile'}
//          </button>
//        </div>


//        <form onSubmit={handleSubmit} className="driver-profile-form">
//          <Row>
//            <Col lg={3} md={12} className="driver-profile-photo-section">
//              <div className="driver-profile-photo-wrapper">
//                <img
//                  src={previewImage || '/default-avatar.png'}
//                  alt="Profile"
//                  className="driver-profile-photo"
//                />
//                {isEditing && (
//                  <input
//                    type="file"
//                    accept="image/*"
//                    onChange={handleImageChange}
//                    className="driver-profile-photo-input"
//                  />
//                )}
//              </div>
//            </Col>


//            <Col lg={9} md={12}>
//              <Row>
//                {/* Form fields with API data */}
//                {Object.entries(driverData || {}).map(([key, value]) => {
//                  if (key !== 'profile_photo' && key !== 'id') {
//                    return (
//                      <Col md={6} key={key}>
//                        <div className="driver-profile-input-group">
//                          <label>{key.split('_').join(' ').toUpperCase()}</label>
//                          <input
//                            type="text"
//                            name={key}
//                            value={value || ''}
//                            onChange={handleInputChange}
//                            disabled={!isEditing}
//                          />
//                        </div>
//                      </Col>
//                    );
//                  }
//                  return null;
//                })}
//              </Row>


//              {isEditing && (
//                <div className="driver-profile-actions">
//                  <button type="submit" className="driver-profile-save-btn">
//                    Save Changes
//                  </button>
//                </div>
//              )}
//            </Col>
//          </Row>
//        </form>
//      </Container>
//    </div>
//  );
// };


// export default DriverProfile;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import '../styles/DriverProfile.css';

const DriverProfile = () => {
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  const fetchDriverProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/driver/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setDriverData(response.data);
      if (response.data.profile_photo) {
        setPreviewImage(response.data.profile_photo);
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
        const formData = new FormData();
        formData.append('profile_photo', file);

        const response = await axios.post(
          `http://localhost:8000/api/driver/profile/update`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        setPreviewImage(URL.createObjectURL(file));
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
        `http://localhost:8000/api/driver/profile/update`,
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
                {/* Form fields with API data */}
                {Object.entries(driverData || {}).map(([key, value]) => {
                  if (
                    key !== 'profile_photo' &&
                    key !== 'id' &&
                    key !== 'is_superuser' &&
                    key !== 'is_staff'
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