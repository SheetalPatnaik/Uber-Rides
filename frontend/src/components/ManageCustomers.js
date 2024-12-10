import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../services/api-services';


const ManageCustomers = () => {
   const navigate = useNavigate();
   const [customers, setCustomers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);


   useEffect(() => {
       fetchCustomers();
   }, []);


   const fetchCustomers = async () => {
       try {
           setLoading(true);
           const response = await axios.get(`${baseUrl}/api/users/`, {  // Adjusted URL

           });
           setCustomers(response.data);
           setError(null);
       } catch (error) {
           setError('Failed to fetch customers');
           console.error('Error:', error);
       } finally {
           setLoading(false);
       }
   };


   const handleViewCustomer = (userId) => {
       navigate(`/admin/customers/${userId}`);
   };


   const handleAddCustomer = () => {
       navigate('/admin/customer-signup');
   };


   const handleDisableCustomer = async (customerId) => {
       try {
           await axios.delete(`${baseUrl}/api/delete-user/${customerId}/`, {
               headers: {
                   'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
               }
           });
           fetchCustomers(); // Refresh the list
       } catch (error) {
           setError('Failed to disable customer');
           console.error('Error:', error);
       }
   };


   const fetchCustomerRides = async (customerId) => {
       try {
           const response = await axios.get(`${baseUrl}/api/customers/${customerId}/rides/`, {
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
                                   disabled={customer.status === 'inactive'}
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


export default ManageCustomers;