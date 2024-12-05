import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './driver/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import DriverLoginForm from './components/DriverLoginForm';
import DriverSignupForm from './components/DriverSignupForm';
import DriverDashboard from './components/DriverDashboard';
import DriverProfile from './components/DriverProfile';
import DriverRides from './components/DriverRides';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<DriverLoginForm />} />
        <Route path="/signup" element={<DriverSignupForm />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/profile" element={<DriverProfile />} />
        <Route path="/driver/rides" element={<DriverRides />} />
      </Routes>
    </Router>
  );
}

export default App;