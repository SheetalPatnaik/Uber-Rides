import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/CustomerLogin.css';
import { baseUrl } from '../services/api-services';
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
      const response = await axios.post(`${baseUrl}/api/login/`, {
        customer_id: customerId,
        password: password,
      });

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("customer_id", response.data.customer_id);

      setSuccess("Login successful!");
      navigate("/customer/dashboard");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Login failed.");
      } else {
        setError("An error occurred while logging in.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Customer Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="customer_id">Customer ID:</label>
          <input
            type="text"
            id="customer_id"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
      {success && <p className="message success-message">{success}</p>}
      {error && <p className="message error-message">{error}</p>}
    </div>
  );
};

export default CustomerLogin;

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import '../styles/CustomerLogin.css';

// const CustomerLogin = () => {
//   const navigate = useNavigate();
//   const [customerId, setCustomerId] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       
//         customer_id: customerId,
//         password: password,
//       });

//       localStorage.setItem("access_token", response.data.access_token);
//       localStorage.setItem("refresh_token", response.data.refresh_token);
//       localStorage.setItem("customer_id", response.data.customer_id);

//       setSuccess("Login successful!");
//       navigate("/customer/dashboard");
//     } catch (error) {
//       if (error.response && error.response.data) {
//         setError(error.response.data.error || "Login failed.");
//       } else {
//         setError("An error occurred while logging in.");
//       }
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Customer Login</h2>
//       <form className="login-form" onSubmit={handleLogin}>
//         <div className="form-group">
//           <label htmlFor="customer_id">Customer ID:</label>
//           <input
//             type="text"
//             id="customer_id"
//             value={customerId}
//             onChange={(e) => setCustomerId(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="login-btn">
//           Login
//         </button>
//       </form>
//       {success && <p className="message success-message">{success}</p>}
//       {error && <p className="message error-message">{error}</p>}
//     </div>
//   );
// };

// export default CustomerLogin;