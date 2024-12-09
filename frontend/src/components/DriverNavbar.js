// components/DriverNavbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/DriverNavbar.css';


const DriverNavbar = () => {
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
        
         <NavLink
           to="/logout"
           className="dn-nav-link dn-logout"
         >
           Logout
         </NavLink>
       </div>
     </div>
   </nav>
 );
};


export default DriverNavbar;