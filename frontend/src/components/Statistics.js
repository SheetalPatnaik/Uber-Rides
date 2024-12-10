// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card } from 'react-bootstrap';
// import axios from 'axios';
// import {
//     LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts';

// const Statistics = () => {
//     const [revenueData, setRevenueData] = useState([]);
//     const [areaRides, setAreaRides] = useState([]);
//     const [driverRides, setDriverRides] = useState([]);
//     const [customerRides, setCustomerRides] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchStatistics();
//     }, []);

//     const fetchStatistics = async () => {
//         try {
//             const [revenueResponse, areaResponse, driverResponse, customerResponse] = await Promise.all([
//                 
//             ]);

//             setRevenueData(revenueResponse.data);
//             setAreaRides(areaResponse.data);
//             setDriverRides(driverResponse.data);
//             setCustomerRides(customerResponse.data);
//             setError(null);
//         } catch (error) {
//             setError('Failed to fetch statistics');
//             console.error('Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div className="alert alert-danger">{error}</div>;

//     return (
//         <Container>
//             <h2 className="mb-4">Statistics Dashboard</h2>
            
//             <Card className="mb-4">
//                 <Card.Header>Daily Revenue</Card.Header>
//                 <Card.Body>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <LineChart data={revenueData}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="date" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
//                         </LineChart>
//                     </ResponsiveContainer>
//                 </Card.Body>
//             </Card>

//             <Row>
//                 <Col md={6}>
//                     <Card className="mb-4">
//                         <Card.Header>Rides by Area</Card.Header>
//                         <Card.Body>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <BarChart data={areaRides}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="area" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="rides" fill="#82ca9d" />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>

//                 <Col md={6}>
//                     <Card className="mb-4">
//                         <Card.Header>Rides by Driver</Card.Header>
//                         <Card.Body>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <BarChart data={driverRides}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="driver_name" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Legend />
//                                     <Bar dataKey="rides" fill="#8884d8" />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             <Card className="mb-4">
//                 <Card.Header>Rides by Customer</Card.Header>
//                 <Card.Body>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={customerRides}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="customer_name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="rides" fill="#ffc658" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </Card.Body>
//             </Card>
//         </Container>
//     );
// };

// export default Statistics;


import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { baseUrl } from '../services/api-services';

const Statistics = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [areaRides, setAreaRides] = useState([]);
    const [driverRides, setDriverRides] = useState([]);
    const [customerRides, setCustomerRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMockStatistics();
    }, []);

    const fetchMockStatistics = () => {
        try {
            // Mock data
            const mockRevenueData = [
                { date: '2023-10-01', revenue: 200 },
                { date: '2023-10-02', revenue: 300 },
                { date: '2023-10-03', revenue: 250 },
            ];

            const mockAreaRides = [
                { area: 'Downtown', rides: 50 },
                { area: 'Uptown', rides: 30 },
            ];

            const mockDriverRides = [
                { driver_name: 'John Doe', rides: 20 },
                { driver_name: 'Jane Smith', rides: 25 },
            ];

            const mockCustomerRides = [
                { customer_name: 'Alice Johnson', rides: 15 },
                { customer_name: 'Bob Brown', rides: 10 },
            ];

            setRevenueData(mockRevenueData);
            setAreaRides(mockAreaRides);
            setDriverRides(mockDriverRides);
            setCustomerRides(mockCustomerRides);
            setError(null);
        } catch (error) {
            setError('Failed to fetch statistics');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <Container>
            <h2 className="mb-4">Statistics Dashboard</h2>
            
            <Card className="mb-4">
                <Card.Header>Daily Revenue</Card.Header>
                <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>

            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>Rides by Area</Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={areaRides}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="area" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="rides" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>Rides by Driver</Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={driverRides}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="driver_name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="rides" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="mb-4">
                <Card.Header>Rides by Customer</Card.Header>
                <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={customerRides}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="customer_name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="rides" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Statistics;