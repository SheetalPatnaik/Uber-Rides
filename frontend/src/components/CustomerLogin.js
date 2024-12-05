import React, { useState } from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Add this import
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomerLogin = () => {
    const [customerId, setCustomerId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Reset error message
        setErrorMessage('');

        try {
            // Send login request using axios
            const response = await axios.post('http://localhost:8000/login/', 
                {
                    customerId,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true  // Important for handling cookies
                }
            );

            if (response.status === 200) {
                // Store customer_id in localStorage
                localStorage.setItem('customer_id', response.data.customer_id);
                
                // Optional: Store any other relevant data
                localStorage.setItem('isLoggedIn', 'true');
                
                // If login is successful, redirect to the book ride page
                navigate('/book-ride');
            }
        } catch (error) {
            // Handle different types of errors
            const errorMsg = error.response?.data?.error || 'An error occurred during login';
            setErrorMessage(errorMsg);
        }
    };

    return (
        <Container className="mt-5">
            <h2>Customer Login</h2>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: 'auto' }}>
                <Form.Group controlId="formCustomerId">
                    <Form.Label>Customer ID (SSN)</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your SSN"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4" style={{width: '100%'}}>
                    Login
                </Button>
            </Form>
        </Container>
    );
};

export default CustomerLogin;