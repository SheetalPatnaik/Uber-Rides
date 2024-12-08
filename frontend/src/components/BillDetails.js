import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BillDetails.css';

const BillDetails = () => {
    const { billId } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBillDetails();
    }, [billId]);

    const fetchBillDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8000/api/billing/${billId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            setBill(response.data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch bill details');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-5">Loading...</div>;
    if (error) return <div className="alert alert-danger m-5">{error}</div>;
    if (!bill) return <div className="alert alert-warning m-5">Bill not found</div>;

    return (
        <Container className="bill-details-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Bill Details</h2>
                <Button 
                    variant="secondary" 
                    onClick={() => navigate('/admin/billing')}
                >
                    Back to Billing
                </Button>
            </div>

            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header className="bg-primary text-white">
                            <h4>Billing Information</h4>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Bill ID:</strong> {bill.billing_id}</p>
                            <p><strong>Date:</strong> {new Date(bill.date).toLocaleDateString()}</p>
                            <p><strong>Total Amount:</strong> <span className="text-success">${bill.total_amount}</span></p>
                            <p><strong>Distance:</strong> {bill.distance_covered} miles</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header className="bg-info text-white">
                            <h4>Time Details</h4>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Pickup Time:</strong> {new Date(bill.pickup_time).toLocaleString()}</p>
                            <p><strong>Drop-off Time:</strong> {new Date(bill.drop_off_time).toLocaleString()}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header className="bg-success text-white">
                            <h4>Customer Details</h4>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Name:</strong> {bill.customer.first_name} {bill.customer.last_name}</p>
                            <p><strong>Email:</strong> {bill.customer.email}</p>
                            <p><strong>Phone:</strong> {bill.customer.phone_number}</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header className="bg-warning text-dark">
                            <h4>Driver Details</h4>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Name:</strong> {bill.driver.first_name} {bill.driver.last_name}</p>
                            <p><strong>Email:</strong> {bill.driver.email}</p>
                            <p><strong>Phone:</strong> {bill.driver.phone_number}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card>
                <Card.Header className="bg-secondary text-white">
                    <h4>Location Details</h4>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Source Location:</strong></p>
                            <p className="text-muted">{bill.source_location}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Destination Location:</strong></p>
                            <p className="text-muted">{bill.destination_location}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BillDetails;