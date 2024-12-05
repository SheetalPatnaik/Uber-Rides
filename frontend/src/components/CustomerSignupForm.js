import React, { useState } from 'react';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { registerCustomer } from '../services/api';  // Import API function

const libraries = ['places'];

const CustomerSignupForm = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    email: '',
    creditCard: '',
    password: '', // Add password to state
  });

  const [autocomplete, setAutocomplete] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);

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
      let zipCode = '';

      components.forEach((component) => {
        const types = component.types;
        if (types.includes('locality')) city = component.long_name;
        if (types.includes('administrative_area_level_1')) state = component.short_name;
        if (types.includes('postal_code')) zipCode = component.long_name;
      });

      setFormData({ ...formData, address, city, state, zipCode });
    }
  };

  const validateForm = () => {
    const errors = [];

    // SSN validation
    if (!ssnRegex.test(formData.customerId)) {
      errors.push('Customer ID must be in the format XXX-XX-XXXX');
    }

    // Gmail validation
    if (!emailRegex.test(formData.email)) {
      errors.push('Email must be a valid Gmail address');
    }

    // Credit Card validation
    if (!creditCardRegex.test(formData.creditCard)) {
      errors.push('Credit Card must be a valid format');
    }

    // Phone Number validation
    if (!phoneNumberRegex.test(formData.phoneNumber)) {
      errors.push('Phone Number must be in the format (XXX) XXX-XXXX or XXX-XXX-XXXX');
    }

    // Password validation
    if (!formData.password || formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    // Check if any errors
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

    const response = await registerCustomer(formData);

    if (response.message) {
      alert('Customer registered successfully!');
      window.location.reload();
    } else {
      alert('Customer with same SSN already exists');
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

                <Form.Group controlId="formCustomerId">
                  <Form.Label>
                    Customer ID (SSN) <span style={{ color: 'red' }}>*</span>
                    <small className="form-text text-muted">Format: XXX-XX-XXXX</small>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formFirstName">
                  <Form.Label>
                    First Name <span style={{ color: 'red' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formLastName">
                  <Form.Label>
                    Last Name <span style={{ color: 'red' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formAddress">
                  <Form.Label>
                    Address <span style={{ color: 'red' }}>*</span>
                  </Form.Label>
                  <Autocomplete
                    onLoad={(autocompleteInstance) => setAutocomplete(autocompleteInstance)}
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

                <Form.Group controlId="formCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" name="city" value={formData.city} readOnly />
                </Form.Group>

                <Form.Group controlId="formState">
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" name="state" value={formData.state} readOnly />
                </Form.Group>

                <Form.Group controlId="formZipCode">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control type="text" name="zipCode" value={formData.zipCode} readOnly />
                </Form.Group>

                <Form.Group controlId="formPhoneNumber">
                  <Form.Label>
                    Phone Number <span style={{ color: 'red' }}>*</span>
                    <small className="form-text text-muted">Format: (XXX) XXX-XXXX or XXX-XXX-XXXX</small>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>
                    Email <span style={{ color: 'red' }}>*</span>
                    <small className="form-text text-muted">Must be a valid Gmail address</small>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formCreditCard">
                  <Form.Label>
                    Credit Card Details <span style={{ color: 'red' }}>*</span>
                    <small className="form-text text-muted">Format: XXXX-XXXX-XXXX-XXXX</small>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="creditCard"
                    value={formData.creditCard}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>
                    Password <span style={{ color: 'red' }}>*</span>
                    <small className="form-text text-muted">Password must be at least 6 characters long</small>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" block className="mt-4">
                  Submit
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </LoadScript>
  );
};

export default CustomerSignupForm;
