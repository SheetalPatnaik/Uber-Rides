// DriverLoginForm.js
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/DriverLoginForm.css';

const DriverLoginForm = () => {
  const [formData, setState] = useState({
    email: '',
    password: ''
  });

  return (
    <div className="driver-login">
      <nav className="driver-login-nav">
        <Container>
          <Link to="/" className="driver-login-brand">Uber</Link>
        </Container>
      </nav>
      
      <Container className="driver-login-container">
        <div className="driver-login-form-wrapper">
          <h2 className="driver-login-title">Login</h2>
          
          <form className="driver-login-form">
            <div className="driver-login-input-group">
              <input
                type="text"
                placeholder="Enter phone number or email"
                className="driver-login-input"
                value={formData.email}
                onChange={(e) => setState({...formData, email: e.target.value})}
              />
            </div>

            <div className="driver-login-input-group">
              <input
                type="password"
                placeholder="Enter password"
                className="driver-login-input"
                value={formData.password}
                onChange={(e) => setState({...formData, password: e.target.value})}
              />
            </div>

            <button type="submit" className="driver-login-button">
              Login
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default DriverLoginForm;