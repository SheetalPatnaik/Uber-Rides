import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DriverList from './components/DriverList';
import DriverDetails from './components/DriverDetails';
import CreateDriver from './components/CreateDriver';
import UpdateDriver from './components/UpdateDriver';
import UpdateLocation from './components/UpdateLocation';
import UpdateStatus from './components/UpdateStatus';
import DriverTrips from './components/DriverTrips';
import AvailableDrivers from './components/AvailableDrivers';
import TopRatedDrivers from './components/TopRatedDrivers';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/create">Create Driver</Link></li>
            <li><Link to="/available">Available Drivers</Link></li>
            <li><Link to="/top-rated">Top Rated Drivers</Link></li>
          </ul>
        </nav>

        <Routes>
      <Route path="/" element={<DriverList />} />
      <Route path="/create" element={<CreateDriver />} />
      <Route path="/driver/:id" element={<DriverDetails />} />
      <Route path="/update/:id" element={<UpdateDriver />} />
      <Route path="/update-location/:id" element={<UpdateLocation />} />
      <Route path="/update-status/:id" element={<UpdateStatus />} />
      <Route path="/trips/:id" element={<DriverTrips />} />
      <Route path="/available" element={<AvailableDrivers />} />
      <Route path="/top-rated" element={<TopRatedDrivers />} />
    </Routes>
      </div>
    </Router>
  );
}

export default App;