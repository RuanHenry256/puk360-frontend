/**
 * Application root component.
 * Renders the login screen first; after successful login shows events, details, and profile.
 */
import React, { useState } from 'react';
import LoginScreen from './pages/LoginScreen';
import EventListing from './pages/EventListing';
// import EventDetails from './pages/EventDetails';
import ReviewEventDetail from './pages/ReviewEventDetail';
import StudentProfile from './pages/StudentProfile';
import EventHostRequest from './pages/EventHostRequest'; // 🟣 Added
import { api } from './api/client';
import './styles/App.css';

function App() {
  const [view, setView] = useState('login'); // 'login' | 'events' | 'details' | 'profile' | 'hostrequest'
  const [visitedEventIds, setVisitedEventIds] = useState([]);
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
    // Reverted: After successful login go to events feed (default flow)
    setView('events');
    try {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    } catch (error) {
      console.warn('Failed to parse stored user on login', error);
      setUser(null);
    }
  };

  const handleBecomeHost = () => {
    setView('hostrequest'); // 🟣 Changed from 'blankpage' to 'hostrequest'
  };

  const handleSelectEvent = (id) => {
    setView('details');
    setVisitedEventIds((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  };

  // Removed unused handleBackToList (was for EventDetails)

  const handleShowProfile = () => {
    setView('profile');
  };

  const handleBackFromProfile = () => {
    setView('events');
  };

  const handleBackFromDetails = () => {
    setView('events');
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setVisitedEventIds([]);
    setView('login');
  };

  const handleUpdateProfile = async (updates) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Your session has expired. Please sign in again.');
    }

    const { user: updatedUser } = await api.updateProfile(updates, token);

    let resolvedUser = null;
    setUser((previous) => {
      const nextUser = { ...(previous || {}), ...updatedUser };
      try {
        localStorage.setItem('user', JSON.stringify(nextUser));
      } catch (error) {
        console.warn('Failed to persist updated user', error);
      }
      resolvedUser = nextUser;
      return nextUser;
    });

    return resolvedUser || updatedUser;
  };

  return (
    <div className="App">
      {view === 'login' && (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}

      {view === 'events' && (
        <EventListing
          onSelectEvent={handleSelectEvent}
          onShowProfile={handleShowProfile}
        />
      )}


      {view === 'details' && (
        <ReviewEventDetail onBack={handleBackFromDetails} onShowProfile={handleShowProfile} />
      )}

      {view === 'profile' && (
        <StudentProfile
          user={user}
          visitedEventIds={visitedEventIds}
          onBack={handleBackFromProfile}
          onSignOut={handleSignOut}
          onUpdateProfile={handleUpdateProfile}
          onRequestHost={handleBecomeHost}
        />
      )}

      {view === 'hostrequest' && (
        <EventHostRequest onBack={() => setView('profile')} />
      )}
    </div>
  );
}

export default App;
