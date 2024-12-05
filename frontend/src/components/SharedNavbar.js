// components/SharedNavbar.js
import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';


const SharedNavbar = () => {
 const { userData } = useUser();


 return (
   <Nav className="shared-navbar navbar-dark bg-black py-3">
     <Container fluid>
       <div className="shared-navbar-content">
         <NavLink to="/" className="shared-navbar-brand">
           Uber
         </NavLink>
         <div className="shared-navbar-links">
           <NavLink to="/driver/home">Home</NavLink>
           <NavLink to="/driver/earnings">Earnings</NavLink>
           <NavLink to="/driver/ratings">Ratings</NavLink>
           <NavLink to="/driver/profile">Profile</NavLink>
         </div>
         {userData.profilePhoto && (
           <div className="shared-navbar-profile">
             <img
               src={userData.profilePhoto}
               alt="Profile"
               className="shared-navbar-avatar"
             />
             <span className="shared-navbar-name">
               {userData.firstName} {userData.lastName}
             </span>
           </div>
         )}
       </div>
     </Container>
   </Nav>
 );
};


export default SharedNavbar;