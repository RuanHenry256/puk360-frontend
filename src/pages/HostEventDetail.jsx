import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { api } from '../api/client';

export default function HostEventDetail({ eventId, onClose, canEdit = true }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.events.get(eventId);
        if (!cancelled) {
          setEvent(data);
          setForm({
            Title: data.Title || '',
            Description: data.Description || '',
            Date: typeof data.Date === 'string' ? data.Date.slice(0,10) : '',
            Time: data.Time || '',
            endTime: data.endTime || '',
            campus: data.campus || 'Potchefstroom',
            venue: data.venue || '',
            category: data.category || 'Entertainment',
            type: data.type || 'General Event',
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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-secondary/40 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Event Details</h2>
          <Button variant="link" onClick={onClose}>✕</Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8"><Spinner size={36} label="Loading" /></div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
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
                    <p className="font-semibold text-primary">{event.Time}{event.endTime ? ` - ${event.endTime}` : ''}</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4">
                    <p className="text-sm text-secondary">Campus</p>
                    <p className="font-semibold text-primary">{event.campus}</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4">
                    <p className="text-sm text-secondary">Venue</p>
                    <p className="font-semibold text-primary">{event.venue || '—'}</p>
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
                  <Button variant="outline" onClick={onDuplicate} disabled={!canEdit}>Duplicate</Button>
                  <Button variant="danger" onClick={onDelete} disabled={!canEdit || deleting}>{deleting ? 'Deleting…' : 'Delete'}</Button>
                  <Button onClick={() => setEditing(true)} variant="primary" disabled={!canEdit}>Edit</Button>
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
                    <input type="time" className="w-full rounded-lg border px-3 py-2" name="Time" value={form.Time} onChange={onChange} />
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
                  <label className="text-sm text-secondary">Type
                    <input className="w-full rounded-lg border px-3 py-2" name="type" value={form.type} onChange={onChange} />
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
