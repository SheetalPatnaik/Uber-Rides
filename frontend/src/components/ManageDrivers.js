import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../services/api-services';


const ManageDrivers = () => {
    const navigate = useNavigate();
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/api/driver/drivers/`);
            setDrivers(response.data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch drivers');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDriver = () => {
        navigate('/driver/signup');
        
    };

    const handleViewDriver = (driverId) => {
        navigate(`/admin/drivers/${driverId}`);
    };

    const handleDisable = async (driverId) => {
        try {
            const response = await fetch(`${baseUrl}/api/driver/delete-driver/${driverId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                console.log('Driver deleted successfully');
                // Refresh your driver list or update UI
            } else {
                console.error('Failed to delete driver');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Container>
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Total Drivers</Card.Title>
                            <Card.Text>{drivers.length}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Active Drivers</Card.Title>
                            <Card.Text>
                                {drivers.filter(driver => driver.status === 'available').length}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Inactive Drivers</Card.Title>
                            <Card.Text>
                                {drivers.filter(driver => driver.status === 'offline').length}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Driver Management</h2>
                <Button 
                    variant="primary" 
                    onClick={handleAddDriver}
                >
                    Add New Driver
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
                        <th>Driver ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Vehicle Type</th>
                        <th>Status</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map(driver => (
                        <tr key={driver.driver_id}>
                            <td>{driver.driver_id}</td>
                            <td>{`${driver.first_name} ${driver.last_name}`}</td>
                            <td>{driver.email}</td>
                            <td>{driver.phone_number}</td>
                            <td>{driver.vehicle_type}</td>
                            <td>
                                <span className={`badge bg-${driver.status === 'available' ? 'success' : 'danger'}`}>
                                    {driver.status}
                                </span>
                            </td>
                            <td>{driver.rating}</td>
                            <td>
                                <Button 
                                    variant="info" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleViewDriver(driver.driver_id)}
                                >
                                    View
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleDisable(driver.driver_id)}
                                >
                                    Disable
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ManageDrivers;

