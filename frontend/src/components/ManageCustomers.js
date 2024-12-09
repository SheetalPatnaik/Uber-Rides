import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageCustomers = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [disablingCustomer, setDisablingCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/users/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            if (response.data) {
                setCustomers(response.data);
                setError(null);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Unauthorized access. Please log in again.');
                // Redirect to login page or handle unauthorized access
                navigate('/admin/login');
            } else {
                setError('Failed to fetch customers: ' + (error.response?.data?.error || error.message));
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerDetails = async (customerId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/customers/${customerId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            // Handle the response data
            return response.data;
        } catch (error) {
            console.error('Error fetching customer details:', error);
            throw error;
        }
    };

    const handleViewCustomer = (userId) => {
        navigate(`/admin/customers/${userId}`);
    };

    const handleAddCustomer = () => {
        navigate('/admin/customer-signup');
    };

    const handleDisableCustomer = async (customerId) => {
        if (!window.confirm('Are you sure you want to disable this customer?')) {
            return;
        }

        setDisablingCustomer(customerId);
        try {
            const response = await axios.delete(`http://localhost:8000/api/delete-user/${customerId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            if (response.status === 200) {
                alert('Customer disabled successfully');
                fetchCustomers();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to disable customer';
            setError(errorMessage);
            console.error('Error:', error);
        } finally {
            setDisablingCustomer(null);
        }
    };

    const fetchCustomerRides = async (customerId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/customers/${customerId}/rides/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            // Handle response
        } catch (error) {
            console.error('Error fetching customer rides:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Container>
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Total Customers</Card.Title>
                            <Card.Text>{customers.length}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Active Customers</Card.Title>
                            <Card.Text>
                                {customers.filter(c => c.status === 'active').length}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Average Rating</Card.Title>
                            <Card.Text>
                                {customers.length > 0 
                                    ? (customers.reduce((sum, customer) => sum + (customer.rating || 0), 0) / customers.length).toFixed(1)
                                    : '0.0'
                                }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Customer Management</h2>
                <Button 
                    variant="primary" 
                    onClick={handleAddCustomer}
                >
                    Add New Customer
                </Button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => (
                        <tr key={customer.customer_id}>
                            <td>{customer.customer_id}</td>
                            <td>{`${customer.first_name} ${customer.last_name}`}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone_number}</td>
                            <td>{`${customer.city || 'N/A'}, ${customer.state || 'N/A'}`}</td>
                            <td>
                                <span className={`badge bg-${customer.status === 'active' ? 'success' : 'danger'}`}>
                                    {customer.status || 'active'}
                                </span>
                            </td>
                            <td>
                                <Button 
                                    variant="info" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleViewCustomer(customer.customer_id)}
                                >
                                    View
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleDisableCustomer(customer.customer_id)}
                                    disabled={customer.status === 'inactive' || disablingCustomer === customer.customer_id}
                                >
                                    {disablingCustomer === customer.customer_id ? 'Disabling...' : 'Disable'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ManageCustomers;