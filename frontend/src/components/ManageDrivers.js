import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


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
            const response = await axios.get('http://localhost:8000/api/driver/drivers/');
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
        navigate('/admin/driver-signup');
    };

    const handleViewDriver = (driverId) => {
        navigate(`/admin/drivers/${driverId}`);
    };

    const handleDisableDriver = async (driverId) => {
        try {
            await axios.delete(`http://localhost:8000/api/driver/delete-driver/${driverId}/`, {
            headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }   
            });
            fetchDrivers();
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to disable driver');
            
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
                                    onClick={() => handleDisableDriver(driver.driver_id)}
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
// import React, { useState } from 'react';
// import { Table, Button, Container, Row, Col, Card } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// // Mock data
// const MOCK_DRIVERS = [
//     {
//         driver_id: "123-45-6789",
//         first_name: "John",
//         last_name: "Doe",
//         email: "john.doe@example.com",
//         phone_number: "(555) 123-4567",
//         vehicle_type: "sedan",
//         status: "available",
//         rating: 4.8
//     },
//     {
//         driver_id: "987-65-4321",
//         first_name: "Jane",
//         last_name: "Smith",
//         email: "jane.smith@example.com",
//         phone_number: "(555) 987-6543",
//         vehicle_type: "suv",
//         status: "offline",
//         rating: 4.9
//     }
// ];

// const ManageDrivers = () => {
//     const navigate = useNavigate();
//     // Initialize drivers state with mock data directly
//     const [drivers] = useState(MOCK_DRIVERS);

//     const handleViewDriver = (driverId) => {
//         navigate(`/admin/drivers/${driverId}`);
//     };

//     const handleAddDriver = () => {
//         navigate('/admin/driver-signup');
//     };

//     return (
//         <Container>
//             <Row className="mb-4">
//                 <Col md={4}>
//                     <Card className="text-center">
//                         <Card.Body>
//                             <Card.Title>Total Drivers</Card.Title>
//                             <Card.Text>{drivers.length}</Card.Text>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={4}>
//                     <Card className="text-center">
//                         <Card.Body>
//                             <Card.Title>Active Drivers</Card.Title>
//                             <Card.Text>
//                                 {drivers.filter(d => d.status === 'available').length}
//                             </Card.Text>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={4}>
//                     <Card className="text-center">
//                         <Card.Body>
//                             <Card.Title>Inactive Drivers</Card.Title>
//                             <Card.Text>
//                                 {drivers.filter(d => d.status === 'offline').length}
//                             </Card.Text>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h2>Driver Management</h2>
//                 <Button 
//                     variant="primary" 
//                     onClick={handleAddDriver}
//                 >
//                     Add New Driver
//                 </Button>
//             </div>

//             <Table striped bordered hover responsive>
//                 <thead>
//                     <tr>
//                         <th>Driver ID</th>
//                         <th>Name</th>
//                         <th>Email</th>
//                         <th>Phone</th>
//                         <th>Vehicle Type</th>
//                         <th>Status</th>
//                         <th>Rating</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {drivers.map(driver => (
//                         <tr key={driver.driver_id}>
//                             <td>{driver.driver_id}</td>
//                             <td>{`${driver.first_name} ${driver.last_name}`}</td>
//                             <td>{driver.email}</td>
//                             <td>{driver.phone_number}</td>
//                             <td>{driver.vehicle_type}</td>
//                             <td>
//                                 <span className={`badge bg-${driver.status === 'available' ? 'success' : 'danger'}`}>
//                                     {driver.status}
//                                 </span>
//                             </td>
//                             <td>{driver.rating}</td>
//                             <td>
//                                 <Button 
//                                     variant="info" 
//                                     size="sm" 
//                                     className="me-2"
//                                     onClick={() => handleViewDriver(driver.driver_id)}
//                                 >
//                                     View
//                                 </Button>
//                                 <Button 
//                                     variant="danger" 
//                                     size="sm"
//                                 >
//                                     Disable
//                                 </Button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </Container>
//     );
// };

// export default ManageDrivers;

