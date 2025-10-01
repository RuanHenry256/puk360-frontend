/**
 * Application root component.
 * Renders the login screen first; after successful login shows events, then details.
 */
import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import EventListing from './EventListing';
import EventDetails from './EventDetails';

function App() {
  const [view, setView] = useState('login'); // 'login' | 'events' | 'details'
  const [selectedEventId, setSelectedEventId] = useState(null);

  const handleLoginSuccess = () => setView('events');
  const handleBackToLogin = () => { 
    setView('login'); 
    setSelectedEventId(null); 
  };

  const handleSelectEvent = (id) => { 
    setSelectedEventId(id); 
    setView('details'); 
  };

  const handleBackToList = () => { 
    setView('events'); 
    setSelectedEventId(null); 
  };

  return (
    <div className="App">
      {view === 'login' && <LoginScreen onLoginSuccess={handleLoginSuccess} />}

      {view === 'events' && (
        <EventListing
          onBackToLogin={handleBackToLogin}
          onSelectEvent={handleSelectEvent}
        />
      )}

      {view === 'details' && (
        <EventDetails
          eventId={selectedEventId}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
}

export default App;
