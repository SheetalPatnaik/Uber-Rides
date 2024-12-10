import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { baseUrl } from '../services/api-services';

const DriverDetails = () => {
    const { driverId } = useParams();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDriverDetails = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/driver/drivers/${driverId}/`);
                setDriver(response.data);
            } catch (error) {
                setError('Failed to fetch driver details');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDriverDetails();
    }, [driverId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!driver) return <div>Driver not found</div>;

    return (
        <Container>
            <h2>Driver Details</h2>
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Img variant="top" src={driver.profile_photo} />
                        <Card.Body>
                            <Card.Title>{`${driver.first_name} ${driver.last_name}`}</Card.Title>
                            <Card.Text>
                                <strong>Driver ID:</strong> {driver.driver_id}<br />
                                <strong>Email:</strong> {driver.email}<br />
                                <strong>Phone:</strong> {driver.phone_number}<br />
                                <strong>Status:</strong> {driver.status}<br />
                                <strong>Rating:</strong> {driver.rating}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <h4>Vehicle Information</h4>
                            <p>
                                <strong>Vehicle Type:</strong> {driver.vehicle_type}<br />
                                <strong>Vehicle Model:</strong> {driver.vehicle_model}<br />
                                <strong>Vehicle Plate:</strong> {driver.vehicle_plate}<br />
                                <strong>License Number:</strong> {driver.license_number}
                            </p>
                            
                            <h4>Address Information</h4>
                            <p>
                                <strong>Address:</strong> {driver.address}<br />
                                <strong>City:</strong> {driver.city}<br />
                                <strong>State:</strong> {driver.state}<br />
                                <strong>Zipcode:</strong> {driver.zipcode}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DriverDetails;