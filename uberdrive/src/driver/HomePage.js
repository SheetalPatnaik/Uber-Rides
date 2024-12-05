import React from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import '../styles/HomePage.css';
import { NavLink } from 'react-router-dom';
import Footer from '../components/Footer';
import driverIllustration from '../images/1.jpg';


const HomePage = () => {
  return (
    <div className="homepage">
      <Nav className="navbar navbar-expand-lg navbar-dark bg-black py-3">
        <Container>
          <Nav.Item>
            <Nav.Link href="/" className="navbar-brand">Uber</Nav.Link>
          </Nav.Item>
          <Nav className="me-auto">
            <Nav.Link href="/ride">Ride</Nav.Link>
            <Nav.Link href="/driver/dashboard">Drive</Nav.Link>
            <Nav.Link href="/business">Business</Nav.Link>
            <Nav.Link href="/uber-eats">Uber Eats</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
          <Nav>
  <NavLink to="/help" className="nav-link">Help</NavLink>
  <NavLink to="/login" className="nav-link">Log in</NavLink>
  <NavLink to="/signup" className="nav-link">
    <Button variant="light" className="sign-up-btn">Sign up</Button>
  </NavLink>
</Nav>
        </Container>
      </Nav>

      <Container className="main-content py-5">
        <Row className="align-items-center">
          <Col lg={6} md={12} className="mb-4 mb-lg-0">
            <img 
              src={driverIllustration} 
              alt="Driver Illustration" 
              className="driver-illustration"
            />
          </Col>
          <Col lg={6} md={12}>
            <h1 className="display-4 fw-bold mb-4">
              Drive when you want, make what you need
            </h1>
            <p className="lead mb-4">
              Make money on your schedule with deliveries or rides—or both. 
              You can use your own car or choose a rental through Uber.
            </p>
            <div className="d-flex gap-3">
            <NavLink to="/signup">
                <Button variant="dark" size="lg">Get started</Button>
              </NavLink>
              <NavLink to="/login" className="text-decoration-none">
                <Button variant="link" className="text-dark">
                  Already have an account? Sign in
                </Button>
              </NavLink>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default HomePage;
