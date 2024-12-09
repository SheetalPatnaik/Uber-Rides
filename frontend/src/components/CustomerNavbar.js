import React from 'react';
import { NavLink } from 'react-router-dom';
import  '../styles/CustomerNavbar.css';


const CustomerNavbar = () => {
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
        
         <NavLink
           to="/logout"
           className="cn-nav-link cn-logout"
         >
           Logout
         </NavLink>
       </div>
     </div>
   </nav>
 );
};


export default CustomerNavbar;