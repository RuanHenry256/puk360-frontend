/**
 * Application root component.
 * Renders the login screen first; after successful login shows a blank page.
 */
import React, { useState } from 'react';
import LoginScreen from './LoginScreen'; // Make sure the path is correct
import './App.css';
import BlankPage from './BlankPage';
import EventListing from './components/EventListing'; // Update this path


function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'events'

  const handleLoginSuccess = () => {
    setCurrentView('events'); // Switch to event listing upon successful login
  };

  const handleBackToLogin = () => {
    setCurrentView('login'); // Switch back to login screen
  };

  return (
    <div className="App">
      {currentView === 'login' ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <EventListing onBackToLogin={handleBackToLogin} /> // Pass the back function
      )}
    </div>
  );
}

export default App;
