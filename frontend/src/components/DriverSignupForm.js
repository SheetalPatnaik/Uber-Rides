// import React, { useState } from 'react';
// import { Container } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/DriverSignupForm.css';
// import { useNavigate } from 'react-router-dom';

// const VEHICLE_TYPES = [
//   { value: 'sedan', label: 'Sedan' },
//   { value: 'suv', label: 'SUV' },
//   { value: 'van', label: 'Van' },
//   { value: 'luxury', label: 'Luxury' },
// ];

// const STATUS_CHOICES = [
//   { value: 'available', label: 'Available' },
//   { value: 'busy', label: 'Busy' },
//   { value: 'offline', label: 'Offline' },
// ];

// const DriverSignupForm = () => {
//   const [formData, setFormData] = useState({
//     driver_id: '',
//     email: '',
//     password: '',
//     first_name: '',
//     last_name: '',
//     phone_number: '',
//     address: '',
//     city: '',
//     state: '',
//     zipcode: '',
//     vehicle_type: '',
//     vehicle_model: '',
//     vehicle_plate: '',
//     license_number: '',
//     status: 'offline',
//     rating: 5.00,
//     total_trips: 0,
//     current_location_lat: null,
//     current_location_lng: null,
//     introduction_video: null,
//     profile_photo: null,
//   });
//   const navigate = useNavigate();
//   const [previewImage, setPreviewImage] = useState(null);
//   const [message, setMessage] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData(prev => ({
//         ...prev,
//         [name]: files[0],
//       }));
//       if (name === 'profile_photo') {
//         setPreviewImage(URL.createObjectURL(files[0]));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const data = new FormData();
//   //   Object.entries(formData).forEach(([key, value]) => {
//   //     if (value !== null) data.append(key, value);
//   //   });

//   //   try {
//   //     
//   //       headers: { 'Content-Type': 'multipart/form-data' },
//   //     });
//   //     setMessage('Driver registered successfully!');
//   //   } catch (error) {
//   //     setMessage(error.response?.data?.error || 'Registration failed');
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (value !== null) data.append(key, value);
//     });

//     try {
//     
//         headers: { 
//           'Content-Type': 'multipart/form-data',
//         },
//         withCredentials: true
//       });
//       setMessage('Driver registered successfully!');
//       setTimeout(() => {
//         navigate('/driver/login');
//       }, 2000);
//     } catch (error) {
//       setMessage(error.response?.data?.error || 'Registration failed');
//     }
//   };


//   return (
//     <div className="driver-signup">
//       <Container className="driver-signup-container">
//         <div className="driver-signup-form-wrapper">
//           <h2 className="driver-signup-title">Driver Registration</h2>
//           {message && <p className="driver-signup-message">{message}</p>}
          
//           <form onSubmit={handleSubmit} className="driver-signup-form">
//             <div className="driver-signup-photo-section">
//               <div className="driver-signup-photo-preview">
//                 {previewImage ? (
//                   <img src={previewImage} alt="Profile preview" />
//                 ) : (
//                   <div className="driver-signup-photo-placeholder">
//                     <span>Profile Photo</span>
//                   </div>
//                 )}
//               </div>
//               <input 
//                 type="file" 
//                 accept="image/*" 
//                 name="profile_photo" 
//                 onChange={handleInputChange}
//               />
//             </div>

//             <div className="driver-signup-grid">
//               <input
//                 type="text"
//                 name="driver_id"
//                 placeholder="Driver ID (SSN format)"
//                 required
//                 pattern="\d{3}-\d{2}-\d{4}"
//                 onChange={handleInputChange}
//               />
              
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 required
//                 onChange={handleInputChange}
//               />

//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 required
//                 onChange={handleInputChange}
//               />

//               <input
//                 type="text"
//                 name="first_name"
//                 placeholder="First Name"
//                 required
//                 onChange={handleInputChange}
//               />

//               <input
//                 type="text"
//                 name="last_name"
//                 placeholder="Last Name"
//                 required
//                 onChange={handleInputChange}
//               />

//               <input
//                 type="tel"
//                 name="phone_number"
//                 placeholder="Phone Number"
//                 required
//                 onChange={handleInputChange}
//               />

//               <input
//                 type="text"
//                 name="address"
//                 placeholder="Address"
//                 required
//                 onChange={handleInputChange}
//               />

//               <input
//                 type="text"
//                 name="city"
//                 placeholder="City"
//                 required
//                 onChange={handleInputChange}
//               />

//               <input
//                 type="text"
//                 name="state"
//                 placeholder="State (2 letters)"
//                 required
//                 maxLength="2"
//                 onChange={handleInputChange}
//               />

//               <input
//                 type="text"
//                 name="zipcode"
//                 placeholder="Zipcode"
//                 required
//                 onChange={handleInputChange}
//               />

//               <select 
//                 name="vehicle_type" 
//                 required 
//                 onChange={handleInputChange}
//               >
//                 <option value="">Select Vehicle Type</option>
//                 {VEHICLE_TYPES.map(type => (
//                   <option key={type.value} value={type.value}>
//                     {type.label}
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="text"
//                 name="vehicle_model"
//                 placeholder="Vehicle Model"
//                 required
//                 onChange={handleInputChange}
//               />

//               <input
//                 type="text"
//                 name="vehicle_plate"
//                 placeholder="Vehicle Plate"
//                 required
//                 onChange={handleInputChange}
//               />

//               <input
//                 type="text"
//                 name="license_number"
//                 placeholder="License Number"
//                 required
//                 onChange={handleInputChange}
//               />

//               <select 
//                 name="status" 
//                 onChange={handleInputChange}
//               >
//                 {STATUS_CHOICES.map(status => (
//                   <option key={status.value} value={status.value}>
//                     {status.label}
//                   </option>
//                 ))}
//               </select>

//               <div className="driver-signup-input-group">
//                 <label>
//                   Introduction Video
//                   <input
//                     type="file"
//                     name="introduction_video"
//                     accept="video/*"
//                     onChange={handleInputChange}
//                   />
//                 </label>
//               </div>
//             </div>

//             <button type="submit" className="driver-signup-button">
//               Register as Driver
//             </button>
//           </form>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default DriverSignupForm;
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/DriverSignupForm.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../services/api-services';


const VEHICLE_TYPES = [
 { value: 'sedan', label: 'Sedan' },
 { value: 'suv', label: 'SUV' },
 { value: 'van', label: 'Van' },
 { value: 'luxury', label: 'Luxury' },
];


const STATUS_CHOICES = [
 { value: 'available', label: 'Available' },
 { value: 'busy', label: 'Busy' },
 { value: 'offline', label: 'Offline' },
];


const DriverSignupForm = () => {
 const [formData, setFormData] = useState({
   driver_id: '',
   email: '',
   password: '',
   first_name: '',
   last_name: '',
   phone_number: '',
   address: '',
   city: '',
   state: '',
   zipcode: '',
   vehicle_type: '',
   vehicle_model: '',
   vehicle_plate: '',
   license_number: '',
   status: 'offline',
   rating: 5.00,
   total_trips: 0,
   current_location_lat: null,
   current_location_lng: null,
   introduction_video: null,
   profile_photo: null,
 });


 const navigate = useNavigate();
 const [previewImage, setPreviewImage] = useState(null);
 const [message, setMessage] = useState('');


 const handleInputChange = (e) => {
   const { name, value, files } = e.target;
   if (files) {
     setFormData(prev => ({
       ...prev,
       [name]: files[0],
     }));
     if (name === 'profile_photo') {
       setPreviewImage(URL.createObjectURL(files[0]));
     }
   } else {
     setFormData(prev => ({
       ...prev,
       [name]: value,
     }));
   }
 };


 const handleSubmit = async (e) => {
   e.preventDefault();
   const data = new FormData();
   Object.entries(formData).forEach(([key, value]) => {
     if (value !== null) data.append(key, value);
   });
   try {
     const response = await axios.post(`${baseUrl}/api/driver/register/`, data, {
       headers: {
         'Content-Type': 'multipart/form-data',
       },
       withCredentials: true
     });
     setMessage('Driver registered successfully!');
     setTimeout(() => {
       navigate('/driver/login');
     }, 2000);
   } catch (error) {
     setMessage(error.response?.data?.error || 'Registration failed');
   }
 };


 return (
   <div className="dsf-driver-signup">
     <Container className="dsf-driver-signup-container">
       <div className="dsf-driver-signup-form-wrapper">
         <h2 className="dsf-driver-signup-title">Driver Registration</h2>
         {message && <p className="dsf-driver-signup-message">{message}</p>}
         <form onSubmit={handleSubmit} className="dsf-driver-signup-form">
           <div className="dsf-driver-signup-photo-section">
             <div className="dsf-driver-signup-photo-preview">
               {previewImage ? (
                 <img src={previewImage} alt="Profile preview" />
               ) : (
                 <div className="dsf-driver-signup-photo-placeholder">
                   <span>Profile Photo</span>
                 </div>
               )}
             </div>
             <input type="file" accept="image/*" name="profile_photo" onChange={handleInputChange} className="dsf-driver-signup-file-input" />
           </div>
           <div className="dsf-driver-signup-grid">
             <input type="text" name="driver_id" placeholder="Driver ID (SSN format)" required pattern="\d{3}-\d{2}-\d{4}" onChange={handleInputChange} className="dsf-driver-signup-input" />
             <input type="email" name="email" placeholder="Email" required onChange={handleInputChange} className="dsf-driver-signup-input" />
             <input type="password" name="password" placeholder="Password" required onChange={handleInputChange} className="dsf-driver-signup-input" />
             <input type="text" name="first_name" placeholder="First Name" required onChange={handleInputChange} className="dsf-driver-signup-input" />
             <input type="text" name="last_name" placeholder="Last Name" required onChange={handleInputChange} className="dsf-driver-signup-input" />
             <input type="tel" name="phone_number" placeholder="Phone Number" required onChange={handleInputChange} className="dsf-driver-signup-input" />
             <input type="text" name="address" placeholder="Address" required onChange={handleInputChange} className="dsf-driver-signup-input" />
             <input type="text" name="city" placeholder="City" required onChange={handleInputChange} className="dsf-driver-signup-input" />
             <input type="text" name="state" placeholder="State (2 letters)" required maxLength="2" onChange={handleInputChange} className="dsf-driver-signup-input" />
             <input type="text" name="zipcode" placeholder="Zipcode" required onChange={handleInputChange} className="dsf-driver-signup-input" />
             <select name="vehicle_type" required onChange={handleInputChange} className="dsf-driver-signup-select">
               <option value="">Select Vehicle Type</option>
               {VEHICLE_TYPES.map(type => (
                 <option key={type.value} value={type.value}>
                   {type.label}
                 </option>
               ))}
             </select>
             <input type="text" name="vehicle_model" placeholder="Vehicle Model" required onChange={handleInputChange} className="dsf-driver-signup-input" />
             <input type="text" name="vehicle_plate" placeholder="Vehicle Plate" required onChange={handleInputChange} className="dsf-driver-signup-input" />
             <input type="text" name="license_number" placeholder="License Number" required onChange={handleInputChange} className="dsf-driver-signup-input" />
             <select name="status" onChange={handleInputChange} className="dsf-driver-signup-select">
               {STATUS_CHOICES.map(status => (
                 <option key={status.value} value={status.value}>
                   {status.label}
                 </option>
               ))}
             </select>
             <div className="dsf-driver-signup-input-group">
               <label className="dsf-driver-signup-label">
                 Introduction Video
                 <input type="file" name="introduction_video" accept="video/*" onChange={handleInputChange} className="dsf-driver-signup-file-input" />
               </label>
             </div>
           </div>
           <button type="submit" className="dsf-driver-signup-button">
             Register as Driver
           </button>
         </form>
       </div>
     </Container>
   </div>
 );
};


export default DriverSignupForm;