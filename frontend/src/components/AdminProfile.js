import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../services/api-services';

const AdminProfile = () => {
    const [profile, setProfile] = useState({
        admin_id: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
        profile_image: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    // Add states array
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

    // Add function to format SSN
    const formatAdminId = (id) => {
        if (!id) return '';
        // Remove any non-digits
        const digits = id.replace(/\D/g, '');
        // Format as XXX-XX-XXXX
        return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            const response = await fetch(`${baseUrl}/administrator/profile/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Administrator Profile</h1>
                <Button 
                    variant="outline-secondary"
                    onClick={() => navigate('/admin/dashboard')}
                >
                    Back to Dashboard
                </Button>
            </div>

            {/* Profile Image */}
            <div className="text-center mb-4">
                {profile.profile_image ? (
                    <div style={{ width: '150px', height: '150px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
                        <img
                            src={profile.profile_image.startsWith('http') 
                                ? profile.profile_image 
                                : `${baseUrl}${profile.profile_image}`}
                            alt="Profile"
                            className="rounded-circle"
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                border: '2px solid #ddd'
                            }}
                        />
                    </div>
                ) : (
                    <div 
                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                        style={{ 
                            width: '150px', 
                            height: '150px', 
                            margin: '0 auto',
                            border: '2px solid #ddd'
                        }}
                    >
                        <span className="text-white h1">
                            {profile.first_name?.charAt(0)}{profile.last_name?.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Admin ID</Form.Label>
                    <Form.Control
                        type="text"
                        value={formatAdminId(profile.admin_id) || ''}
                        disabled
                        className="bg-light"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={profile.email || ''}
                        disabled
                        className="bg-light"
                    />
                </Form.Group>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={profile.first_name || ''}
                                disabled={!isEditing}
                                className={!isEditing ? 'bg-light' : ''}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={profile.last_name || ''}
                                disabled={!isEditing}
                                className={!isEditing ? 'bg-light' : ''}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        value={profile.phone_number || ''}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-light' : ''}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        value={profile.address || ''}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-light' : ''}
                    />
                </Form.Group>

                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                value={profile.city || ''}
                                disabled={!isEditing}
                                className={!isEditing ? 'bg-light' : ''}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            {isEditing ? (
                                <Form.Select
                                    name="state"
                                    value={profile.state || ''}
                                    onChange={(e) => setProfile({...profile, state: e.target.value})}
                                    className="form-control"
                                >
                                    <option value="">Select State</option>
                                    {states.map(state => (
                                        <option key={state.code} value={state.code}>
                                            {state.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            ) : (
                                <Form.Control
                                    type="text"
                                    value={states.find(s => s.code === profile.state)?.name || profile.state || ''}
                                    disabled
                                    className="bg-light"
                                />
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Zip Code</Form.Label>
                            <Form.Control
                                type="text"
                                value={profile.zipcode || ''}
                                disabled={!isEditing}
                                className={!isEditing ? 'bg-light' : ''}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button 
                    variant="primary"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
                {isEditing && (
                    <Button 
                        variant="secondary"
                        className="ms-2"
                        onClick={() => {
                            setIsEditing(false);
                            fetchProfile();
                        }}
                    >
                        Cancel
                    </Button>
                )}
            </Form>
        </Container>
    );
};

export default AdminProfile;