import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import TopBar from "../components/TopBar";
import { api } from "../api/client";
import { Tag, Building2, CalendarDays, Clock3, MapPin } from 'lucide-react';

export default function ReviewEventDetail({ eventId, onBack, onShowProfile }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvp, setRsvp] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0); // 0 = all, 1..5 specific
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [showFullImage, setShowFullImage] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [notify, setNotify] = useState({ visible: false, type: 'success', message: '' });

  const showMessage = (type, message) => {
    setNotify({ visible: true, type, message });
    setTimeout(() => setNotify((n) => ({ ...n, visible: false })), 2500);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!eventId) {
        setError("No event selected");
        setLoading(false);
        return;
      }
      try {
        const data = await api.events.get(eventId);
        if (!cancelled) {
          setEvent(data);
          // load reviews
          try {
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/events/${eventId}/reviews`);
            const json = await res.json().catch(() => null);
            const arr = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
            setReviews(arr);
          } catch (_) { /* ignore */ }
          // Load RSVP state for current user
          try {
            const raw = localStorage.getItem('user');
            const u = raw ? JSON.parse(raw) : null;
            if (u?.id) {
              const att = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/events/${eventId}/attendees`);
              const aj = await att.json().catch(()=>null);
              const ids = Array.isArray(aj?.attendees) ? aj.attendees.map(a=>a.id ?? a) : [];
              setRsvp(ids.includes(u.id));
            }
          } catch { /* ignore */ }
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Failed to load event");
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [eventId]);

  const formatDate = (dateString) =>
    dateString ? new Date(`${dateString}T00:00:00`).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const formatTime = (t) => (typeof t === 'string' ? t.slice(0,5) : '');
  const isEventOver = (e) => {
    if (!e) return false;
    try {
      const datePart = typeof e.Date === 'string' ? e.Date : new Date(e.Date).toISOString().slice(0,10);
      const timePart = (e.endTime || e.startTime || '23:59').toString().slice(0,5);
      const endDt = new Date(`${datePart}T${timePart}:00`);
      return new Date() >= endDt;
    } catch { return false; }
  };

  const handleRSVP = async () => {
    try {
      const token = localStorage.getItem('token');
      const raw = localStorage.getItem('user');
      const u = raw ? JSON.parse(raw) : null;
      if (!u?.id) throw new Error('Please sign in to RSVP');
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/events/${event?.Event_ID}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ userId: u.id })
      });
      if (!res.ok) {
        const d = await res.json().catch(()=>({}));
        throw new Error(d?.error || 'Failed to RSVP');
      }
      setRsvp(true);
      showMessage('success', 'RSVP saved. See it on your profile under “RSVP\'d Events”.');
    } catch (e) {
      showMessage('error', e.message || 'Failed to RSVP');
    }
  };

  const handleCancelRSVP = async () => {
    try {
      const token = localStorage.getItem('token');
      const raw = localStorage.getItem('user');
      const u = raw ? JSON.parse(raw) : null;
      if (!u?.id) throw new Error('Please sign in');
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/events/${event?.Event_ID}/join`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ userId: u.id })
      });
      if (!res.ok) {
        const d = await res.json().catch(()=>({}));
        throw new Error(d?.error || 'Failed to cancel RSVP');
      }
      setRsvp(false);
      showMessage('success', 'Your RSVP has been canceled.');
    } catch (e) {
      showMessage('error', e.message || 'Failed to cancel RSVP');
    }
  };

  /**const handleSubmit = () => {
    console.log("Review submitted:", { reviewTitle, review, rating });
    alert("Thanks for your review!");
    setReview("");
    setReviewTitle("");
    setRating(0);
  };  <-- Real **/
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/events/${event?.Event_ID}/reviews`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ rating, title: reviewTitle, comment: review })
      });
      if (!res.ok) throw new Error('Failed to submit review');
      setReview('');
      setReviewTitle('');
      setRating(0);
      setShowReviewModal(false);
      // refresh reviews
      const refreshed = await (await fetch(endpoint.replace('/reviews','/reviews'))).json().catch(()=>null);
      const arr = Array.isArray(refreshed?.data) ? refreshed.data : (Array.isArray(refreshed) ? refreshed : []);
      setReviews(arr);
      showMessage('success', 'Thanks! Your review was submitted.');
    } catch (err) {
      console.error('Error:', err);
      showMessage('error', err.message || 'Something went wrong submitting your review.');
    }
  };
  const openFullImage = () => setShowFullImage(true);
  const closeFullImage = () => setShowFullImage(false);
  const openGuidelines = () => setShowGuidelines(true);
  const closeGuidelines = () => setShowGuidelines(false);

  // Derive current user from localStorage for display purposes
  let currentUserName = 'Anonymous';
  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const u = JSON.parse(raw);
      currentUserName = u?.name || u?.firstName || u?.email || 'User';
    }
  } catch {}

  if (loading) {
    return (
      <div className="text-text">
        <TopBar onBack={onBack} onProfileClick={onShowProfile} backLabel="Back to Events" />
        <div className="mx-auto max-w-6xl px-4 pt-[88px] pb-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12"><Spinner size={40} label="Loading event" /></div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-text">
        <TopBar onBack={onBack} onProfileClick={onShowProfile} backLabel="Back to Events" />
        <div className="mx-auto max-w-6xl px-4 pt-[88px] pb-6 sm:px-6 lg:px-8">
          <p className="text-red-600">{error || 'Event not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-text">
      {/* Fixed top bar */}
      <TopBar onBack={onBack} onProfileClick={onShowProfile} backLabel="Back to Events" />
      {notify.visible && (
        <div className="fixed inset-x-0 top-4 z-50 flex justify-center">
          <div className={`rounded-lg px-4 py-2 text-sm ${notify.type==='success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {notify.message}
          </div>
        </div>
      )}
      <div className="mx-auto max-w-6xl px-4 pt-[88px] pb-6 sm:px-6 lg:px-8">

        {/* Full Image Modal */}
        {showFullImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeFullImage}>
            <div className="relative max-h-2xl max-w-2xl">
              {event.ImageUrl ? (
                <img src={event.ImageUrl} alt={event.Title} className="max-h-[70vh] w-auto rounded-lg object-contain" />
              ) : (
                <div className="flex h-96 w-full items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-2xl font-bold text-white">
                  No image available
                </div>
              )}
              <Button
                onClick={closeFullImage}
                type="button"
                variant="link"
                className="absolute right-4 top-4 rounded-full bg-white p-2 text-secondary no-underline transition-colors hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>
        )}

        {/* Guidelines Modal */}
        {showGuidelines && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeGuidelines}>
            <div className="mx-4 w-full max-w-md rounded-2xl border border-secondary/30 bg-primary/5 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-primary">Review Guidelines</h3>
                  <Button onClick={closeGuidelines} type="button" variant="link" className="text-secondary no-underline transition-colors hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
                <ul className="space-y-3 text-secondary">
                  <li>✓ Be honest and respectful in your feedback.</li>
                  <li>✓ Avoid personal attacks and inappropriate language.</li>
                  <li>✓ Share specific details about your experience.</li>
                </ul>
              </div>
              <div className="flex justify-end bg-secondary/10 p-4">
                <Button onClick={closeGuidelines} variant="primary">Got it</Button>
              </div>
            </div>
          </div>
        )}

        {/* Sections wrapper to enforce spacing between cards */}
        <div className="grid gap-6">
          {/* Content card */}
          <div className="overflow-hidden rounded-2xl border border-secondary/40 bg-primary/5 p-4 shadow-sm sm:p-6">
            {/* Poster preview (4:3 crop) */}
            <div className="relative w-full cursor-pointer overflow-hidden rounded-xl" onClick={openFullImage} aria-label="View full image">
              <div className="pt-[75%]" />
              {event.ImageUrl ? (
                <img
                  src={event.ImageUrl}
                  alt={event.Title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-xl font-bold text-white">
                  No image available
                </div>
              )}
            </div>
            <div className="mt-6">
              <h2 className="mb-2 text-3xl font-bold text-primary sm:text-4xl">{event.Title}</h2>
              <p className="text-sm text-secondary">{event.Description || 'No description provided.'}</p>
            </div>
            
            <div className="mt-8">
              <h3 className="mb-2 text-2xl font-bold text-primary">Event Summary</h3>
              <p className="mb-6 text-sm text-secondary">Here's a quick snapshot of the key details.</p>
              <div className="space-y-3">
                {/* Details rows justified: label left, value right */}
                <div className="flex items-center">
                  <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <Tag size={18} className="text-primary" />
                    Category
                  </span>
                  <span className="ml-4 flex-1 text-right font-medium text-text">{event.category || 'Event'}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <Building2 size={18} className="text-primary" />
                    Hosted by
                  </span>
                  <span className="ml-4 flex-1 text-right font-medium text-text">{event.hostedBy || 'NWU Events'}</span>
                </div>
                <div className="flex items-center">
                  <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <CalendarDays size={18} className="text-primary" />
                    Date
                  </span>
                  <span className="ml-4 flex-1 text-right font-medium text-text">{formatDate(event.Date)}</span>
                </div>
                <div className="flex items-center">
                  <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <Clock3 size={18} className="text-primary" />
                    Time
                  </span>
                  <span className="ml-4 flex-1 text-right font-medium text-text">{`${formatTime(event.startTime)}${event.endTime ? ` - ${formatTime(event.endTime)}` : ''}`}</span>
                </div>
                <div className="flex items-center">
                  <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <MapPin size={18} className="text-primary" />
                    Location
                  </span>
                  <span className="ml-4 flex-1 text-right font-medium text-text">{event.venue || event.campus || 'TBA'}</span>
                </div>
              </div>

              {/* RSVP action now part of summary */}
              <div className="mt-6">
                <h4 className="mb-3 text-xl font-semibold text-primary">Will you be attending?</h4>
                {isEventOver(event) ? null : (
                  rsvp ? (
                    <Button onClick={handleCancelRSVP} variant="outline" size="large">Cancel RSVP</Button>
                  ) : (
                    <Button onClick={handleRSVP} variant="primary" size="large">RSVP to this Event</Button>
                  )
                )}
                {rsvp && (
                  <p className="mt-3 text-sm font-medium text-primary">You're attending this event! We'll send you a reminder.</p>
                )}
              </div>
            </div>
          </div>

          {/* Write a review CTA + Reviews in a single container */}
          <div className="overflow-hidden rounded-2xl border border-secondary/40 bg-white p-4 shadow-sm sm:p-6 text-left">
            {/* CTA */}
            <div className="mb-4">
              <h2 className="mb-2 text-2xl font-bold text-primary">Have you attended this event?</h2>
              {isEventOver(event) ? (
                <>
                  <p className="mb-4 text-sm text-secondary">Let us know how it went — your feedback helps other students.</p>
                  <div className="flex items-center gap-3">
                    <Button onClick={() => setShowReviewModal(true)} variant="primary">Write a Review</Button>
                    <Button onClick={openGuidelines} variant="link" className="no-underline text-secondary hover:text-primary">View Guidelines</Button>
                  </div>
                </>
              ) : (
                <p className="mb-2 text-sm text-secondary">Review this event as soon as you come home from it — you’ll be able to post once the event is over.</p>
              )}
            </div>
            <hr className="my-4 border-secondary/20" />
            {/* Reviews */}
            <h3 className="mb-3 text-xl font-semibold text-primary">Reviews</h3>
            {(() => {
              const all = Array.isArray(reviews) ? reviews : [];
              const total = all.length;
              if (total === 0) return <p className="text-sm text-secondary">{isEventOver(event) ? 'No reviews yet. Be the first to leave one!' : 'No reviews yet — come back when the party is finished!'}</p>;

              const sum = all.reduce((s, r) => s + (Number(r.rating) || 0), 0);
              const avg = Math.round((sum / total) * 10) / 10;
              const counts = [1,2,3,4,5].reduce((acc, n) => { acc[n] = all.filter(r => Number(r.rating) === n).length; return acc; }, {});
              const visible = ratingFilter ? all.filter(r => Number(r.rating) === ratingFilter) : all;
              const percent = (n) => Math.round((n / total) * 100);
              const Star = ({ filled }) => (<span className={filled ? 'text-yellow-500' : 'text-secondary/30'}>★</span>);

              return (
                <>
                  {/* Summary header */}
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-primary">{avg.toFixed(1)}</span>
                      <span className="text-lg">
                        {[1,2,3,4,5].map(i => <Star key={i} filled={i <= Math.round(avg)} />)}
                      </span>
                      <span className="text-sm text-secondary">{total} review{total!==1?'s':''}</span>
                    </div>
                    {/* Rating filter chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      {[0,5,4,3,2,1].map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setRatingFilter(v)}
                          className={`rounded-full border px-3 py-1 text-sm ${ratingFilter===v ? 'border-primary text-primary bg-primary/5' : 'border-secondary/40 text-secondary hover:bg-primary/5'}`}
                        >
                          {v===0 ? 'All' : `${v}★`} {v===0 ? '' : `(${counts[v]||0})`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Histogram */}
                  <div className="mb-4 space-y-1.5">
                    {[5,4,3,2,1].map(star => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-4 text-right text-xs text-secondary">{star}</span>
                        <span className="text-yellow-500 text-xs">★</span>
                        <div className="relative h-2 flex-1 rounded bg-secondary/20">
                          <div className={`absolute inset-y-0 left-0 rounded ${star>=4 ? 'bg-green-500' : star===3 ? 'bg-yellow-400' : 'bg-red-400'}`}
                               style={{ width: `${percent(counts[star]||0)}%` }} />
                        </div>
                        <span className="w-10 text-right text-xs text-secondary">{counts[star]||0}</span>
                      </div>
                    ))}
                  </div>

                  {/* Review list */}
                  <ul className="space-y-3 text-left">
                    {visible.map(r => {
                      const rating = Math.max(0, Math.min(5, Number(r.rating) || 0));
                      const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
                      const title = r.title && String(r.title).trim().length ? String(r.title).trim() : '';
                      const byline = r.reviewerName || `User #${r.reviewerId}`;
                      const dt = new Date(r.createdAt || Date.now()).toLocaleString('en-ZA', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
                      return (
                        <li key={r.id} className="rounded-lg border border-secondary/30 p-4 text-left">
                          <div className="text-yellow-500 text-xl leading-none mb-2">{stars}</div>
                          {title && (
                            <p className="mb-2 italic font-semibold text-primary">"{title}"</p>
                          )}
                          {r.comment && (
                            <p className="mb-2 text-sm text-text whitespace-pre-wrap">{r.comment}</p>
                          )}
                          <p className="mt-1 font-semibold text-primary">By {byline}</p>
                          <div className="mt-1 flex justify-end">
                            <span className="text-xs text-secondary">{dt}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              );
            })()}
          </div>

          
        </div>
        {/* End sections wrapper */}
      </div>
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl border border-secondary/40 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-primary">Write a Review</h3>
              <Button variant="link" onClick={() => setShowReviewModal(false)}>×</Button>
            </div>
            <div className="mb-4">
              <p className="mr-4 flex-shrink-0 font-medium text-primary">Choose a rating</p>
            </div>
            <div className="mb-6 flex w-full items-center justify-center">
              <div className="flex gap-4">
                {[1,2,3,4,5].map((star)=> (
                  <button key={star} type="button" onClick={() => setRating(star)} className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`} style={{ fontSize: '48px', lineHeight: '1' }}>
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-2 block font-medium text-primary">Review Title</label>
              <input type="text" value={reviewTitle} onChange={(e)=>setReviewTitle(e.target.value)} placeholder="Summarize your experience" className="w-full rounded-lg border border-secondary/60 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="mb-2">
              <label className="mb-2 block font-medium text-primary">Your Review</label>
              <textarea value={review} onChange={(e)=>setReview(e.target.value)} placeholder="Share details of your experience at this event" className="h-40 w-full rounded-lg border border-secondary/60 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-secondary">{review.length}/2000 characters</p>
              <p className="text-sm text-secondary">Reviewing as: <span className="font-medium">{currentUserName}</span></p>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReviewModal(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!rating || !reviewTitle || !review} variant={!rating || !reviewTitle || !review ? 'outline' : 'primary'}>Submit Review</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
