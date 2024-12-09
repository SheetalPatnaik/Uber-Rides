import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { baseUrl } from '../services/api-services';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);

        try {
            const response = await fetch(`${baseUrl}/administrator/login/`, {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('adminToken', data.access_token);
                localStorage.setItem('adminId', data.admin_id);
                localStorage.setItem('adminName', data.name);
                localStorage.setItem('adminEmail', data.email);
                navigate('/admin/dashboard');
            } else {
                setError(data.error || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="bg-white p-4 rounded shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Admin Login</h2>
                
                {error && (
                    <Alert variant="danger" className="mb-3">
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            autoComplete="email"
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            autoComplete="current-password"
                        />
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                            className="mb-3"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>

                        <Link 
                            to="/admin/signup"
                            className="btn btn-outline-secondary"
                            style={{ textDecoration: 'none' }}
                            role="button"
                        >
                            Create New Account
                        </Link>
                    </div>
                </Form>

                <div className="text-center mt-3">
                    <small className="text-muted">
                        By logging in, you agree to our Terms of Service and Privacy Policy
                    </small>
                </div>
            </div>
        </Container>
    );
};

export default AdminLogin;