// src/components/EventCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatEventDate } from '../data/sampleEvents';

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/events/${event.id}`);

  return (
    <li
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-secondary/40 bg-white shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label={`View details for ${event.title}`}
    >
      <img
        src={event.image}
        alt={event.title}
        className="h-48 w-full object-cover sm:h-64"
        draggable="false"
      />
      <div className="flex flex-col gap-3 px-4 py-5 text-left sm:px-6">
        <h2 className="text-xl font-semibold text-primary sm:text-2xl">{event.title}</h2>
        <div className="flex flex-col gap-1 text-sm text-secondary sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <span className="font-medium text-primary">{event.category}</span>
          <span>{formatEventDate(event.date)}</span>
          <span>{event.location}</span>
        </div>
        <span className="mt-1 inline-flex w-fit rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
          Tap to view details
        </span>
      </div>
    </li>
  );
}
