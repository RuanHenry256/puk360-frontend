// src/EventDetails.jsx
import React from 'react';
import { sampleEvents, formatEventDate } from './sampleEvents';
import Button from '../components/Button';
import ProfileButton from '../components/ProfileButton';

export default function EventDetails({ eventId, onBack, onShowProfile }) {
  const event = sampleEvents.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <Button
            type="button"
            onClick={onBack}
            variant="link"
            className="inline-flex items-center rounded-lg border border-secondary/60 bg-white px-3 py-1.5 text-sm font-semibold text-secondary no-underline hover:border-primary hover:text-primary"
          >
            ← Back
          </Button>
          <ProfileButton onClick={onShowProfile} ariaLabel="Open profile" title="Open profile" />
        </div>
        <p className="text-red-600">Event not found.</p>
      </div>
    );
  }

  const register = () => {
    // TODO: POST /api/events/:id/register
    alert(`Registered for "${event.title}"! (wire this to backend next)`);
    onBack();
  };

  const writeReview = () => {
    // TODO: open a review form / modal / route
    alert(`Open review form for "${event.title}"`);
  };

  return (
    <div className="bg-surface text-text">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            onClick={onBack}
            variant="link"
            className="inline-flex items-center rounded-lg border border-secondary/60 bg-white px-3 py-1.5 text-sm font-semibold text-secondary no-underline hover:border-primary hover:text-primary"
          >
            ← Back
          </Button>
          <ProfileButton onClick={onShowProfile} ariaLabel="Open profile" title="Open profile" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-secondary/40 bg-white shadow-sm">
          <img src={event.image} alt={event.title} className="h-64 w-full object-cover sm:h-80" />
          <div className="space-y-4 p-6">
            <h1 className="text-2xl font-bold text-primary sm:text-3xl">{event.title}</h1>
            <div className="flex flex-col gap-1 text-sm text-secondary sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <span className="font-medium text-primary">{event.category}</span>
              <span>{formatEventDate(event.date)}</span>
              <span>{event.location}</span>
            </div>

            <p className="text-sm text-gray-700">
              This is a short description for the event. Replace with real content from your backend later.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={register}
                variant="primary"
                className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-primary sm:w-auto"
              >
                Register
              </Button>
              <Button
                type="button"
                onClick={writeReview}
                variant="outline"
                className="w-full rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white sm:w-auto"
              >
                Write a review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
