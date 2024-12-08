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
import AdminLogin from './components/AdminLogin';
import AdminSignup from './components/AdminSignup';
import AdminDashboard from './components/AdminDashboard';
import AdminProfile from './components/AdminProfile';
import ManageDrivers from './components/ManageDrivers';
import DriverDetails from './components/DriverDetails';
import ManageCustomers from './components/ManageCustomers';
import CustomerDetails from './components/CustomerDetails';
import BillingManagement from './components/BillingManagement';
import BillDetails from './components/BillDetails';
import Statistics from './components/Statistics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/signup" element={<CustomerSignupForm />} />
        <Route path="/customer/book-ride" element={<BookRide />} />
        <Route path="/customer/rides" element={<CustomerRides />} />
        <Route path="/driver/login" element={<DriverLoginForm />} />
        <Route path="/driver/signup" element={<DriverSignupForm />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/profile" element={<DriverProfile />} />
        <Route path="/driver/rides" element={<DriverRides />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/manage-drivers" element={<ManageDrivers />} />
        <Route path="/admin/manage-customers" element={<ManageCustomers />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/drivers/:driverId" element={<DriverDetails />} />
        <Route path="/admin/customers/:customerId" element={<CustomerDetails />} />
        <Route path="/admin/billing" element={<BillingManagement />} />
        <Route path="/admin/billing/:billId" element={<BillDetails />} />
        <Route path="/admin/visualization" element={<Statistics />} />
        <Route path="/admin/driver-signup" element={<DriverSignupForm />} />
        <Route path="/admin/customer-signup" element={<CustomerSignupForm />} />
      </Routes>
    </Router>
  );
}

export default App;