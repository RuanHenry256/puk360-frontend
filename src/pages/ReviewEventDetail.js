import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import TopBar from "../components/TopBar";
import { api } from "../api/client";

export default function ReviewEventDetail({ eventId, onBack, onShowProfile }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvp, setRsvp] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [showFullImage, setShowFullImage] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

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

  const handleRSVP = () => {
    setRsvp((prev) => !prev);
    alert(!rsvp ? "You're attending this event!" : "You're no longer attending this event");
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
    const res = await fetch("http://localhost:5000/api/postreview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewerId : 4, // TODO: use logged-in user
        userId: 2,      // TODO: use logged-in user
        eventId: event?.Event_ID,
        rating,
        comment: review,
        //reviewTitle: reviewTitle
      }),
    });

    if (res.ok) {
      alert("Thanks for your review!");
      setReview("");
      setReviewTitle("");
      setRating(0);
    } else {
      alert("Failed to submit review");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong");
  }
};
  const openFullImage = () => setShowFullImage(true);
  const closeFullImage = () => setShowFullImage(false);
  const openGuidelines = () => setShowGuidelines(true);
  const closeGuidelines = () => setShowGuidelines(false);

  const user = { firstName: "Kamo", email: "Kamo@gmail.com" };

  if (loading) {
    return (
      <div className="text-text">
        <TopBar onBack={onBack} onProfileClick={onShowProfile} backLabel="Back to Events" />
        <div className="mx-auto max-w-6xl px-4 pt-[88px] pb-6 sm:px-6 lg:px-8">
          <p className="text-secondary">Loading event…</p>
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
      <div className="mx-auto max-w-6xl px-4 pt-[88px] pb-6 sm:px-6 lg:px-8">

        {/* Full Image Modal */}
        {showFullImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={closeFullImage}>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeGuidelines}>
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
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Content card */}
          <div className="overflow-hidden rounded-2xl border border-secondary/40 bg-primary/5 p-4 shadow-sm sm:p-6 lg:col-span-2">
            <div className="flex h-48 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-xl font-bold text-white" onClick={openFullImage}>
              {event.ImageUrl ? 'Click to view full image' : 'No image available'}
            </div>
            <div className="mt-6">
              <h2 className="mb-2 text-3xl font-bold text-primary sm:text-4xl">{event.Title}</h2>
              <p className="text-sm text-secondary">{event.Description || 'No description provided.'}</p>
            </div>
            
            <div className="mt-8">
              <h3 className="mb-2 text-2xl font-bold text-primary">Event Summary</h3>
              <p className="mb-6 text-sm text-secondary">Here's a quick snapshot of the key details.</p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-xl">🎵</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary">Type</p>
                    <p className="font-medium text-text">{event.type || 'Event'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-xl">🎭</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary">Category</p>
                    <p className="font-medium text-text">{event.category || 'General'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-xl">🏢</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary">Hosted by</p>
                    <p className="font-medium text-text">{event.hostedBy || 'NWU Events'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-xl">📅</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary">Date</p>
                    <p className="font-medium text-text">{formatDate(event.Date)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-xl">⏰</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary">Time</p>
                    <p className="font-medium text-text">{`${formatTime(event.Time)}${event.endTime ? ` - ${formatTime(event.endTime)}` : ''}`}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-xl">📍</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary">Location</p>
                    <p className="font-medium text-text">{event.venue || event.campus || 'TBA'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 2) RSVP section */}
          <div className="overflow-hidden rounded-2xl border border-secondary/40 bg-primary/5 p-4 shadow-sm sm:p-6 lg:col-span-1">
            <h3 className="mb-3 text-2xl font-bold text-primary sm:text-2xl">Will you be attending?</h3>
            <Button onClick={handleRSVP} variant="primary" size="large">
              {rsvp ? "Going" : "RSVP to this Event"}
            </Button>
            {rsvp && (
              <p className="mt-3 text-lg font-bold text-primary">You're attending this event! We'll send you a reminder.</p>
            )}
          </div>

          {/* 3) Review section */}
          <div className="overflow-hidden rounded-2xl border border-secondary/40 bg-primary/5 p-4 shadow-sm sm:p-6 lg:col-span-3">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-primary sm:text-4xl">Write a Review</h2>

              <div className="mb-4 flex items-center justify-between">
                <p className="mr-4 flex-shrink-0 font-medium text-primary">Choose a rating</p>
                <div className="flex-shrink-0">
                  <Button onClick={openGuidelines} variant="link" className="whitespace-nowrap text-sm font-medium text-secondary no-underline hover:text-primary">
                    View Guidelines
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="mb-6 flex w-full items-center justify-center">
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                      style={{ fontSize: '48px', lineHeight: '1' }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 block font-medium text-primary">Review Title</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className="w-full rounded-lg border border-secondary/60 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="mb-2">
                <label className="mb-2 block font-medium text-primary">Your Review</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share details of your experience at this event"
                  className="h-40 w-full rounded-lg border border-secondary/60 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-secondary">{review.length}/2000 characters</p>
                <p className="text-sm text-secondary">
                  Reviewing as: <span className="font-medium">{user.firstName}</span>
                </p>
              </div>

              <p className="mb-6 text-sm italic text-secondary">
                Please tell us about why you would want to revisit or not want to revisit the event
              </p>

              <Button onClick={handleSubmit} disabled={!rating || !reviewTitle || !review} variant={!rating || !reviewTitle || !review ? "outline" : "primary"} fullWidth size="large">
                Submit Review
              </Button>
            </div>
          </div>
        </div>
        {/* End sections wrapper */}
      </div>
    </div>
  );
}
