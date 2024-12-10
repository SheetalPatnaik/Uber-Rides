import React from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import '../styles/HomePage.css';
import { NavLink } from 'react-router-dom';
import Footer from '../components/Footer';
import driverIllustration from '../images/1.jpg';
import { baseUrl } from '../services/api-services';


const HomePage = () => {
 return (
   <div className="homepage">
     <Nav className="navbar navbar-expand-lg navbar-dark bg-black py-3">
       <Container>
         <Nav.Item>
           <Nav.Link href="/" className="navbar-brand">Uber</Nav.Link>
         </Nav.Item>
         <Nav className="me-auto">
           <Nav.Link href="/customer/signup">Ride</Nav.Link>
           <Nav.Link href="/driver/signup">Drive</Nav.Link>
           <Nav.Link href="/admin/login">Admin</Nav.Link>
           <Nav.Link href="/">Uber Eats</Nav.Link>
           <Nav.Link href="/">About</Nav.Link>
         </Nav>
         <Nav>
           <NavLink to="/" className="nav-link">Help</NavLink>
           <NavLink to="/customer/login" className="nav-link">Customer Login</NavLink>
           {/* <NavLink to="/customer/signup" className="nav-link">
             <Button variant="light" className="sign-up-btn">Customer Sign up</Button>
           </NavLink> */}
           <NavLink to="/driver/login" className="nav-link">Driver Login</NavLink>
           {/* <NavLink to="/driver/signup" className="nav-link">
             <Button variant="light" className="sign-up-btn">Driver Sign up</Button>
           </NavLink> */}
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
             <NavLink to="/driver/login" className="text-decoration-none">
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