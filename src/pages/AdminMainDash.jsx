import React, { useState } from 'react';
import BottomTabBar from '../components/BottomTabBar';

function TopBar({ title }) {
  return (
    <div className="fixed inset-x-0 top-0 z-40 h-16 border-b border-secondary/40 bg-primary/5 backdrop-blur">
      <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-primary">{title}</h1>
      </div>
    </div>
  );
}

function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-primary">Dashboard Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">Total Events</p>
            <p className="text-3xl font-bold text-primary">24</p>
          </div>
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">Total Users</p>
            <p className="text-3xl font-bold text-primary">1,423</p>
          </div>
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">Active Events</p>
            <p className="text-3xl font-bold text-primary">8</p>
          </div>
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">Pending Reviews</p>
            <p className="text-3xl font-bold text-primary">15</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-bold text-primary">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-secondary/10 p-3">
            <span className="text-2xl">[✓]</span>
            <div className="flex-1">
              <p className="font-medium text-text">New event created</p>
              <p className="text-sm text-secondary">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-secondary/10 p-3">
            <span className="text-2xl">[+]</span>
            <div className="flex-1">
              <p className="font-medium text-text">New user registered</p>
              <p className="text-sm text-secondary">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-secondary/10 p-3">
            <span className="text-2xl">[*]</span>
            <div className="flex-1">
              <p className="font-medium text-text">Review submitted</p>
              <p className="text-sm text-secondary">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Manage Events</h2>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            + New Event
          </button>
        </div>
        
        <div className="space-y-4">
          {['Music Night Extravaganza', 'Tech Conference 2024', 'Art Exhibition'].map((event, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-secondary/40 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
                  EV
                </div>
                <div>
                  <p className="font-semibold text-text">{event}</p>
                  <p className="text-sm text-secondary">October 23, 2024</p>
                </div>
              </div>
              <button className="rounded-lg border border-secondary/60 px-3 py-1.5 text-sm font-medium text-secondary hover:border-primary hover:text-primary">
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-primary">User Management</h2>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-lg border border-secondary/60 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-3">
          {[
            { name: 'Kamo', email: 'kamo@example.com', role: 'Student' },
            { name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Admin' },
            { name: 'Mike Chen', email: 'mike@example.com', role: 'Student' }
          ].map((user, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-secondary/40 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-text">{user.name}</p>
                  <p className="text-sm text-secondary">{user.email}</p>
                </div>
              </div>
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'events':
        return <EventsPage />;
      case 'users':
        return <UsersPage />;
      default:
        return <OverviewPage />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Admin Dashboard';
      case 'events':
        return 'Events Management';
      case 'users':
        return 'User Management';
      default:
        return 'Admin Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-surface text-text">
      <TopBar title={getTitle()} />
      
      <div className="mx-auto max-w-3xl px-4 pt-20 pb-20 sm:px-6 lg:px-8">
        {renderPage()}
      </div>

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

