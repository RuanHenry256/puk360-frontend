// src/pages/ReviewEvent.jsx
import React, { useState } from 'react';
import Button from '../components/Button';
import { useParams, useNavigate } from 'react-router-dom';

export default function ReviewEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submit = (e) => {
    e.preventDefault();
    alert(`Submitted review for event #${id}: ${rating}⭐ — ${comment}`);
    navigate(`/events/${id}`);
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-4 text-xl font-bold text-primary">Review Event #{id}</h2>
      <form onSubmit={submit} className="grid gap-3">
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}
                className="rounded-lg border px-3 py-2">
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} star{n>1?'s':''}</option>)}
        </select>
        <textarea className="h-28 rounded-lg border px-3 py-2" placeholder="Your comment"
                  value={comment} onChange={(e)=>setComment(e.target.value)} />
        <Button type="submit" variant="primary" className="rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:bg-primary">Submit</Button>
      </form>
    </div>
  );
}
