// DriverSignupForm.js
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/DriverSignupForm.css';

const VEHICLE_TYPES = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'van', label: 'Van' },
  { value: 'luxury', label: 'Luxury' },
];

const DriverSignupForm = () => {
  const [formData, setFormData] = useState({
    driver_id: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
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
    introduction_video: '',
    profile_photo: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_photo: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="driver-signup">
      <nav className="driver-signup-nav">
        <Container>
          <Link to="/" className="driver-signup-brand">Uber</Link>
        </Container>
      </nav>

      <Container className="driver-signup-container">
        <div className="driver-signup-form-wrapper">
          <h2 className="driver-signup-title">Sign Up</h2>

          <form onSubmit={handleSubmit} className="driver-signup-form">
            <div className="driver-signup-photo-section">
              <div className="driver-signup-photo-preview">
                {previewImage ? (
                  <img src={previewImage} alt="Profile preview" />
                ) : (
                  <div className="driver-signup-photo-placeholder">
                    <span>Add Photo</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="driver-signup-photo-input"
                id="profile_photo"
              />
            </div>

            <div className="driver-signup-grid">
              <div className="driver-signup-input-group">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="driver-signup-input-group">
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="driver-signup-input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="driver-signup-input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="driver-signup-input-group">
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="Phone Number"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="driver-signup-input-group">
                <input
                  type="text"
                  name="license_number"
                  placeholder="License Number"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="driver-signup-input-group full-width">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="driver-signup-input-group">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="driver-signup-input-group">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="driver-signup-input-group">
                <input
                  type="text"
                  name="zipcode"
                  placeholder="Zipcode"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="driver-signup-input-group">
                <select
                  name="vehicle_type"
                  required
                  onChange={handleInputChange}
                >
                  <option value="">Select Vehicle Type</option>
                  {VEHICLE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="driver-signup-input-group">
                <input
                  type="text"
                  name="vehicle_model"
                  placeholder="Vehicle Model"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="driver-signup-input-group">
                <input
                  type="text"
                  name="vehicle_plate"
                  placeholder="Vehicle Plate"
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="driver-signup-input-group full-width">
  <label className="driver-signup-file-label">
    Profile Photo (Optional)
    <input
      type="file"
      name="profile_photo"
      accept="image/*"
      onChange={handleImageChange}
      className="driver-signup-file-input"
    />
  </label>
</div>

<div className="driver-signup-input-group full-width">
  <label className="driver-signup-file-label">
    Introduction Video (Optional)
    <input
      type="file"
      name="introduction_video"
      accept="video/*"
      onChange={handleInputChange}
      className="driver-signup-file-input"
    />
  </label>
</div>
            </div>

            <button type="submit" className="driver-signup-button">
              Sign Up
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default DriverSignupForm;