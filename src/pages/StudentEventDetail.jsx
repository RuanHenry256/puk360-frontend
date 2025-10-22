import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { api } from '../api/client';

export default function StudentEventDetail({ eventId, onClose }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.events.get(eventId);
        if (!cancelled) { setEvent(data); setLoading(false); }
      } catch (e) { if (!cancelled) { setError(e.message || 'Failed to load event'); setLoading(false); } }
    })();
    return () => { cancelled = true; };
  }, [eventId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl border border-secondary/40 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Event Details</h2>
          <Button variant="link" onClick={onClose}>×</Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8"><Spinner size={36} label="Loading" /></div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-primary/5 p-4"><p className="text-sm text-secondary">Title</p><p className="font-semibold text-primary">{event.Title}</p></div>
              <div className="rounded-lg bg-primary/5 p-4"><p className="text-sm text-secondary">Category</p><p className="font-semibold text-primary">{event.category}</p></div>
              <div className="rounded-lg bg-primary/5 p-4"><p className="text-sm text-secondary">Date</p><p className="font-semibold text-primary">{typeof event.Date === 'string' ? new Date(event.Date + 'T00:00:00').toLocaleDateString('en-ZA') : ''}</p></div>
              <div className="rounded-lg bg-primary/5 p-4"><p className="text-sm text-secondary">Time</p><p className="font-semibold text-primary">{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</p></div>
              <div className="rounded-lg bg-primary/5 p-4"><p className="text-sm text-secondary">Campus</p><p className="font-semibold text-primary">{event.campus}</p></div>
              <div className="rounded-lg bg-primary/5 p-4"><p className="text-sm text-secondary">Venue</p><p className="font-semibold text-primary">{event.venue || '-'}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

