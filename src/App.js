/**
 * Application root component.
 * Renders the login screen first; after successful login shows a blank page.
 */
import React, { useState } from 'react';
import LoginScreen from './LoginScreen'; // Make sure the path is correct
import './App.css';
import EventDetail from "./components/EventDetail";
//import BlankPage from './BlankPage';
import EventListing from './components/EventListing'; // Update this path
//testing commit

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'events'
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleLoginSuccess = () => {
    setCurrentView('events'); // Switch to event listing upon successful login
  };

  const handleBackToLogin = () => {
    setCurrentView('login'); // Switch back to login screen
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setCurrentView('detail');
  };

  const handleBackToListing = () => {
    setSelectedEvent(null);
    setCurrentView('events');
  };

  return (
    <div className="App">
      {currentView === 'login' ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : currentView === 'events' ? (
        <EventListing
          onBackToLogin={handleBackToLogin}
          onSelectEvent={handleSelectEvent}
        />
      ) : (
        <EventDetail event={selectedEvent} onBack={handleBackToListing} />
      )}
    </div>
  );
}


export default App;
