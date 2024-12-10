// contexts/UserContext.js
import React, { createContext, useState, useContext } from 'react';
import { baseUrl } from '../services/api-services';


const UserContext = createContext();


export const UserProvider = ({ children }) => {
 const [userData, setUserData] = useState({
   firstName: '',
   lastName: '',
   profilePhoto: null
 });


 return (
   <UserContext.Provider value={{ userData, setUserData }}>
     {children}
   </UserContext.Provider>
 );
};


export const useUser = () => useContext(UserContext);