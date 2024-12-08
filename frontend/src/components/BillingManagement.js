import React, { useState, useEffect } from 'react';
import { Container, Form, Table, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BillingManagement.css';

const BillingManagement = () => {
    const navigate = useNavigate();
    const [searchCriteria, setSearchCriteria] = useState({
        billing_id: '',
        start_date: '',
        end_date: '',
        driver_id: '',
        customer_id: ''
    });
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllBills();
    }, []);

    const fetchAllBills = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/billing/search/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            setBills(response.data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch bills');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const params = Object.fromEntries(
                Object.entries(searchCriteria).filter(([_, value]) => value !== '')
            );
            
            const response = await axios.get('http://localhost:8000/api/billing/search/', {
                params,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            setBills(response.data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch bills');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearchCriteria({
            billing_id: '',
            start_date: '',
            end_date: '',
            driver_id: '',
            customer_id: ''
        });
        fetchAllBills();
    };

    return (
        <Container>
            <div className="billing-header">
                <h2 className="mb-4">Billing Management</h2>
            </div>

            <Form onSubmit={handleSearch} className="search-form">
                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Billing ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={searchCriteria.billing_id}
                                onChange={(e) => setSearchCriteria({
                                    ...searchCriteria,
                                    billing_id: e.target.value
                                })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={searchCriteria.start_date}
                                onChange={(e) => setSearchCriteria({
                                    ...searchCriteria,
                                    start_date: e.target.value
                                })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={searchCriteria.end_date}
                                onChange={(e) => setSearchCriteria({
                                    ...searchCriteria,
                                    end_date: e.target.value
                                })}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <div className="d-flex gap-2">
                    <Button type="submit" variant="primary">
                        Search Bills
                    </Button>
                    <Button type="reset" variant="secondary" onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            </Form>

            {loading ? (
                <div className="text-center p-4">Loading...</div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <div className="bill-table">
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Bill ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Driver</th>
                                <th>Distance</th>
                                <th>Amount</th>
                                <th>Source</th>
                                <th>Destination</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map(bill => (
                                <tr key={bill.billing_id}>
                                    <td>{bill.billing_id}</td>
                                    <td>{new Date(bill.date).toLocaleDateString()}</td>
                                    <td>{bill.customer.first_name} {bill.customer.last_name}</td>
                                    <td>{bill.driver.first_name} {bill.driver.last_name}</td>
                                    <td>{bill.distance_covered} miles</td>
                                    <td className="amount-cell">${bill.total_amount}</td>
                                    <td>{bill.source_location}</td>
                                    <td>{bill.destination_location}</td>
                                    <td>
                                        <Button 
                                            variant="info" 
                                            size="sm"
                                            onClick={() => navigate(`/admin/bills/${bill.billing_id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    );
};

export default BillingManagement;