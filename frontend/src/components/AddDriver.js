import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DRIVER_REGISTER_URL = 'http://localhost:8000/driver/register/';

const AddDriver = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // Add other required fields for driver registration, like phone_number, vehicle details, etc.
  // Check your driver model fields

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      // Add other fields as required by your driver model
    };

    try {
      const response = await fetch(DRIVER_REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Driver added successfully!');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      } else {
        const errData = await response.json();
        setError(errData.error || 'Failed to add driver.');
      }
    } catch (err) {
      console.error('Add Driver error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="add-driver-container">
      <h2>Add Driver</h2>
      {error && <p className="text-danger">{error}</p>}
      {message && <p className="text-success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input 
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input 
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />
        <label>First Name</label>
        <input 
          type="text"
          value={firstName}
          onChange={(e)=>setFirstName(e.target.value)}
          required
        />
        <label>Last Name</label>
        <input 
          type="text"
          value={lastName}
          onChange={(e)=>setLastName(e.target.value)}
          required
        />
        {/* Add other driver fields as needed */}
        <button type="submit">Add Driver</button>
      </form>
    </div>
  );
};

export default AddDriver;
