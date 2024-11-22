import axios from 'axios';

const API_BASE_URL = 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getDrivers = () => api.get('/api/drivers/');
export const createDriver = (driverData) => api.post('/api/drivers/', driverData);
export const getDriver = (id) => api.get(`/api/drivers/${id}/`);
export const updateDriver = (id, driverData) => api.put(`/api/drivers/${id}/`, driverData);
export const deleteDriver = (id) => api.delete(`/api/drivers/${id}/`);
export const updateDriverLocation = (id, location) => api.post(`/api/drivers/${id}/update_location/`, location);
export const updateDriverStatus = (id, status) => api.post(`/api/drivers/${id}/update_status/`, status);
export const getDriverTrips = (id) => api.get(`/api/drivers/${id}/trips/`);
export const getAvailableDrivers = () => api.get('/api/drivers/available_drivers/');
export const getTopRatedDrivers = () => api.get('/api/drivers/top_rated/');

export default api;