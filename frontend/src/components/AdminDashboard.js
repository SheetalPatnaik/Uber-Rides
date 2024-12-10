import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
//import './AdminDashboard.css';
import { baseUrl } from '../services/api-services';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <Container className="admin-dashboard mt-5">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h2>Admin Dashboard</h2>
          <div>
            <Button 
              variant="outline-primary" 
              className="mx-2"
              onClick={() => navigate('/admin/profile')}
            >
              Profile
            </Button>
            <Button 
              variant="outline-danger" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Col>
      </Row>

      <div className="general-info mb-4">
        <p>Choose an action to manage</p>
      </div>

      <div className="dashboard-buttons">
        <Row className="g-3">
          <Col md={6} lg={4}>
            <Button 
              as={Link} 
              to="/admin/manage-drivers" 
              variant="info" 
              className="dashboard-button w-100"
            >
              Manage Drivers
            </Button>
          </Col>
          <Col md={6} lg={4}>
            <Button 
              as={Link} 
              to="/admin/manage-customers" 
              variant="info" 
              className="dashboard-button w-100"
            >
              Manage Customers
            </Button>
          </Col>
          <Col md={6} lg={4}>
            <Button 
              as={Link} 
              to="/admin/billing" 
              variant="info" 
              className="dashboard-button w-100"
            >
              Manage Billing
            </Button>
          </Col>
          <Col md={6} lg={4}>
            <Button 
              as={Link} 
              to="/admin/visualization" 
              variant="info" 
              className="dashboard-button w-100"
            >
              View Statistics
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default AdminDashboard;