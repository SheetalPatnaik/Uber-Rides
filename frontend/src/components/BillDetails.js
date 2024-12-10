import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Table } from 'react-bootstrap';
import CustomerNavbar from './CustomerNavbar';
import { baseUrl } from '../services/api-services';

const BillDetails = () => {
  const { rideId } = useParams(); // Get rideId from URL
  const [bill, setBill] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/billing/get-bill/${rideId}/`, {
        });
        setBill(response.data);
      } catch (err) {
        setError('Failed to fetch bill details');
        console.error('Error fetching bill details:', err);
      }
    };

    fetchBillDetails();
  }, [rideId]);

  if (error) {
    return <Container><p>{error}</p></Container>;
  }

  if (!bill) {
    return <Container><p>Loading...</p></Container>;
  }

  return (
    <div className="bd-wrapper">
      <CustomerNavbar />
    <Container>
      <h2>Bill Details</h2>
      <Table striped bordered>
        <tbody>
          <tr>
            <td>Billing ID</td>
            <td>{bill.billing_id}</td>
          </tr>
          <tr>
            <td>Bill Date</td>
            <td>{bill.bill_date}</td>
          </tr>
          <tr>
            <td>Pickup Time</td>
            <td>{bill.pickup_time}</td>
          </tr>
          <tr>
            <td>Drop-off Time</td>
            <td>{bill.drop_off_time}</td>
          </tr>
          <tr>
            <td>Distance Covered</td>
            <td>{bill.distance_covered} miles</td>
          </tr>
          <tr>
            <td>Total Amount</td>
            <td>${bill.total_amount}</td>
          </tr>
          <tr>
            <td>Source Location</td>
            <td>{bill.source_location}</td>
          </tr>
          <tr>
            <td>Destination Location</td>
            <td>{bill.destination_location}</td>
          </tr>
          <tr>
            <td>Driver ID</td>
            <td>{bill.driver_id}</td>
          </tr>
          <tr>
            <td>Customer ID</td>
            <td>{bill.customer_id}</td>
          </tr>
        </tbody>
      </Table>
    </Container>
    </div>
  );
};

export default BillDetails;