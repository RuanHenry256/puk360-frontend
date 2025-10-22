import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { api } from '../api/client';

export default function HostEventDetail({ eventId, onClose, canEdit = true, canManageRsvps = false }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [attendeeSearchInput, setAttendeeSearchInput] = useState('');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.events.get(eventId);
        if (!cancelled) {
          setEvent(data);
          try {
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/events/${eventId}/reviews`);
            const json = await res.json().catch(()=>null);
            const arr = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
            setReviews(arr);
          } catch (_) { /* ignore */ }
          setForm({
            Title: data.Title || '',
            Description: data.Description || '',
            Date: typeof data.Date === 'string' ? data.Date.slice(0,10) : '',
            startTime: data.startTime || '',
            endTime: data.endTime || '',
            campus: data.campus || 'Potchefstroom',
            venue: data.venue || '',
            category: data.category || 'Entertainment',
            hostedBy: data.hostedBy || 'NWU Events',
            ImageUrl: data.ImageUrl || '',
          });
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || 'Failed to load event');
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [eventId]);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const updated = await api.updateEvent(eventId, form, token);
      setEvent(updated);
      setEditing(false);
    } catch (e) {
      setError(e.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const onDuplicate = async () => {
    try {
      const token = localStorage.getItem('token');
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      const payload = { ...form, Host_User_ID: user?.id, Status: event.Status || 'Scheduled' };
      await api.events.create(payload, token);
      onClose?.();
    } catch (e) { setError(e.message || 'Failed to duplicate'); }
  };

  const onDelete = async () => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      await api.events.delete(eventId, token);
      onClose?.();
    } catch (e) { setError(e.message || 'Failed to delete'); }
    finally { setDeleting(false); }
  };

  const onUpdateStatus = async (newStatus) => {
    try {
      setStatusSaving(true);
      const token = localStorage.getItem('token');
      const updated = await api.events.updateStatus(eventId, newStatus, token);
      setEvent(updated);
    } catch (e) { setError(e.message || 'Failed to update status'); }
    finally { setStatusSaving(false); }
  };

  const loadAttendees = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/events/${eventId}/attendees`);
      const data = await res.json().catch(()=>null);
      const list = Array.isArray(data?.attendees) ? data.attendees : [];
      // Normalize numbers -> objects { id }
      const normalized = list.map(a => (typeof a === 'number' ? { id: a } : a || {}));
      setAttendees(normalized);
      setShowAttendees(true);
    } catch (_) { setAttendees([]); setShowAttendees(true); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl border border-secondary/40 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Event Details</h2>
          <Button variant="link" onClick={onClose}>✕</Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8"><Spinner size={36} label="Loading" /></div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : showAttendees ? (
          <div className="space-y-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-primary">Attendees</h3>
              <Button variant="link" onClick={() => setShowAttendees(false)}>Back</Button>
            </div>
            {/* Search input */}
            <div className="flex items-center gap-2 mb-2">
              <label className="sr-only" htmlFor="attendee-search">Search attendees</label>
              <div className="flex w-full">
                <input
                  id="attendee-search"
                  type="text"
                  placeholder="Search by name or email"
                  value={attendeeSearchInput}
                  onChange={(e)=>setAttendeeSearchInput(e.target.value)}
                  onKeyDown={(e)=>{ if (e.key==='Enter') setAttendeeSearch(attendeeSearchInput); }}
                  className="w-full rounded-l-lg border border-secondary/60 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {attendeeSearchInput && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={()=>{ setAttendeeSearchInput(''); setAttendeeSearch(''); }}
                    className="inline-flex items-center justify-center border border-l-0 border-secondary/60 bg-white px-3 py-2 text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    ×
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Search"
                  onClick={()=>setAttendeeSearch(attendeeSearchInput)}
                  className="inline-flex items-center justify-center rounded-r-lg border border-l-0 border-secondary/60 bg-white px-3 py-2 text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  🔍
                </button>
              </div>
            </div>
            {attendees.length === 0 ? (
              <p className="text-sm text-secondary">No attendees yet.</p>
            ) : (
              (()=>{
                const term = (attendeeSearch || '').toLowerCase();
                const visible = term
                  ? attendees.filter(a => `${a.name||a.Name||''} ${a.email||a.Email||''}`.toLowerCase().includes(term))
                  : attendees;
                return (
                  <ul className="space-y-2">
                    {visible.map(a => (
                      <li key={(a.id ?? a.User_ID ?? Math.random())} className="flex items-center justify-between rounded border border-secondary/30 p-2">
                        <div>
                          <p className="font-medium text-primary">{(a.name || a.Name || '').trim() || (a.id ? `User #${a.id}` : 'User')}</p>
                          {(a.email || a.Email) && <p className="text-xs text-secondary">{a.email || a.Email}</p>}
                        </div>
                        {canManageRsvps && (
                          <Button
                            variant="danger"
                            size="small"
                            onClick={async ()=>{
                              try {
                                const token = localStorage.getItem('token');
                                await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/events/${eventId}/join`, {
                                  method: 'DELETE',
                                  headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                                  body: JSON.stringify({ userId: a.id || a.User_ID })
                                });
                                await loadAttendees();
                              } catch (_) {}
                            }}
                          >Remove</Button>
                        )}
                      </li>
                    ))}
                  </ul>
                );
              })()
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {!editing ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-primary/5 p-4">
                    <p className="text-sm text-secondary">Title</p>
                    <p className="font-semibold text-primary">{event.Title}</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4">
                    <p className="text-sm text-secondary">Category</p>
                    <p className="font-semibold text-primary">{event.category}</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4">
                    <p className="text-sm text-secondary">Date</p>
                    <p className="font-semibold text-primary">{typeof event.Date === 'string' ? new Date(event.Date + 'T00:00:00').toLocaleDateString('en-ZA') : ''}</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4">
                    <p className="text-sm text-secondary">Time</p>
                    <p className="font-semibold text-primary">{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4">
                    <p className="text-sm text-secondary">Campus</p>
                    <p className="font-semibold text-primary">{event.campus}</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4">
                    <p className="text-sm text-secondary">Venue</p>
                    <p className="font-semibold text-primary">{event.venue || '-'}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  <label className="mr-auto text-sm text-secondary">Status
                    <select className="ml-2 rounded border px-2 py-1" disabled={statusSaving || !canEdit} value={event.Status || 'Scheduled'} onChange={(e)=>onUpdateStatus(e.target.value)}>
                      <option>Scheduled</option>
                      <option>Cancelled</option>
                      <option>Completed</option>
                    </select>
                  </label>
                  <Button variant="outline" onClick={loadAttendees}>Attendees</Button>
                  <Button variant="outline" onClick={onDuplicate} disabled={!canEdit}>Duplicate</Button>
                  <Button variant="danger" onClick={onDelete} disabled={!canEdit || deleting}>{deleting ? 'Deleting…' : 'Delete'}</Button>
                  <Button onClick={() => setEditing(true)} variant="primary" disabled={!canEdit}>Edit</Button>
                </div>
                {/* Reviews */}
                <div className="rounded-2xl border border-secondary/40 bg-white p-4">
                  <h3 className="mb-2 text-lg font-semibold text-primary">Reviews</h3>
                  {reviews.length === 0 ? (
                    <p className="text-sm text-secondary">No reviews yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {reviews.map((r) => (
                        <li key={r.id} className="rounded-lg border border-secondary/30 p-3">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-primary truncate pr-2">{r.title || 'Review'}</p>
                            <span className="text-yellow-500 text-sm">{'★'.repeat(Math.max(0, Math.min(5, Number(r.rating)||0)))}{'☆'.repeat(5 - Math.max(0, Math.min(5, Number(r.rating)||0)))}</span>
                          </div>
                          <p className="mt-1 text-sm text-secondary">by {r.reviewerName || `User #${r.reviewerId}`}</p>
                          {r.comment && <p className="mt-2 text-sm text-text whitespace-pre-wrap">{r.comment}</p>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-secondary">Title
                    <input className="w-full rounded-lg border px-3 py-2" name="Title" value={form.Title} onChange={onChange} />
                  </label>
                  <label className="text-sm text-secondary">Category
                    <input className="w-full rounded-lg border px-3 py-2" name="category" value={form.category} onChange={onChange} />
                  </label>
                  <label className="text-sm text-secondary">Date
                    <input type="date" className="w-full rounded-lg border px-3 py-2" name="Date" value={form.Date} onChange={onChange} />
                  </label>
                  <label className="text-sm text-secondary">Start time
                    <input type="time" className="w-full rounded-lg border px-3 py-2" name="startTime" value={form.startTime} onChange={onChange} />
                  </label>
                  <label className="text-sm text-secondary">End time
                    <input type="time" className="w-full rounded-lg border px-3 py-2" name="endTime" value={form.endTime} onChange={onChange} />
                  </label>
                  <label className="text-sm text-secondary">Campus
                    <select className="w-full rounded-lg border px-3 py-2" name="campus" value={form.campus} onChange={onChange}>
                      {['Potchefstroom','Mahikeng','Vaal'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                  <label className="text-sm text-secondary">Venue
                    <input className="w-full rounded-lg border px-3 py-2" name="venue" value={form.venue} onChange={onChange} />
                  </label>
                  <label className="text-sm text-secondary">Hosted By
                    <input className="w-full rounded-lg border px-3 py-2" name="hostedBy" value={form.hostedBy} onChange={onChange} />
                  </label>
                  <label className="text-sm text-secondary">Image URL
                    <input className="w-full rounded-lg border px-3 py-2" name="ImageUrl" value={form.ImageUrl} onChange={onChange} />
                  </label>
                </div>
                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  <Button variant="outline" onClick={() => { setEditing(false); }}>Cancel</Button>
                  <Button variant="primary" onClick={onSave} disabled={!canEdit || saving}>{saving ? 'Saving…' : 'Save'}</Button>
                  <Button variant="outline" onClick={onDuplicate} disabled={!canEdit}>Duplicate</Button>
                  <Button variant="danger" onClick={onDelete} disabled={!canEdit || deleting}>{deleting ? 'Deleting…' : 'Delete'}</Button>
                </div>
              </>
            )}
          </div>
        )}
    </div>
  </div>
);
}
