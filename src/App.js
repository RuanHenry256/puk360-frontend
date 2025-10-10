/**
 * Application root component.
 * Renders the login screen first; after successful login shows events, details, and profile.
 */
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import EventListing from './pages/EventListing';
import ReviewEventDetail from './pages/ReviewEventDetail';
import StudentProfile from './pages/StudentProfile';
import EventHostRequest from './pages/EventHostRequest'; // 🟣 Added
import AdminDashboard from './pages/AdminMainDash'; // Import the Admin Dashboard
import { api } from './api/client';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to parse stored user', error);
      return null;
    }
  });

  const handleLoginSuccess = () => {
    try {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    } catch (error) {
      console.warn('Failed to parse stored user on login', error);
      setUser(null);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginScreen onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/events" element={<EventListing onShowProfile={() => setUser(user)} />} />
          <Route path="/details" element={<ReviewEventDetail onBack={() => setUser(user)} />} />
          <Route path="/profile" element={<StudentProfile user={user} onSignOut={handleSignOut} />} />
          <Route path="/hostrequest" element={<EventHostRequest onBack={() => setUser(user)} />} />
          <Route path="/admin" element={<AdminDashboard />} /> {/* Admin Dashboard Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;