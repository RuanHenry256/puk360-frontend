import React, { useEffect, useMemo, useState } from 'react';
import AdminUserEdit from './AdminUserEdit';
import HostCreateEvent from './HostCreateEvent';
import HostEventDetail from './HostEventDetail';
import Sidebar from '../components/Sidebar';
import { Home, CalendarDays, ClipboardList, User2 } from 'lucide-react';
import { api } from '../api/client';

function StatTile({ label, value, sub }) {
  return (
    <div className="rounded-lg bg-secondary/10 p-4">
      <p className="text-sm text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
      {sub ? <p className="text-xs text-secondary">{sub}</p> : null}
    </div>
  );
}

function BarsChart({ data = [], labels = [] }) {
  const max = Math.max(1, ...data);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="flex h-28 items-end gap-2">
        {data.map((v, i) => (
          <div key={i} className="flex-1">
            <div
              className="w-full rounded-t bg-primary/70"
              style={{ height: `${(v / max) * 100}%` }}
              title={`${labels[i] || i}: ${v}`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-secondary">
        {(labels.length ? labels : data.map((_, i) => i + 1)).map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function LineChart({ data = [], labels = [] }) {
  const max = Math.max(1, ...data);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="flex h-28 items-end gap-1">
        {data.map((v, i) => (
          <div
            key={i}
            className="h-full w-full max-w-[6px] rounded bg-gradient-to-t from-primary/20 to-primary"
            style={{ height: `${(v / max) * 100}%` }}
            title={`${labels[i] || i}: ${v}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-secondary">
        {(labels.length ? labels : data.map((_, i) => i + 1)).map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function OverviewPage({ metrics = {} }) {
  const m = metrics || {};
  const engagement = m.engagement || {};
  const events = m.events || {};
  const users = m.users || {};
  const reviews = m.reviews || {};
  const system = m.system || {};

  const eventsPerMonth = m.charts?.eventsPerMonth || [2, 5, 3, 8, 6, 9, 4, 7, 5, 6, 8, 10];
  const userGrowth = m.charts?.userGrowth || [10, 12, 15, 20, 24, 28, 33, 35, 40, 46, 53, 60];
  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // Normalize possible backend shapes
  const categoriesArray = Array.isArray(events.categoryBreakdown)
    ? events.categoryBreakdown.map((item) => [
        String(item?.category ?? item?.name ?? 'Unknown'),
        Number(item?.count ?? item?.value ?? 0),
      ])
    : Object.entries(events.categoryBreakdown || {}).map(([k, v]) => [
        String(k),
        Number(typeof v === 'object' && v !== null ? (v.count ?? v.value ?? 0) : v),
      ]);
  const categoriesCount = categoriesArray.length;
  const topVenueNames = Array.isArray(events.topVenues)
    ? events.topVenues
        .map((tv) => (typeof tv === 'string' ? tv : (tv?.name ?? tv?.title ?? tv?.venue ?? 'Unknown')))
        .slice(0, 3)
    : [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">Engagement</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Events Attended (Total)" value={engagement.attendedTotal ?? 0} />
          <StatTile label="Attended (This Month)" value={engagement.attendedThisMonth ?? 0} />
          <StatTile label="Avg Attendance / Event" value={(engagement.avgAttendancePerEvent ?? 0).toFixed(1)} />
          <StatTile label="Active Users (7d)" value={engagement.activeUsers7d ?? 0} />
        </div>
        <div className="mt-3 text-sm text-secondary">
          Most popular event: <span className="font-semibold text-primary">{engagement?.mostPopularEvent?.title || '—'}</span>
          {typeof engagement?.mostPopularEvent?.attendees === 'number' && (
            <span className="ml-1">({engagement.mostPopularEvent.attendees})</span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">Event Analytics</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Upcoming Events" value={events.upcomingCount ?? 0} />
          <StatTile label="Cancelled Events" value={events.cancelledCount ?? 0} />
          <StatTile label="Top 3 Venues" value={(events.topVenues?.length ?? 0)} sub={topVenueNames.join(', ')} />
          <StatTile label="Categories" value={categoriesCount} />
        </div>
        {categoriesArray.length > 0 && (
          <div className="mt-3 text-sm text-secondary">
            {categoriesArray.map(([k, v]) => (
              <span key={k} className="mr-3">{k}: <span className="text-primary font-semibold">{v}</span></span>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">User Insights</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="New Users (This Month)" value={users.newThisMonth ?? 0} />
          <StatTile label="Verified Hosts" value={users.verifiedHosts ?? 0} sub={`Pending: ${users.pendingHosts ?? 0}`} />
          <StatTile label="Average Host Rating" value={(users.avgHostRating ?? 0).toFixed(2)} />
          <StatTile label="Most Active User" value={users.mostActiveUser?.name ? users.mostActiveUser.name : '—'} sub={typeof users.mostActiveUser?.score === 'number' ? `Score: ${users.mostActiveUser.score}` : ''} />
        </div>
      </div>

      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">Feedback & Reviews</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatTile label="Total Reviews" value={reviews.totalReviews ?? 0} />
          <StatTile label="Average Event Rating" value={(reviews.averageRating ?? 0).toFixed(2)} />
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">Most Reviewed Event</p>
            <p className="mt-1 font-semibold text-primary">{reviews.mostReviewedEvent?.title || '—'}</p>
            <p className="text-xs text-secondary">{reviews.mostReviewedEvent?.reviews ?? 0} reviews</p>
          </div>
        </div>
        {Array.isArray(reviews.recentSnippets) && reviews.recentSnippets.length > 0 && (
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {reviews.recentSnippets.slice(0, 3).map((t, i) => {
              const text = typeof t === 'string' ? t : (t?.text ?? t?.comment ?? t?.content ?? String(t));
              return (
                <div key={i} className="rounded-lg border border-secondary/30 bg-white p-3 text-sm text-text">“{text}”</div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">System Health</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">DB Connection</p>
            <p className="mt-1 text-3xl font-bold"><span title={system.dbConnected ? 'Connected' : 'Disconnected'}>{system.dbConnected ? '🟢' : '🔴'}</span></p>
          </div>
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">Last Backup</p>
            <p className="mt-1 text-primary">{system.lastBackup || 'Unknown'}</p>
          </div>
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">API Uptime (past 24h)</p>
            <p className="mt-1 text-3xl font-bold text-primary">{system.apiUptimePct ?? 0}%</p>
          </div>
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">Storage Used</p>
            <p className="mt-1 text-primary">{system.storageUsed ?? '—'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-primary">Events Per Month</h3>
          <BarsChart data={eventsPerMonth} labels={monthLabels} />
        </div>
        <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-primary">User Growth</h3>
          <LineChart data={userGrowth} labels={monthLabels} />
        </div>
      </div>
    </div>
  );
}

function EventsPage() {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [query, setQuery] = useState('');
  const [range, setRange] = useState('upcoming'); // 'upcoming' | 'past' | 'all'
  const [statusFilter, setStatusFilter] = useState(''); // '', 'Scheduled','Cancelled','Completed'

  async function loadAllEvents() {
    setLoading(true);
    setError('');
    try {
      const list = await api.events.list({}); // no host filter => all events
      setEvents(Array.isArray(list) ? list : []);
    } catch (_) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAllEvents(); }, []);

  const filteredEvents = events.filter((e) => {
    const d = new Date((typeof e.Date === 'string' ? e.Date : e.Date?.toString()) + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const textMatch = !query || (e.Title || '').toLowerCase().includes(query.toLowerCase());
    const statusMatch = !statusFilter || (e.Status || '').toLowerCase() === statusFilter.toLowerCase();
    const dateMatch = range === 'all' ? true : range === 'upcoming' ? d >= today : d < today;
    return textMatch && statusMatch && dateMatch;
  });

  async function duplicateEvent(e) {
    try {
      const token = localStorage.getItem('token');
      await api.events.create({
        Title: `${e.Title} (Copy)`,
        Description: e.Description,
        Date: typeof e.Date === 'string' ? e.Date : new Date(e.Date).toISOString().slice(0,10),
        startTime: e.startTime,
        endTime: e.endTime,
        campus: e.campus,
        venue: e.venue,
        category: e.category,
        hostedBy: e.hostedBy,
        ImageUrl: e.ImageUrl,
        Host_User_ID: e.Host_User_ID, // keep original host unless backend enforces current user
        Status: e.Status || 'Scheduled',
      }, token);
      await loadAllEvents();
    } catch (_) {}
  }
  async function deleteEvent(e) {
    if (!window.confirm('Delete this event?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.events.delete(e.Event_ID, token);
      await loadAllEvents();
    } catch (_) {}
  }
  async function updateStatus(e, Status) {
    try {
      const token = localStorage.getItem('token');
      await api.events.updateStatus(e.Event_ID, Status, token);
      await loadAllEvents();
    } catch (_) {}
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by title" className="w-full rounded border px-3 py-2" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-1 min-w-[300px] overflow-hidden rounded-lg border border-secondary/40">
            {['upcoming','past','all'].map((r, idx) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`flex-1 px-3 py-2 text-sm text-center ${range===r ? 'bg-primary text-white' : 'bg-white text-secondary hover:bg-primary/5'} ${idx < 2 ? 'border-r border-secondary/30' : ''}`}
              >
                {r.charAt(0).toUpperCase()+r.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['','Scheduled','Cancelled','Completed'].map((s) => (
              <button
                key={s || 'all'}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-full border px-3 py-1 text-sm ${statusFilter===s ? 'border-primary text-primary bg-primary/5' : 'border-secondary/40 text-secondary hover:bg-primary/5'}`}
              >
                {s || 'All statuses'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCreating(true)}
            className="ml-auto rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            + Create Event
          </button>
        </div>
      </div>

      {loading && <div className="rounded-lg border border-secondary/40 bg-white p-4 text-secondary">Loading…</div>}
      {error && <div className="rounded-lg border border-secondary/40 bg-white p-4 text-red-600">{error}</div>}
      {!loading && !error && filteredEvents.length === 0 && (
        <div className="rounded-lg border border-secondary/40 bg-white p-6 text-secondary">No events match your filters.</div>
      )}
      {!loading && !error && filteredEvents.map((e) => (
        <div
          key={e.Event_ID}
          role="button"
          tabIndex={0}
          onClick={() => setSelectedEventId(e.Event_ID)}
          onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') setSelectedEventId(e.Event_ID); }}
          className="flex cursor-pointer items-center justify-between rounded-lg border border-secondary/40 bg-white p-4 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label={`Open details for ${e.Title}`}
        >
          <div>
            <p className="text-left font-semibold text-text">{e.Title}</p>
            <p className="text-sm text-secondary">{new Date((typeof e.Date === 'string' ? e.Date : e.Date?.toString()) + 'T00:00:00').toLocaleDateString('en-ZA', { year:'numeric', month:'short', day:'2-digit' })} • {e.venue || e.campus}</p>
            <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary">{e.Status || 'Scheduled'}</span>
          </div>
          <div className="flex gap-2 flex-col sm:flex-row sm:items-start">
            <button
              className="w-full sm:w-auto rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary"
              onClick={(ev)=>{ ev.stopPropagation(); duplicateEvent(e); }}
              onKeyDown={(ev)=>ev.stopPropagation()}
            >
              Duplicate
            </button>
            <button
              className="w-full sm:w-auto rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary"
              onClick={(ev)=>{ ev.stopPropagation(); updateStatus(e,'Cancelled'); }}
              onKeyDown={(ev)=>ev.stopPropagation()}
            >
              Cancel
            </button>
            <button
              className="w-full sm:w-auto rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              onClick={(ev)=>{ ev.stopPropagation(); deleteEvent(e); }}
              onKeyDown={(ev)=>ev.stopPropagation()}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Create form overlay */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <HostCreateEvent
              onCancel={() => setCreating(false)}
              onCreated={() => { setCreating(false); loadAllEvents(); }}
            />
          </div>
        </div>
      )}

      {/* Event detail overlay - admins can always edit */}
      {selectedEventId && (
        <HostEventDetail canEdit={true} eventId={selectedEventId} onClose={() => { setSelectedEventId(null); loadAllEvents(); }} />
      )}
    </div>
  );
}

function UsersPage({ users = [], loading = false, error = '', searchTerm, setSearchTerm, onEdit, roleFilter = 'All', setRoleFilter = () => {} }) {
  const shortEmail = (value) => {
    if (!value) return '';
    const str = String(value);
    const [local, domain = ''] = str.split('@');
    const localShort = local.length > 8 ? local.slice(0, 8) : local;
    const domainShort = domain.length > 3 ? domain.slice(0, 3) + '...' : domain;
    return domain ? `${localShort}@${domainShort}` : localShort;
  };
  const filtered = useMemo(() => {
    const q = (searchTerm || '').toLowerCase();
    const normFilter = String(roleFilter || 'All');
    const matchText = (u) =>
      String(u.Name || u.name || '').toLowerCase().includes(q) ||
      String(u.Email || u.email || '').toLowerCase().includes(q);
    const matchRole = (u) => {
      if (normFilter === 'All') return true;
      const roles = u.Roles || u.roles || [];
      return Array.isArray(roles) && roles.map(String).some((r) => r.toLowerCase() === normFilter.toLowerCase());
    };
    return users.filter((u) => (!q || matchText(u)) && matchRole(u));
  }, [users, searchTerm, roleFilter]);

  const roleChipClass = (roleName) => {
    switch ((roleName || '').toLowerCase()) {
      case 'student':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'host':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'admin':
        return 'bg-green-200 text-green-800 border border-green-300';
      default:
        return 'bg-secondary/10 text-secondary';
    }
  };
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-primary">User Management</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-secondary/60 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {['All', 'Student', 'Host', 'Admin'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setRoleFilter(opt)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                (roleFilter || 'All') === opt
                  ? 'bg-primary text-white'
                  : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
              }`}
              aria-pressed={(roleFilter || 'All') === opt}
            >
              {opt}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8"><div className="spinner" /></div>
        )}
        {error && (
          <div className="rounded-lg border border-secondary/40 bg-white p-4 text-red-600">{error}</div>
        )}
        {!loading && !error && (
          <div className="space-y-3 text-left">
            {filtered.map((user) => {
              const name = user.Name || user.name || '';
              const email = user.Email || user.email || '';
              const roles = user.Roles || user.roles || [];
              const roleBadge = Array.isArray(roles) && roles.length ? roles[0] : (user.role || 'User');
              const badgeClass = roleChipClass(roleBadge);
              return (
                <button type="button" onClick={() => onEdit(user)}
                  key={user.User_ID || `${name}-${email}`}
                  className="flex w-full items-center justify-between rounded-lg border border-secondary/40 bg-white p-4 text-left hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                      {String(name).charAt(0) || '?'}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-text">{name}</p>
                      <p className="text-xs text-secondary sm:hidden">{shortEmail(email)}</p>
                      <p className="hidden sm:block text-sm text-secondary">{email}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium shrink-0 ml-2 ${badgeClass}`}>
                    {roleBadge}
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="rounded-lg border border-secondary/40 bg-white p-4 text-secondary">No users found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard({ onSignOut }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [metrics, setMetrics] = useState({ counts: {}, recent: {} });
  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [editingUser, setEditingUser] = useState(null);

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
    if (activeTab === 'users' && users.length === 0) {
      loadUsers();
    }
    if (activeTab === 'overview') {
      loadStats();
    }
  }, [activeTab, users.length]);

  useEffect(() => {
    if (users.length === 0) loadUsers();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadUsers(q = '') {
    try {
      setUsersLoading(true); setUsersError('');
      const token = localStorage.getItem('token');
      const list = await api.admin.listUsers(q, token);
      setUsers(Array.isArray(list) ? list : []);
    } catch (e) {
      setUsersError(e.message || 'Failed to load users');
    } finally { setUsersLoading(false); }
  }

  async function review(id, decision, comment) {
    try {
      const token = localStorage.getItem('token');
      await api.admin.reviewHostApplication(id, { decision, comment }, token);
      setApps((prev) => prev.filter((a) => a.Application_ID !== id));
      setSelectedApp(null);
    } catch (e) { alert(e.message || 'Failed to update'); }
  }

  async function loadStats() {
    try {
      const token = localStorage.getItem('token');
      const data = await api.admin.dashboard(token);
      setMetrics(data || { counts: {}, recent: {} });
    } catch (_) {
      setMetrics({ counts: {}, recent: {} });
    }
  }

  function HostAppsPage() {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">Host Applications</h2>
            <div className="flex gap-2">
              <button className="rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary" onClick={() => loadApps('Pending')}>Pending</button>
              <button className="rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary" onClick={() => loadApps('Approved')}>Approved</button>
              <button className="rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary" onClick={() => loadApps('Rejected')}>Rejected</button>
              <button className="rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary" onClick={() => loadApps('All')}>All</button>
            </div>
          </div>
          {appsLoading && <div className="flex items-center justify-center py-8"><div className="spinner" /></div>}
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
        <div className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl border border-secondary/40 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-primary">Review Application</h3>
            <button className="rounded px-3 py-1 text-secondary hover:bg-secondary/10" onClick={onClose}>×</button>
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
              <textarea className="mt-1 h-28 w-full rounded border p-2" value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button className="rounded-lg border border-secondary/60 px-4 py-2 text-sm text-secondary hover:border-primary hover:text-primary" onClick={onClose}>Cancel</button>
            {app.Status === 'Pending' && (
              <>
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90" onClick={() => review(app.Application_ID, 'APPROVED', comment)}>Approve</button>
                <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" onClick={() => review(app.Application_ID, 'REJECTED', comment)}>Reject</button>
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
        return <OverviewPage metrics={metrics} />;
      case 'events':
        return <EventsPage />;
      case 'hostapps':
        return <HostAppsPage />;
      case 'users':
        return (
          editingUser ? (
            <AdminUserEdit
              userId={editingUser.User_ID || editingUser.id}
              onBack={(result) => {
                setEditingUser(null);
                if (result?.deleted) {
                  setUsers((prev) => prev.filter((u) => u.User_ID !== result.id));
                } else if (result) {
                  loadUsers();
                }
              }}
            />
          ) : (
            <UsersPage
              users={users}
              loading={usersLoading}
              error={usersError}
              searchTerm={userSearch}
              setSearchTerm={setUserSearch}
              roleFilter={userRoleFilter}
              setRoleFilter={setUserRoleFilter}
              onEdit={(u) => setEditingUser(u)}
            />
          )
        );
      default:
        return <OverviewPage metrics={metrics} />;
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

      <div className="mx-auto max-w-7xl px-4 pt-20 pb-20 sm:px-6 lg:px-8 lg:pl-64 page-animate">
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
          { id: 'overview', label: 'Overview', icon: <Home size={16} /> },
          { id: 'events', label: 'Events', icon: <CalendarDays size={16} /> },
          { id: 'hostapps', label: 'Host Applications', icon: <ClipboardList size={16} /> },
          { id: 'users', label: 'Users', icon: <User2 size={16} /> },
        ]}
        onSignOut={onSignOut}
      />
    </div>
  );
}
