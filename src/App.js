import React, { useState } from 'react';
import './styles.css';
import EventApproval from './components/EventApproval'; // Assuming components are in src/components
import HostApproval from './components/HostApproval'; // Import the HostApproval component
import MonitorAnalytics from './components/MonitorAnalytics'; // <--- NEW: Import the MonitorAnalytics component


// Simple Avatar Component
const UserAvatar = () => (
  <div className="avatar-container">
    <div className="avatar-circle">
      USER AVATAR
    </div>
  </div>
);

// Define views for navigation
const VIEWS = {
    EVENTS: 'events',
    HOSTS: 'hosts',
    ANALYTICS: 'analytics',
};

const App = () => {
  // Use state to manage the current view (default to EVENTS)
  const [currentView, setCurrentView] = useState(VIEWS.EVENTS); 

  const renderContent = () => {
    switch (currentView) {
      case VIEWS.HOSTS:
        return <HostApproval />;
      case VIEWS.EVENTS:
        return <EventApproval />;
      case VIEWS.ANALYTICS:
        // <--- UPDATED: Return the MonitorAnalytics component
        return <MonitorAnalytics />; 
      default:
        return <EventApproval />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar: Back Button and Avatar */}
      <header className="header">
        {/* Back button logic updated to always go back to the main EVENTS screen */}
        <div className="back-button" onClick={() => setCurrentView(VIEWS.EVENTS)}>&lt;</div>
        <UserAvatar />
      </header>

      {/* NEW: Simple Navigation Menu */}
      <nav className="nav-menu">
        <button 
          className={`nav-button ${currentView === VIEWS.EVENTS ? 'active' : ''}`}
          onClick={() => setCurrentView(VIEWS.EVENTS)}>
          Approve Events
        </button>
        <button 
          className={`nav-button ${currentView === VIEWS.HOSTS ? 'active' : ''}`}
          onClick={() => setCurrentView(VIEWS.HOSTS)}>
          Approve Hosts
        </button>
        <button 
          className={`nav-button ${currentView === VIEWS.ANALYTICS ? 'active' : ''}`}
          onClick={() => setCurrentView(VIEWS.ANALYTICS)}>
          Monitor Analytics
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="content">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
