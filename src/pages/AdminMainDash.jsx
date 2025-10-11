import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null); // State for the user being edited

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/users'); // Updated endpoint
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on the search term
  const filteredUsers = users.filter(user => 
    user?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user?.Email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user) => {
    setEditingUser(user); // Set the user to be edited
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${updatedUser.User_ID}`, updatedUser);
      setUsers((prev) =>
        prev.map((user) => (user.User_ID === updatedUser.User_ID ? updatedUser : user))
      );
      setEditingUser(null); // Clear editing state
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user.User_ID !== userId));
      if (editingUser && editingUser.User_ID === userId) {
        setEditingUser(null); // Clear editing state if the removed user was being edited
      }
    } catch (err) {
      console.error('Failed to remove user:', err);
    }
  };

  if (editingUser) {
    return (
      <EditUserForm
        user={editingUser}
        onUpdateUser={handleUpdateUser}
        onRemoveUser={handleRemoveUser}
        onCancel={() => setEditingUser(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-primary">User Management</h2>
        
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-secondary/60 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-3">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div key={user.User_ID} className="flex items-center justify-between rounded-lg border border-secondary/40 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {user?.Name ? user.Name.charAt(0) : '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-text">{user?.Name || 'N/A'}</p>
                        <p className="text-sm text-secondary">{user?.Email || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <button onClick={() => handleEditUser(user)} className="mr-2 rounded-lg bg-blue-500 px-3 py-1 text-white">
                        Edit
                      </button>
                      <button onClick={() => handleRemoveUser(user.User_ID)} className="rounded-lg bg-red-500 px-3 py-1 text-white">
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No users found.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EditUserForm({ user, onUpdateUser, onRemoveUser, onCancel }) {
  const [name, setName] = useState(user.Name);
  const [email, setEmail] = useState(user.Email);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({ ...user, Name: name, Email: email });
  };

  const handleRemove = () => {
    onRemoveUser(user.User_ID);
  };

  return (
    <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
      <h3 className="mb-4 text-xl font-bold text-primary">Edit User</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-secondary">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-secondary/60 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-secondary">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-secondary/60 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={onCancel} className="mr-2 rounded-lg bg-gray-500 px-3 py-1 text-white">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-green-500 px-3 py-1 text-white">
            Save
          </button>
          <button type="button" onClick={handleRemove} className="ml-2 rounded-lg bg-red-500 px-3 py-1 text-white">
            Remove
          </button>
        </div>
      </form>
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
    <div className="min-h-screen text-text">
      <TopBar title={getTitle()} />
      
      <div className="mx-auto max-w-3xl px-4 pt-20 pb-20 sm:px-6 lg:px-8">
        {renderPage()}
      </div>

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}