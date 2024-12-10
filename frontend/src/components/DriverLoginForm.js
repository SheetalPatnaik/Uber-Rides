import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/DriverLoginForm.css';
import { baseUrl } from '../services/api-services';
const DriverLoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${baseUrl}/api/driver/login/`, formData);
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      localStorage.setItem('driverData', JSON.stringify({
        id: response.data.user_id,
        email: response.data.email,
        name: response.data.name,
        location: {
          lat: response.data.current_location_lat,
          lng: response.data.current_location_lng
        }
      }));

      // Redirect to dashboard
      navigate('/driver/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Invalid credentials');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="driver-login">
      <nav className="driver-login-nav">
        <Container>
          <Link to="/" className="driver-login-brand">Uber</Link>
        </Container>
      </nav>
      
      <Container className="driver-login-container">
        <div className="driver-login-form-wrapper">
          <h2 className="driver-login-title">Driver Login</h2>
          
          {error && (
            <div className="driver-login-error">
              {error}
            </div>
          )}
          
          <form className="driver-login-form" onSubmit={handleSubmit}>
            <div className="driver-login-input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="driver-login-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="driver-login-input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="driver-login-input"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="driver-login-button">
              Login
            </button>

            <div className="driver-login-links">
              <Link to="/driver/signup">New Driver? Sign up here</Link>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default DriverLoginForm;