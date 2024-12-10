import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../services/api-services';

const CustomerDetails = () => {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [rideHistory, setRideHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCustomerDetails();
    }, [customerId]);

    const fetchCustomerDetails = async () => {
        try {
            setLoading(true);
            const [customerResponse, ridesResponse] = await Promise.all([
                axios.get(`${baseUrl}/api/customers/${customerId}/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                }),
                axios.get(`${baseUrl}/api/customers/${customerId}/rides/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                })
            ]);

            setCustomer(customerResponse.data);
            setRideHistory(ridesResponse.data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch customer details');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!customer) return <div>Customer not found</div>;

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Customer Details</h2>
                <Button 
                    variant="secondary" 
                    onClick={() => navigate('/admin/manage-customers')}
                >
                    Back to Customers
                </Button>
            </div>

            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h4>Personal Information</h4>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Customer ID:</strong> {customer.customer_id}</p>
                            <p><strong>Name:</strong> {`${customer.first_name} ${customer.last_name}`}</p>
                            <p><strong>Email:</strong> {customer.email}</p>
                            <p><strong>Phone:</strong> {customer.phone_number}</p>
                            <p><strong>Status:</strong> 
                                <span className={`badge bg-${customer.status === 'active' ? 'success' : 'danger'} ms-2`}>
                                    {customer.status}
                                </span>
                            </p>
                            <p><strong>Rating:</strong> {customer.rating}</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h4>Address Information</h4>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Address:</strong> {customer.address}</p>
                            <p><strong>City:</strong> {customer.city}</p>
                            <p><strong>State:</strong> {customer.state}</p>
                            <p><strong>Zipcode:</strong> {customer.zipcode}</p>
                            <p><strong>Current Location:</strong> {customer.current_location_lat}, {customer.current_location_lng}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card>
                <Card.Header>
                    <h4>Ride History</h4>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Ride ID</th>
                                <th>Date</th>
                                <th>Driver</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rideHistory.map(ride => (
                                <tr key={ride.id}>
                                    <td>{ride.id}</td>
                                    <td>{new Date(ride.created_at).toLocaleDateString()}</td>
                                    <td>{ride.driver_name}</td>
                                    <td>{ride.pickup_location}</td>
                                    <td>{ride.drop_location}</td>
                                    <td>
                                        <span className={`badge bg-${ride.status === 'completed' ? 'success' : 'warning'}`}>
                                            {ride.status}
                                        </span>
                                    </td>
                                    <td>${ride.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CustomerDetails;