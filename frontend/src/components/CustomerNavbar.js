// components/CustomerNavbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/CustomerNavbar.css';
import { baseUrl } from '../services/api-services';


const CustomerNavbar = () => {
  const navigate = useNavigate();


  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('customerData');
    
    // Redirect to login page
    navigate('/customer/login');
  };


  return (
    <nav className="cn-navbar">
      <div className="cn-container">
        <NavLink to="/customer/dashboard" className="cn-brand">
          Uber Ride
        </NavLink>
        
        <div className="cn-nav-links">
          <NavLink
            to="/customer/dashboard"
            className={({ isActive }) =>
              isActive ? "cn-nav-link cn-active" : "cn-nav-link"
            }
          >
            Home
          </NavLink>
          
          <NavLink
            to="/customer/book-ride"
            className={({ isActive }) =>
              isActive ? "cn-nav-link cn-active" : "cn-nav-link"
            }
          >
            Book Ride
          </NavLink>
          
          <NavLink
            to="/customer/rides"
            className={({ isActive }) =>
              isActive ? "cn-nav-link cn-active" : "cn-nav-link"
            }
          >
            My Rides
          </NavLink>
          
          <NavLink
            to="/customer/profile"
            className={({ isActive }) =>
              isActive ? "cn-nav-link cn-active" : "cn-nav-link"
            }
          >
            Profile
          </NavLink>
          
          <button
            onClick={handleLogout}
            className="cn-nav-link cn-logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};


export default CustomerNavbar;
