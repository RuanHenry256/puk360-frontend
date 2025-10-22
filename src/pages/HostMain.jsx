import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Home, CalendarDays, Newspaper, User2 } from 'lucide-react';
import { api } from '../api/client';
import HostCreateEvent from './HostCreateEvent';
import HostEventDetail from './HostEventDetail';
import EventListing from './EventListing';
import Button from '../components/Button';

// HostMain: Minimal scaffold for host-facing dashboard/workspace
// Purpose: Provide a clean starting point for your devs to extend.
export default function HostMain({ onSignOut }) {
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'myevents' | 'requests'
  const [menuOpen, setMenuOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [user, setUser] = useState(() => {
    try { const raw = localStorage.getItem('user'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });

  async function loadMyEvents() {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const list = await api.events.list({ hostUserId: user.id });
      setMyEvents(list);
    } catch (e) {
      setError('Failed to load your events');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (activeSection === 'myevents') loadMyEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  const displayName = user?.name || 'Host';
  const isHostActive = !!(user?.hostStatus?.Is_Active === 1 || user?.hostStatus?.isActive === 1);
  const pageHeading = () => {
    switch (activeSection) {
      case 'myevents':
        return { title: 'My Events', subtitle: 'Manage and update your events.' };
      case 'account':
        return { title: 'Account', subtitle: 'Manage your host profile.' };
      case 'overview':
        return { title: `Welcome, ${displayName}`, subtitle: 'High-level snapshot for your events.' };
      case 'feed':
      default:
        return null; // Feed renders its own heading
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Home size={16} /> },
    { id: 'myevents', label: 'My Events', icon: <CalendarDays size={16} /> },
    { id: 'feed', label: 'Feed', icon: <Newspaper size={16} /> },
    { id: 'account', label: 'Account', icon: <User2 size={16} /> },
  ];

  const [stats, setStats] = useState({ avgRating: 0, totalUpcoming: 0, avgRsvpPerEvent: 0 });
  const [topRsvps, setTopRsvps] = useState([]);
  const [topReviews, setTopReviews] = useState([]);
  const [catMix, setCatMix] = useState([]);
  const [trend, setTrend] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  async function loadStats() {
    try {
      if (!user?.id) return;
      const s = await api.hosts.stats(user.id);
      const [rsvps, reviews, mix, tr, rec] = await Promise.all([
        api.hosts.topEvents(user.id, 'rsvps', 2),
        api.hosts.topEvents(user.id, 'reviews', 2),
        api.hosts.categoryMix(user.id),
        api.hosts.rsvpTrend(user.id, 30),
        api.hosts.recentReviews(user.id, 5),
      ]);
      setStats(s);
      setTopRsvps(rsvps);
      setTopReviews(reviews);
      setCatMix(mix);
      setTrend(tr);
      setRecentReviews(rec);
    } catch (_) { /* ignore */ }
  }

  // Initial stats load
  useEffect(() => { loadStats(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // Refresh stats whenever returning to the Overview tab
  useEffect(() => {
    if (activeSection === 'overview') loadStats();
  }, [activeSection]);

  const Overview = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-4 border border-secondary/30">
            <p className="text-sm text-secondary">Average Rating</p>
            <p className="text-3xl font-bold text-primary">{stats.avgRating.toFixed(2)}<span className="text-lg"> / 5</span></p>
          </div>
          <div className="rounded-lg bg-white p-4 border border-secondary/30">
            <p className="text-sm text-secondary">Upcoming Events</p>
            <p className="text-3xl font-bold text-primary">{stats.totalUpcoming}</p>
          </div>
          <div className="rounded-lg bg-white p-4 border border-secondary/30">
            <p className="text-sm text-secondary">Avg RSVPs / Event</p>
            <p className="text-3xl font-bold text-primary">{stats.avgRsvpPerEvent.toFixed(1)}</p>
          </div>
        </div>
      </div>

      {/* Top insights */}
      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-primary">Most‑attended</h3>
            {topRsvps.length === 0 ? (
              <p className="text-sm text-secondary">No RSVPs yet.</p>
            ) : (
              <ul className="space-y-2">
                {topRsvps.map((e) => (
                  <li key={e.id} className="flex items-center justify-between rounded-lg border border-secondary/30 p-2">
                    <span className="font-medium text-text truncate pr-2">{e.title}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-sm text-primary">{e.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-primary">Most‑reviewed</h3>
            {topReviews.length === 0 ? (
              <p className="text-sm text-secondary">No reviews yet.</p>
            ) : (
              <ul className="space-y-2">
                {topReviews.map((e) => (
                  <li key={e.id} className="flex items-center justify-between rounded-lg border border-secondary/30 p-2">
                    <span className="font-medium text-text truncate pr-2">{e.title}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-sm text-primary">{e.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Category mix & RSVP trend */}
      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-primary">Your top categories</h3>
            {catMix.length === 0 ? (
              <p className="text-sm text-secondary">No events yet.</p>
            ) : (
              <ul className="space-y-2">
                {catMix.map((c) => (
                  <li key={c.category} className="flex items-center gap-2">
                    <span className="w-28 truncate text-sm text-secondary">{c.category}</span>
                    <div className="h-2 flex-1 rounded bg-secondary/20">
                      <div className="h-2 rounded bg-primary" style={{ width: `${Math.min(100, (c.count / Math.max(...catMix.map(x=>x.count))) * 100)}%` }} />
                    </div>
                    <span className="w-8 text-right text-sm text-secondary">{c.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-primary">RSVPs (last 30 days)</h3>
            {trend.length === 0 ? (
              <p className="text-sm text-secondary">No data yet.</p>
            ) : (
              <div className="flex items-end gap-1 rounded border border-secondary/30 p-2">
                {trend.map((d) => {
                  const max = Math.max(...trend.map(x=>x.rsvps||0)) || 1;
                  const h = 8 + Math.round(((d.rsvps||0) / max) * 40);
                  return <div key={d.day} title={`${d.day}: ${d.rsvps}`} style={{ height: h }} className="w-1.5 bg-primary/60" />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Most Recent Reviews */}
      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">Most Recent Reviews</h3>
        {recentReviews.length === 0 ? (
          <p className="text-sm text-secondary">No reviews yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentReviews.map((r) => {
              const rating = Math.max(0, Math.min(5, Number(r.rating) || 0));
              const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
              const title = r.title && String(r.title).trim().length ? String(r.title).trim() : '';
              const dt = new Date(r.createdAt || Date.now()).toLocaleString('en-ZA', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
              return (
                <li key={r.id} className="rounded-lg border border-secondary/30 p-3">
                  {/* Top line with event badge */}
                  <div className="flex items-center justify-end">
                    <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary">{r.eventTitle || `Event #${r.eventId}`}</span>
                  </div>
                  {/* Body formatted to match event details */}
                  <div className="mt-1 text-yellow-500 text-base text-center">{stars}</div>
                  {title && <p className="mt-1 text-center italic font-semibold text-primary">"{title}"</p>}
                  {r.comment && <p className="mt-1 text-center text-sm text-text whitespace-pre-wrap">{r.comment}</p>}
                  <p className="mt-1 text-center text-sm font-semibold text-primary">By {r.reviewerName || `User #${r.reviewerId}`}</p>
                  {/* Footer date/time */}
                  <div className="mt-2 flex justify-end">
                    <span className="text-xs text-secondary">{dt}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );

  const [query, setQuery] = useState('');
  const [range, setRange] = useState('upcoming'); // 'upcoming' | 'past' | 'all'
  const [statusFilter, setStatusFilter] = useState(''); // '', 'Scheduled','Cancelled','Completed'
  const filteredMyEvents = myEvents.filter((e) => {
    const d = new Date((typeof e.Date === 'string' ? e.Date : e.Date?.toString()) + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const textMatch = !query || (e.Title || '').toLowerCase().includes(query.toLowerCase());
    const statusMatch = !statusFilter || (e.Status || '').toLowerCase() === statusFilter.toLowerCase();
    const dateMatch = range === 'all' ? true : range === 'upcoming' ? d >= today : d < today;
    return textMatch && statusMatch && dateMatch;
  });
  const MyEvents = () => (
    <div className="space-y-4">
      {!isHostActive && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
          Your host account is not active. You can view analytics and the feed, but creating or editing events is disabled.
        </div>
      )}
      <div className="rounded-2xl border border-secondary/40 bg-white p-3 shadow-sm">
        <div className="mb-2">
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

          {isHostActive && (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="ml-auto hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 lg:inline-flex"
            >
              + Create Event
            </button>
          )}
        </div>
      </div>

      {loading && <div className="rounded-lg border border-secondary/40 bg-white p-4 text-secondary">Loading…</div>}
      {error && <div className="rounded-lg border border-secondary/40 bg-white p-4 text-red-600">{error}</div>}
      {!loading && !error && filteredMyEvents.length === 0 && (
        <div className="rounded-lg border border-secondary/40 bg-white p-6 text-secondary">You have no events yet. {isHostActive ? 'Click Create Event to add one.' : ''}</div>
      )}
      {!loading && !error && filteredMyEvents.map((e) => (
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
              disabled={!isHostActive}
              className="w-full sm:w-auto rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary disabled:opacity-50"
              onClick={(ev)=>{ ev.stopPropagation(); duplicateEvent(e); }}
              onKeyDown={(ev)=>ev.stopPropagation()}
            >
              Duplicate
            </button>
            <button
              disabled={!isHostActive}
              className="w-full sm:w-auto rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary disabled:opacity-50"
              onClick={(ev)=>{ ev.stopPropagation(); updateStatus(e,'Cancelled'); }}
              onKeyDown={(ev)=>ev.stopPropagation()}
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );

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
        Host_User_ID: user?.id,
        Status: e.Status || 'Scheduled',
      }, token);
      await loadMyEvents();
    } catch (_) {}
  }
  async function deleteEvent(e) {
    if (!window.confirm('Delete this event?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.events.delete(e.Event_ID, token);
      await loadMyEvents();
    } catch (_) {}
  }
  async function updateStatus(e, Status) {
    try {
      const token = localStorage.getItem('token');
      await api.events.updateStatus(e.Event_ID, Status, token);
      await loadMyEvents();
    } catch (_) {}
  }

  const Account = () => (
    <div className="space-y-4">
      {/* Account status notice */}
      <div
        className={
          `flex items-center gap-2 rounded-xl border p-3 text-sm ` +
          (isHostActive
            ? 'border-green-300 bg-green-50 text-green-800'
            : 'border-yellow-300 bg-yellow-50 text-yellow-800')
        }
      >
        {isHostActive ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L7.5 12.086l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.59c.75 1.336-.213 2.987-1.742 2.987H3.48c-1.53 0-2.492-1.651-1.743-2.987l6.52-11.59zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V7a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
          </svg>
        )}
        <span className="font-medium">
          Host account status: {isHostActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <HostAccountEditor user={user} onUpdated={setUser} />
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'myevents':
        return <MyEvents />;
      case 'feed':
        return <FeedView />;
      case 'account':
        return <Account />;
      case 'overview':
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen text-text">
      {/* Title bar with burger */}
      <div className="fixed inset-x-0 top-0 z-40 h-16 border-b border-secondary/40 bg-primary/5 backdrop-blur">
        <div className="flex h-full items-center justify-start px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded p-2 text-primary hover:bg-primary/10"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <h1 className="text-xl font-bold text-primary lg:text-left">Host Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8 page-animate">
        {(() => {
          const h = pageHeading();
          return h ? (
            <header className="mb-4 flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">{h.title}</h1>
              {h.subtitle && <p className="text-sm text-white/80 sm:text-base">{h.subtitle}</p>}
            </header>
          ) : null;
        })()}
        {renderSection()}
      </div>

      {/**
       * Floating Action Button (FAB) — visual ONLY
       * ------------------------------------------------------------------
       * - Shows only on the "My Events" tab to emphasize quick event create.
       * - Non-functional placeholder: your devs can attach navigation later.
       * - Positioned above the BottomTabBar; adjust bottom spacing if needed.
       * - Safe to remove at any time without side effects.
       * ------------------------------------------------------------------
       */}
      {activeSection === 'myevents' && !creating && isHostActive && (
        <button
          type="button"
          aria-label="Create new event"
          title="Create new event"
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 transform rounded-full bg-primary text-white shadow-xl ring-4 ring-primary/20 hover:opacity-95 active:scale-95 transition w-16 h-16 flex items-center justify-center text-3xl lg:hidden"
          onClick={() => setCreating(true)}
        >
          +
        </button>
      )}

      {/* Create form overlay */}
      {activeSection === 'myevents' && creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <HostCreateEvent
              onCancel={() => setCreating(false)}
              onCreated={() => { setCreating(false); loadMyEvents(); loadStats(); }}
            />
          </div>
        </div>
      )}

      {/* Host event detail overlay */}
      {activeSection === 'myevents' && selectedEventId && (
        <HostEventDetail canEdit={isHostActive} eventId={selectedEventId} onClose={() => { setSelectedEventId(null); loadMyEvents(); }} />
      )}

      <Sidebar
        dropdown
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={menuItems}
        activeId={activeSection}
        onSelect={setActiveSection}
        onSignOut={onSignOut}
      />
  </div>
);
}

// Host account editor with StudentProfile-like UX
function HostAccountEditor({ user, onUpdated }) {
  const fallbackName = user?.name || 'Host';
  const fallbackEmail = user?.email || '';

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: fallbackName, email: fallbackEmail });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormData({ name: fallbackName, email: fallbackEmail });
  }, [fallbackName, fallbackEmail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatusMessage('');
    setErrorMessage('');
  };

  const handleSave = async () => {
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    if (!trimmedName || !trimmedEmail) {
      setErrorMessage('Please provide both name and email.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    try {
      setIsSaving(true);
      setErrorMessage('');
      setStatusMessage('');
      const token = localStorage.getItem('token');
      const { user: updatedUser } = await api.updateProfile({ name: trimmedName, email: trimmedEmail }, token);
      const nextUser = { ...(user || {}), ...updatedUser };
      localStorage.setItem('user', JSON.stringify(nextUser));
      onUpdated?.(nextUser);
      setStatusMessage('Profile updated successfully.');
      setIsEditing(false);
    } catch (err) {
      const message = err?.message || 'Failed to update profile. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: fallbackName, email: fallbackEmail });
    setStatusMessage('');
    setErrorMessage('');
    setIsEditing(false);
  };

  const isDirty = formData.name.trim() !== fallbackName || formData.email.trim() !== fallbackEmail;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-primary">Your details</h3>
        {!isEditing ? (
          <Button type="button" variant="primary" onClick={() => setIsEditing(true)} size="small">
            Edit profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} size="small">
              Cancel
            </Button>
            <Button type="button" variant="primary" onClick={handleSave} disabled={!isDirty || isSaving} size="small">
              {isSaving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        )}
      </div>

      {(statusMessage || errorMessage) && (
        <p className={`text-sm ${errorMessage ? 'text-red-600' : 'text-green-600'}`}>
          {errorMessage || statusMessage}
        </p>
      )}

      {!isEditing ? (
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-secondary/10 p-4">
            <dt className="text-sm font-medium text-secondary">Name</dt>
            <dd className="text-lg font-semibold text-primary">{fallbackName}</dd>
          </div>
          <div className="rounded-xl bg-secondary/10 p-4">
            <dt className="text-sm font-medium text-secondary">Email</dt>
            <dd className="text-lg font-semibold text-primary break-words">{fallbackEmail}</dd>
          </div>
        </dl>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
            Name
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="rounded-lg border border-secondary/60 px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="rounded-lg border border-secondary/60 px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>
        </div>
      )}
    </div>
  );
}

function FeedView() {
  return (
    <div className="space-y-4">
      <EventListing onSelectEvent={() => {}} onShowProfile={() => {}} showTopBar={false} />
    </div>
  );
}
