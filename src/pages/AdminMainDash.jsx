import React, { useState, useEffect } from 'react';
import BottomTabBar from '../components/BottomTabBar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { api } from '../api/client'; // Adjusted import path

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

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getUsers(); // Fetch users using the API client
        setUsers(data); // Assuming the API returns an array of users
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error fetching users: {error}</p>;

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
          {users.map((user) => (
            <div key={user.User_ID} className="flex items-center justify-between rounded-lg border border-secondary/40 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {user.Name.charAt(0)} {/* Display initial of user's name */}
                </div>
                <div>
                  <p className="font-semibold text-text">{user.Name}</p>
                  <p className="text-sm text-secondary">{user.Email}</p>
                </div>
              </div>
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                {user.role} {/* Display user's role */}
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
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
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