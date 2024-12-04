import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './driver/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import DriverLoginForm from './components/DriverLoginForm';
import DriverSignupForm from './components/DriverSignupForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<DriverLoginForm />} />
        <Route path="/signup" element={<DriverSignupForm />} />
      </Routes>
    </Router>
  );
}

export default App;