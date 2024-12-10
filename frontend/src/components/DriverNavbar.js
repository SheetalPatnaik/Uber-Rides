// components/DriverNavbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/DriverNavbar.css';
import { baseUrl } from '../services/api-services';


const DriverNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('customerData');
    
    // Redirect to login page
    navigate('/driver/login');
  };
 return (
   <nav className="dn-navbar">
     <div className="dn-container">
       <NavLink to="/driver/home" className="dn-brand">
         Uber Drive
       </NavLink>
      
       <div className="dn-nav-links">
         <NavLink
           to="/driver/home"
           className={({ isActive }) =>
             isActive ? "dn-nav-link dn-active" : "dn-nav-link"
           }
         >
           Home
         </NavLink>
        
         <NavLink
           to="/driver/ratings"
           className={({ isActive }) =>
             isActive ? "dn-nav-link dn-active" : "dn-nav-link"
           }
         >
           Ratings
         </NavLink>
        
         <NavLink
           to="/driver/rides"
           className={({ isActive }) =>
             isActive ? "dn-nav-link dn-active" : "dn-nav-link"
           }
         >
           Rides
         </NavLink>
        
         <NavLink
           to="/driver/profile"
           className={({ isActive }) =>
             isActive ? "dn-nav-link dn-active" : "dn-nav-link"
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


export default DriverNavbar;