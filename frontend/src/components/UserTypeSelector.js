import React, { useState } from 'react';
import { Button, Container, Row, Col, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl } from '../services/api-services';

const UserTypeSelector = () => {
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const handleSelectUserType = (type) => {
    setUserType(type);
    if (type === 'customer') {
      navigate('/customer-signup');
    } else {
      // Handle other user types (e.g., driver)
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#">Uber Clone</Navbar.Brand>
      </Navbar>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={4}>
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <h2 style={{ marginBottom: '30px', fontFamily: 'Arial, sans-serif' }}>Select User Type</h2>
              <Button
                variant="primary"
                block
                style={{
                  marginBottom: '15px',
                  fontSize: '16px',
                  padding: '15px',
                  borderRadius: '8px',
                }}
                onClick={() => handleSelectUserType('customer')}
              >
                Customer
              </Button>
              <Button
                variant="secondary"
                block
                style={{
                  fontSize: '16px',
                  padding: '15px',
                  borderRadius: '8px',
                }}
                onClick={() => handleSelectUserType('driver')}
              >
                Driver
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserTypeSelector;
