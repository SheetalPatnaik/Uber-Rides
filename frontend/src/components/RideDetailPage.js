import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const RideDetailPage = () => {
  const { rideId } = useParams(); // Get the booking ID from the URL
  const [rideDetails, setRideDetails] = useState(null);
  const [review, setReview] = useState({ rating: 0, content: '' });
  const [newReview, setNewReview] = useState({rating: 0, content: ''});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch ride details from the API
   fetchRideDetails();   
  }, [rideId]);
  const fetchRideDetails = () => {
    // Fetch ride details from the API
    axios.get(`http://localhost:8000/api/ride/${rideId}/detail/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then(response => {
          setRideDetails(response.data.ride_details);
          if (response.data.review) {
            setReview(response.data.review);  // If review already exists, set it
          }
        })
        .catch(err => {
          setError('Failed to fetch ride details');
        });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Send review data to the API
    axios.post(`http://localhost:8000/api/add-review/${rideId}/`, newReview, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then(response => {
        setMessage('Review added successfully!');
        fetchRideDetails(); // Refresh ride details
      })
      .catch(err => {
        setError('Failed to add review');
      });
  };

  if (!rideDetails) {
    return <div>Loading ride details...</div>;
  }

  return (
    <Container>
      <h2>Ride Details</h2>
      <Row>
        <Col>
          <p><strong>Driver ID:</strong> {rideDetails.driver_id}</p>
          <p><strong>Pickup Location:</strong> {rideDetails.pickup_location}</p>
          <p><strong>Dropoff Location:</strong> {rideDetails.dropoff_location}</p>
          <p><strong>Pickup Time:</strong> {rideDetails.pickup_time}</p>
          <p><strong>Dropoff Time:</strong> {rideDetails.drop_off_time}</p>
        </Col>
      </Row>

      {/* Review Section */}
      <h3>Add Review</h3>
      {review && review.rating  ? (
        <div>
          <p><strong>Your Review:</strong></p>
          <p><strong>Rating:</strong> {review.rating} / 5</p>
          <p><strong>Content:</strong> {review.content}</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmitReview}>
          <Form.Group>
            <Form.Label>Rating (1-5)</Form.Label>
            <Form.Control
              type="number"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
              min="1" max="5"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
            />
          </Form.Group>
          <Button type="submit">Submit Review</Button>
        </Form>
      )}

      {/* Error and Success Messages */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {message && <div style={{ color: 'green' }}>{message}</div>}
    </Container>
  );
};

export default RideDetailPage;