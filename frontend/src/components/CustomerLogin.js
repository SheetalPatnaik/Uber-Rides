import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        customer_id: customerId,
        password: password,
      });

      // Store tokens in localStorage
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("customer_id", response.data.customer_id);

      setSuccess("Login successful!");
      console.log("Access Token:", response.data.access_token);
      console.log("Refresh Token:", response.data.refresh_token);
      console.log("Customer ID:", response.data.customer_id);
      navigate("/customer/book-ride");
      // Redirect to the customer dashboard or another page
      
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Login failed.");
      } else {
        setError("An error occurred while logging in.");
      }
    }
  };

  return (
    <div>
      <h2>Customer Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="customer_id">Customer ID:</label>
          <input
            type="text"
            id="customer_id"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CustomerLogin;