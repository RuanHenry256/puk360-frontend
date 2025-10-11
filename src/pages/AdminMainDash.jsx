import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../api/client';

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

export default function AdminDashboard({ onSignOut }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  async function loadApps(status = 'Pending') {
    try {
      setAppsLoading(true); setAppsError('');
      const token = localStorage.getItem('token');
      const list = await api.admin.listHostApplications(status, token);
      setApps(list);
    } catch (e) {
      setAppsError(e.message || 'Failed to load applications');
    } finally { setAppsLoading(false); }
  }

  useEffect(() => {
    if (activeTab === 'hostapps') loadApps('Pending');
  }, [activeTab]);

  async function review(id, decision, comment) {
    try {
      const token = localStorage.getItem('token');
      await api.admin.reviewHostApplication(id, { decision, comment }, token);
      setApps((prev) => prev.filter((a) => a.Application_ID !== id));
      setSelectedApp(null);
    } catch (e) { alert(e.message || 'Failed to update'); }
  }

  function HostAppsPage() {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">Host Applications</h2>
            <div className="flex gap-2">
              <button className="rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary" onClick={()=>loadApps('Pending')}>Pending</button>
              <button className="rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary" onClick={()=>loadApps('Approved')}>Approved</button>
              <button className="rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary" onClick={()=>loadApps('Rejected')}>Rejected</button>
              <button className="rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary" onClick={()=>loadApps('All')}>All</button>
            </div>
          </div>
          {appsLoading && <div className="rounded-lg border border-secondary/40 bg-white p-4 text-secondary">Loading…</div>}
          {appsError && <div className="rounded-lg border border-secondary/40 bg-white p-4 text-red-600">{appsError}</div>}
          {!appsLoading && !appsError && (
            <div>
              {apps.length === 0 ? (
                <div className="rounded-lg border border-secondary/40 bg-white p-4 text-secondary">No applications</div>
              ) : (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {apps.map((a) => (
                    <li key={a.Application_ID}>
                      <button
                        type="button"
                        onClick={() => setSelectedApp(a)}
                        className="w-full rounded-2xl border border-secondary/40 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-primary">{a.Org_Name} • {a.Event_Type}</h3>
                            <p className="text-sm text-secondary">Applicant: {a.Applicant_Name} ({a.Applicant_Email})</p>
                          </div>
                          <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary">{a.Status}</span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-secondary">{a.Motivation || 'No motivation provided.'}</p>
                        <p className="mt-2 text-xs text-secondary">Tap to review</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  function HostAppDetailModal({ app, onClose }) {
    const [comment, setComment] = useState('');
    if (!app) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/30 p-4" onClick={onClose}>
        <div className="w-full max-w-2xl rounded-2xl border border-secondary/40 bg-white p-6 shadow-xl" onClick={(e)=>e.stopPropagation()}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-primary">Review Application</h3>
            <button className="rounded px-3 py-1 text-secondary hover:bg-secondary/10" onClick={onClose}>✕</button>
          </div>
          <div className="grid gap-3">
            <div className="rounded-lg bg-primary/5 p-3">
              <p className="text-sm text-secondary">Organisation • Category</p>
              <p className="font-semibold text-primary">{app.Org_Name} • {app.Event_Type}</p>
            </div>
            <div className="rounded-lg bg-primary/5 p-3">
              <p className="text-sm text-secondary">Applicant</p>
              <p className="font-medium text-text">{app.Applicant_Name} ({app.Applicant_Email})</p>
            </div>
            <div className="rounded-lg bg-primary/5 p-3">
              <p className="text-sm text-secondary">Motivation</p>
              <p className="text-text">{app.Motivation || 'No motivation provided.'}</p>
            </div>
            <div className="rounded-lg bg-primary/5 p-3">
              <label className="text-sm font-medium text-secondary">Reviewer comment (sent to applicant later)</label>
              <textarea className="mt-1 h-28 w-full rounded border p-2" value={comment} onChange={(e)=>setComment(e.target.value)} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button className="rounded-lg border border-secondary/60 px-4 py-2 text-sm text-secondary hover:border-primary hover:text-primary" onClick={onClose}>Cancel</button>
            {app.Status === 'Pending' && (
              <>
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90" onClick={()=>review(app.Application_ID, 'APPROVED', comment)}>Approve</button>
                <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" onClick={()=>review(app.Application_ID, 'REJECTED', comment)}>Reject</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'events':
        return <EventsPage />;
      case 'hostapps':
        return <HostAppsPage />;
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
      case 'hostapps':
        return 'Host Applications';
      default:
        return 'Admin Dashboard';
    }
  };

  return (
    <div className="min-h-screen text-text">
      <div className="fixed inset-x-0 top-0 z-40 h-16 border-b border-secondary/40 bg-primary/5 backdrop-blur">
        <div className="flex h-full items-center justify-start px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" className="rounded p-2 text-primary hover:bg-primary/10 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
            <h1 className="text-xl font-bold text-primary lg:text-left">{getTitle()}</h1>
          </div>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-20 sm:px-6 lg:px-8 lg:pl-64">
        {renderPage()}
      </div>
      {activeTab === 'hostapps' && selectedApp && (
        <HostAppDetailModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}

      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeId={activeTab}
        onSelect={setActiveTab}
        items={[
          { id: 'overview', label: 'Overview', icon: '🏠' },
          { id: 'events', label: 'Events', icon: '📅' },
          { id: 'hostapps', label: 'Host Applications', icon: '📝' },
          { id: 'users', label: 'Users', icon: '👤' },
        ]}
        onSignOut={onSignOut}
      />
    </div>
  );
}
