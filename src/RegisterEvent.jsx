// src/pages/RegisterEvent.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function RegisterEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Registered for event #${id}! (Wire this to backend later)`);
    navigate(`/events/${id}`);
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-4 text-xl font-bold text-primary">Register for Event #{id}</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input className="rounded-lg border px-3 py-2" placeholder="Your name" required />
        <input className="rounded-lg border px-3 py-2" placeholder="Your email" type="email" required />
        <button className="rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:bg-primary">Confirm</button>
      </form>
    </div>
  );
}
