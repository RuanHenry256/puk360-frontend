import React, { useState } from 'react';
import Button from '../components/Button';
import { api } from '../api/client';

const CAMPUSES = ['Potchefstroom', 'Mahikeng', 'Vaal'];
const CATEGORIES = ['Entertainment', 'Community', 'Music', 'Sports', 'Art', 'Academic'];

export default function HostCreateEvent({ onCancel, onCreated }) {
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    Title: '',
    Description: '',
    Date: '',
    Time: '',
    endTime: '',
    campus: 'Potchefstroom',
    venue: '',
    category: 'Entertainment',
    type: 'General Event',
    hostedBy: 'NWU Events',
    ImageUrl: '',
  });

  const update = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      if (!token || !user?.id) throw new Error('Not signed in');

      const payload = {
        ...form,
        Host_User_ID: user.id,
        Status: 'Scheduled',
      };

      const created = await api.events.create(payload, token);
      onCreated?.(created);
    } catch (e2) {
      setError(e2.message || 'Failed to create event');
    }
  };

  return (
    <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-primary">Create Event</h2>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-secondary">Title</label>
          <input name="Title" value={form.Title} onChange={update} required className="w-full rounded-lg border px-3 py-2" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-secondary">Description</label>
          <textarea name="Description" value={form.Description} onChange={update} rows={4} className="w-full rounded-lg border px-3 py-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Date</label>
            <input type="date" name="Date" value={form.Date} onChange={update} required className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Start Time</label>
            <input type="time" name="Time" value={form.Time} onChange={update} required className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">End Time</label>
            <input type="time" name="endTime" value={form.endTime} onChange={update} className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Campus</label>
            <select name="campus" value={form.campus} onChange={update} className="w-full rounded-lg border px-3 py-2">
              {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Venue (text)</label>
            <input name="venue" value={form.venue} onChange={update} placeholder="e.g. Amphi Theatre" className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Category</label>
            <select name="category" value={form.category} onChange={update} className="w-full rounded-lg border px-3 py-2">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Type</label>
            <input name="type" value={form.type} onChange={update} className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Hosted By</label>
            <input name="hostedBy" value={form.hostedBy} onChange={update} className="w-full rounded-lg border px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-secondary">Image URL</label>
          <input name="ImageUrl" value={form.ImageUrl} onChange={update} placeholder="https://…" className="w-full rounded-lg border px-3 py-2" />
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Create Event</Button>
        </div>
      </form>
    </div>
  );
}
