import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { baseUrl } from '../services/api-services';

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        admin_id: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
        profile_image: null
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const states = [
        { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
        { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
        { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
        { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
        { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
        { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
        { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
        { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
        { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
        { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
        { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
        { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
        { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
        { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
        { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
        { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
        { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
        { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
        { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
        { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
        { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
        { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
        { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
        { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
        { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
    ];

    const formatSSN = (value) => {
        const digits = value.replace(/\D/g, '');
        
        if (digits.length <= 3) {
            return digits;
        } else if (digits.length <= 5) {
            return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        } else {
            return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'admin_id') {
            const formattedValue = formatSSN(value);
            if (formattedValue.length <= 11) {
                setFormData(prev => ({
                    ...prev,
                    [name]: formattedValue
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profile_image: file
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (!formData.email.endsWith('@uber.com')) {
            setError('Email must end with @uber.com');
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await fetch(`${baseUrl}/administrator/register/`, {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/admin/login');
            } else {
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="bg-white p-4 rounded shadow-sm" style={{ maxWidth: '800px', width: '100%' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Admin Sign Up</h2>
                    <Button 
                        variant="outline-secondary"
                        onClick={() => navigate('/admin/login')}
                    >
                        Back to Login
                    </Button>
                </div>

                {error && (
                    <Alert variant="danger" className="mb-3">
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Admin ID (SSN Format: XXX-XX-XXXX)</Form.Label>
                        <Form.Control
                            type="text"
                            name="admin_id"
                            value={formData.admin_id}
                            onChange={handleInputChange}
                            required
                            placeholder="123-45-6789"
                            maxLength="11"
                            pattern="\d{3}-\d{2}-\d{4}"
                            title="Please enter a valid SSN in XXX-XX-XXXX format"
                        />
                        <Form.Text className="text-muted">
                            Enter in SSN format (e.g., 123-45-6789)
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Profile Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Profile Preview"
                                className="mt-2"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                            />
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email (@uber.com)</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="name@uber.com"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your password"
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter first name"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter last name"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter phone number"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter street address"
                        />
                    </Form.Group>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter city"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>State</Form.Label>
                                <Form.Select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select State</option>
                                    {states.map(state => (
                                        <option key={state.code} value={state.code}>
                                            {state.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Zip Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="zipcode"
                                    value={formData.zipcode}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter zip code"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button 
                        variant="primary" 
                        type="submit"
                        disabled={loading}
                        className="w-100 mt-3"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default AdminSignup;