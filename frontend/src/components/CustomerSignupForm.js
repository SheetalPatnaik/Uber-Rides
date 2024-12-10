import React, { useState } from 'react';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { baseUrl } from '../services/api-services';
import { useNavigate } from 'react-router-dom'; 

const libraries = ['places'];

const CustomerSignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_id: '',
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
    email: '',
    credit_card: '',
    password: '', // Add password to state
  });

  const [autocomplete, setAutocomplete] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Regular expressions for validation
  const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const creditCardRegex = /^(\d{4}[\s\-]?)?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}$/;
  const phoneNumberRegex = /^(?:\(\d{3}\)\s?|\d{3}[\s\-]?)\d{3}[\s\-]?\d{4}$/; // US phone number format

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const address = place.formatted_address;
      const components = place.address_components;

      let city = '';
      let state = '';
      let zip_code = '';

      components.forEach((component) => {
        const types = component.types;
        if (types.includes('locality')) city = component.long_name;
        if (types.includes('administrative_area_level_1')) state = component.short_name;
        if (types.includes('postal_code')) zip_code = component.long_name;
      });

      setFormData({ ...formData, address, city, state, zip_code });
    }
  };

  const validateForm = () => {
    const errors = [];

    // SSN validation
    if (!ssnRegex.test(formData.customer_id)) {
      errors.push('Customer ID must be in the format XXX-XX-XXXX');
    }

    // Gmail validation
    if (!emailRegex.test(formData.email)) {
      errors.push('Email must be a valid Gmail address');
    }

    // Credit Card validation
    if (!creditCardRegex.test(formData.credit_card)) {
      errors.push('Credit Card must be a valid format');
    }

    // Phone Number validation
    if (!phoneNumberRegex.test(formData.phone_number)) {
      errors.push('Phone Number must be in the format (XXX) XXX-XXXX or XXX-XXX-XXXX');
    }

    // Password validation
    if (!formData.password || formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorMessages(validationErrors);
      return;
    }

    setErrorMessages([]); // Reset errors

    try {
      const response = await axios.post(`${baseUrl}/api/register-customer/`, formData);

      if (response.data.message) {
        setSuccessMessage('Customer registered successfully!');
        setFormData({
          customer_id: '',
          first_name: '',
          last_name: '',
          address: '',
          city: '',
          state: '',
          zip_code: '',
          phone_number: '',
          email: '',
          credit_card: '',
          password: '',
        });
        // Add a small delay before navigation to show the success message
        setTimeout(() => {
          navigate('/customer/login');
          // Alternatively, if you're using React Router:
          // navigate('/customer/login');
        }, 1500);
      } else {
        setErrorMessages(['Customer with the same SSN already exists.']);
      }
    } catch (error) {
      setErrorMessages(['An error occurred while registering the customer. Please try again later.']);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDi2PhMSkAXRRqSwvWb7vv7WVGvuxOHDmM" libraries={libraries}>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card style={{ padding: '20px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
              <h2 className="text-center mb-4">Customer Signup</h2>
              <Form onSubmit={handleSubmit}>
                {errorMessages.length > 0 && (
                  <Alert variant="danger">
                    <ul>
                      {errorMessages.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </Alert>
                )}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <Form.Group controlId="formCustomerId">
                  <Form.Label>
                    Customer ID (SSN) <span style={{ color: 'red' }}>*</span>
                    <small className="form-text text-muted">Format: XXX-XX-XXXX</small>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formFirstName" className="mt-3">
                  <Form.Label>First Name <span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formLastName" className="mt-3">
                  <Form.Label>Last Name <span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formAddress" className="mt-3">
                  <Form.Label>Address <span style={{ color: 'red' }}>*</span></Form.Label>
                  <Autocomplete
                    onLoad={setAutocomplete}
                    onPlaceChanged={handlePlaceSelect}
                  >
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </Autocomplete>
                </Form.Group>

                <Form.Group controlId="formCity" className="mt-3">
                  <Form.Label>City <span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formState" className="mt-3">
                  <Form.Label>State <span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formZipCode" className="mt-3">
                  <Form.Label>ZIP Code <span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPhoneNumber" className="mt-3">
                  <Form.Label>Phone Number <span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mt-3">
                  <Form.Label>Email <span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formCreditCard" className="mt-3">
                  <Form.Label>Credit Card <span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="credit_card"
                    value={formData.credit_card}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                  <Form.Label>Password <span style={{ color: 'red' }}>*</span></Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-center mt-4">
                  <Button type="submit" className="btn-primary">
                    Register
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </LoadScript>
  );
};

export default CustomerSignupForm;