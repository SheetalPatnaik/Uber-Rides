import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './driver/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import DriverLoginForm from './components/DriverLoginForm';
import DriverSignupForm from './components/DriverSignupForm';
import DriverDashboard from './components/DriverDashboard';
import DriverProfile from './components/DriverProfile';
import DriverRides from './components/DriverRides';
import BookRide from './components/BookRide';
import CustomerLogin from './components/CustomerLogin';
import CustomerSignupForm from './components/CustomerSignupForm';
import CustomerRides from './components/CustomerRides';
import CustomerDashboard from './components/CustomerDashboard';
import CustomerProfile from './components/CustomerProfile';
import RideDetailPage from './components/RideDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/signup" element={<CustomerSignupForm />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/book-ride" element={<BookRide />} />
        <Route path="/customer/rides" element={<CustomerRides />} />
        <Route path="/customer/ride-detail/:rideId" element={<RideDetailPage />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/driver/login" element={<DriverLoginForm />} />
        <Route path="/driver/signup" element={<DriverSignupForm />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/profile" element={<DriverProfile />} />
        <Route path="/driver/rides" element={<DriverRides />} />
      </Routes>
    </Router>
  );
}

export default App;