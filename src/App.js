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
import AdminDashboard from './pages/AdminMainDash';
import HostMain from './pages/HostMain';
import EventHostRequest from './pages/EventHostRequest'; // 🟣 Added
import { api } from './api/client';
import './styles/App.css';
import Footer from './components/Footer';

function App() {
  const [view, setView] = useState('login'); // 'login' | 'events' | 'details' | 'profile' | 'hostrequest' | 'host' | 'admin'
  const [visitedEventIds, setVisitedEventIds] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
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
    // Route to the correct workspace based on roles
    try {
      const stored = localStorage.getItem('user');
      const parsed = stored ? JSON.parse(stored) : null;
      setUser(parsed);

      const roles = (parsed?.roles || []).map((r) =>
        typeof r === 'string' ? r.toLowerCase() : r
      );
      const has = (name, id) => roles.includes(name) || roles.includes(id);

      if (has('admin', 3)) {
        setView('admin');
      } else if (has('host', 2)) {
        setView('host');
      } else {
        setView('events'); // default student
      }
    } catch (error) {
      console.warn('Failed to parse stored user on login', error);
      setUser(null);
      setView('events');
    }
  };

  const handleBecomeHost = () => {
    setView('hostrequest'); // 🟣 Changed from 'blankpage' to 'hostrequest'
  };

  const handleSelectEvent = (id) => {
    setView('details');
    setSelectedEventId(id);
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
    <div className={"App " + (view !== 'login' ? 'App--with-gradient' : '')}>
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
        <ReviewEventDetail eventId={selectedEventId} onBack={handleBackFromDetails} onShowProfile={handleShowProfile} />
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

      {view === 'host' && (
        <HostMain onSignOut={handleSignOut} />
      )}

      {view === 'admin' && (
        <AdminDashboard onSignOut={handleSignOut} />
      )}

      {view !== 'login' && <Footer />}
    </div>
  );
}

export default App;
