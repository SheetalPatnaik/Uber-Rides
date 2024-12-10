import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import '../styles/RideDetailPage.css';
import CustomerNavbar from './CustomerNavbar';
import { baseUrl } from '../services/api-services';


const RideDetailPage = () => {
 const { rideId } = useParams();
 const [rideDetails, setRideDetails] = useState(null);
 const [review, setReview] = useState({ rating: 0, content: '' });
 const [newReview, setNewReview] = useState({rating: 0, content: ''});
 const [error, setError] = useState('');
 const [message, setMessage] = useState('');


 useEffect(() => {
   fetchRideDetails(); 
 }, [rideId]);


 const fetchRideDetails = () => {
   axios.get(`${baseUrl}/api/ride/${rideId}/detail/`, {
       headers: {
         'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
       },
     })
       .then(response => {
         setRideDetails(response.data.ride_details);
         if (response.data.review) {
           setReview(response.data.review);
         }
       })
       .catch(err => {
         setError('Failed to fetch ride details');
       });
 };


 const handleSubmitReview = (e) => {
   e.preventDefault();
   axios.post(`${baseUrl}/api/add-review/${rideId}/`, newReview, {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
     },
   })
     .then(response => {
       setMessage('Review added successfully!');
       fetchRideDetails();
     })
     .catch(err => {
       setError('Failed to add review');
     });
 };


 if (!rideDetails) {
   return <div className="rdp-loading">Loading ride details...</div>;
 }


 return (
  <div className="rdp-wrapper">
      <CustomerNavbar />
   <Container className="rdp-container">
     <h2 className="rdp-title">Ride Details</h2>
     <Row className="rdp-details">
       <Col>
         <p><strong>Driver ID:</strong> {rideDetails.driver_id}</p>
         <p><strong>Pickup Location:</strong> {rideDetails.pickup_location}</p>
         <p><strong>Dropoff Location:</strong> {rideDetails.dropoff_location}</p>
         <p><strong>Pickup Time:</strong> {rideDetails.pickup_time}</p>
         <p><strong>Dropoff Time:</strong> {rideDetails.drop_off_time}</p>
       </Col>
     </Row>


     <h3 className="rdp-review-title">Add Review</h3>
     {review && review.rating ? (
       <div className="rdp-existing-review">
         <p><strong>Your Review:</strong></p>
         <p><strong>Rating:</strong> {review.rating} / 5</p>
         <p><strong>Content:</strong> {review.content}</p>
       </div>
     ) : (
       <Form onSubmit={handleSubmitReview} className="rdp-review-form">
         <Form.Group>
           <Form.Label>Rating (1-5)</Form.Label>
           <Form.Control
             type="number"
             value={newReview.rating}
             onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
             min="1" max="5"
             className="rdp-rating-input"
           />
         </Form.Group>
         <Form.Group>
           <Form.Label>Content</Form.Label>
           <Form.Control
             as="textarea"
             rows={3}
             value={newReview.content}
             onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
             className="rdp-content-input"
           />
         </Form.Group>
         <Button type="submit" className="rdp-submit-btn">Submit Review</Button>
       </Form>
     )}


     {error && <div className="rdp-error">{error}</div>}
     {message && <div className="rdp-success">{message}</div>}
   </Container>
   </div>
 );
};


export default RideDetailPage;