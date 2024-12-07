import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';

const DriverProfile = () => {
  const [profileData, setProfileData] = useState({
    driver_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    vehicle_type: '',
    vehicle_model: '',
    vehicle_plate: '',
    license_number: '',
    rating: '',
    profile_photo: null,
    introduction_video: null,
  });
  const VEHICLE_TYPES = ['sedan', 'suv', 'luxury', 'van'] 
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch driver profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken'); // Assuming token is stored in localStorage
      const response = await axios.get('http://localhost:8000/api/driver/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setProfileData(response.data);
      setPreviewImage(response.data.profile_photo); // Set profile photo preview if available
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      setMessage('Failed to fetch profile. Please try again.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProfileData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      if (name === 'profile_photo') {
        setPreviewImage(URL.createObjectURL(files[0]));
      }
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('accessToken');
    const formData = new FormData();

    Object.entries(profileData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await axios.put('http://localhost:8000/api/driver/profile/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile(); // Refresh profile after update
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      setMessage('Failed to update profile. Please try again.');
    }
  };

  return (
    <Container>
      <h2>Driver Profile</h2>
      {message && <p>{message}</p>}
      <Form onSubmit={handleUpdate}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="driver_id">
              <Form.Label>Driver ID</Form.Label>
              <Form.Control
                type="text"
                name="driver_id"
                value={profileData.driver_id}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={profileData.email}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="first_name">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={profileData.first_name}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="last_name">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={profileData.last_name}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="phone_number">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={profileData.phone_number}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="vehicle_type">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Control
                as="select"
                name="vehicle_type"
                value={profileData.vehicle_type}
                readOnly={!isEditing}
                onChange={handleInputChange}
              >
                <option value="">Select Vehicle Type</option>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={profileData.address}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="profile_photo">
              <Form.Label>Profile Photo</Form.Label>
              <Form.Control
                type="file"
                name="profile_photo"
                accept="image/*"
                onChange={handleInputChange}
              />
              {previewImage && <img src={previewImage} alt="Preview" width="100" />}
            </Form.Group>
          </Col>
        </Row>
        {isEditing && (
          <Button type="submit" variant="primary" className="mt-3">
            Save Changes
          </Button>
        )}
        {!isEditing && (
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </Form>
    </Container>
  );
};

export default DriverProfile;