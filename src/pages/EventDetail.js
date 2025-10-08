// details screen that pops up when you tap on an event in the event feed (NOT CURRENTLY USED).
import { useState } from "react";
import Button from '../components/Button';

export default function EventDetail() {
  const [rsvp, setRsvp] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [showFullImage, setShowFullImage] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const handleRSVP = () => {
    setRsvp(!rsvp);
    alert(rsvp ? "You're no longer attending this event" : "You're attending this event!");
  };

  const handleSubmit = () => {
    console.log("Review submitted:", { reviewTitle, review, rating });
    alert("Thanks for your review!");
    setReview("");
    setReviewTitle("");
    setRating(0);
  };

  const openFullImage = () => {
    setShowFullImage(true);
  };

  const closeFullImage = () => {
    setShowFullImage(false);
  };

  const openGuidelines = () => {
    setShowGuidelines(true);
  };

  const closeGuidelines = () => {
    setShowGuidelines(false);
  };

  // Mock user data
  const user = {
    firstName: "Kamo",
    email: "Kamo@gmail.com"
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8"></div>
          
      {/* Full Image Modal */}
      {showFullImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeFullImage}
        >
          <div className="relative max-w-2xl max-h-2xl">
            <img 
              src="/samplePic.jpg" 
              alt="Annual Tech Conference 2023 - Full View" 
              className="max-w-full max-h-full object-contain scale-60"
            />
            <Button
              onClick={closeFullImage}
              type="button"
              variant="link"
              aria-label="Close full image"
              className="absolute top-4 right-4 rounded-full bg-white p-2 text-gray-800 transition-colors hover:bg-gray-200 no-underline"
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
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeGuidelines}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-purple-700">Review Guidelines</h3>
                <Button
                  onClick={closeGuidelines}
                  type="button"
                  variant="link"
                  aria-label="Close guidelines"
                  className="text-gray-400 transition-colors hover:text-gray-600 no-underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>

              {/* Animated Circle */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>

              {/* Do's Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                  <span className="bg-green-100 p-1 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Do
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Keep content useful and relevant to others</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Focus on the events you experienced</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Share details about your likes and dislikes</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Complete in English</span>
                  </li>
                </ul>
              </div>

              {/* Don'ts Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                  <span className="bg-red-100 p-1 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Don't
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Use inappropriate, discriminatory, or language not suitable for public forums</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Share personal information or contact details</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Post fake or misleading information</span>
                  </li>
                </ul>
              </div>

              {/* Close Button */}
              <Button
                onClick={closeGuidelines}
                variant="primary"
                fullWidth={true}
                size="large"
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Clickable Event Image */}
        <div 
          className="h-48 w-full cursor-pointer overflow-hidden relative"
          onClick={openFullImage}
        >
          <img 
            src="/samplePic.jpg" 
            alt="Dancing Mzansi A Stage Of Style - Click to enlarge" 
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          />
          {/* Zoom indicator */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7" />
            </svg>
          </div>
        </div>

        <div className="p-6">
          {/* Event Info */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Dancing Mzansi A Stage Of Style</h2>
          <p className="text-gray-600 mb-6">
            Join us for an unforgettable evening of dance, fashion, and culture as talented performers take the stage to 
            showcase their unique styles. Celebrate diversity, creativity, and the vibrant spirit of Mzansi in one
            electrifying show.
          </p>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <div className="bg-purple-700 p-2 rounded-lg mr-3">
                <span className="text-blue-600">📅</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">Aug 15, 2025</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-700 p-2 rounded-lg mr-3">
                <span className="text-purple-600">⏰</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">18:00 - 20:00</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-700 p-2 rounded-lg mr-3">
                <span className="text-green-600">📍</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">Amphi Theatre</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-700 p-2 rounded-lg mr-3">
                <span className="text-yellow-600">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Attendees</p>
                <p className="font-medium">250+ Registered</p>
              </div>
            </div>
          </div>

          {/* RSVP Section */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-2xl sm:text-2xl font-bold text-primary">Will you be attending?</h3>
            <Button
              onClick={handleRSVP}
              variant="primary"
              size="large"
              className={rsvp ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {rsvp ? "Going ✅" : "RSVP to this Event"}
            </Button>
            {rsvp && (
              <p className="text-2xl sm:text-2xl font-bold text-primary">You're attending this event! We'll send you a reminder.</p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Review Section */}
          <div className="mt-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">Write a Review</h2>

            {/* Rating Header */}
            <div className="flex justify-between items-center mb-4">
              <p className="font-medium text-purple-700">Choose a rating</p>
              <Button 
                onClick={openGuidelines}
                variant="link" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Guidelines
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>

            {/* Star Rating */}
            <div className="flex space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  variant="link"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform duration-200 hover:scale-110 no-underline ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </Button>
              ))}
            </div>

            {/* Review Title */}
            <div className="mb-6">
              <label className="block text-purple-700 font-medium mb-2">Review Title</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            {/* Review Textarea */}
            <div className="mb-2">
              <label className="block text-purple-700 font-medium mb-2">Your Review</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share details of your experience at this event"
                className="w-full h-40 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Character Count and User Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">
                {review.length}/2000 characters
              </p>
              <p className="text-sm text-gray-600">
                Reviewing as: <span className="font-medium">{user.firstName}</span>
              </p>
            </div>

            {/* Hint Text */}
            <p className="text-sm text-gray-500 mb-6 italic">
              Please tell us about why you would want to revisit or not want to revisit the event
            </p>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!rating || !reviewTitle || !review}
              variant={!rating || !reviewTitle || !review ? "outline" : "primary"}
              fullWidth={true}
              size="large"
            >
              Submit Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
