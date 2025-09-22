import React, { useState, useEffect } from 'react';
import BERTS from '../posters/BERTS.png';
import CampusReboot from '../posters/CampusReboot.jpg'; // New event image
import ClashChoirs from '../posters/ClashChoirs.png'; // New event image
import Exhibition from '../posters/Exhibition.png'; // Updated image import

// Sample event data
const sampleEvents = [
  { id: 1, title: 'NWU Berts Bricks AC Night Race', date: '2025-10-01', category: 'Sports', location: 'Potchefstroom', image: BERTS },
  { id: 2, title: 'Campus Reboot', date: '2025-10-02', category: 'Music', location: 'Mahikeng', image: CampusReboot },
  { id: 3, title: 'Clash of the Choirs', date: '2025-07-25', category: 'Music', location: 'Vanderbilpark', image: ClashChoirs },
  { id: 4, title: 'Threads Exhibition', date: '2024-10-23', category: 'Art', location: 'NWU Botanical Garden Gallery', image: Exhibition }, // Updated image reference
];

const EventListing = ({ onBackToLogin }) => {
  const [events, setEvents] = useState(sampleEvents);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [filters, setFilters] = useState({ date: '', category: '', location: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null); // State for toggling event details

  useEffect(() => {
    const applyFilters = () => {
      let newFilteredEvents = events;

      // Filter by date
      if (filters.date) {
        newFilteredEvents = newFilteredEvents.filter(event => event.date === filters.date);
      }

      // Filter by category
      if (filters.category) {
        newFilteredEvents = newFilteredEvents.filter(event => event.category === filters.category);
      }

      // Filter by location
      if (filters.location) {
        newFilteredEvents = newFilteredEvents.filter(event => event.location === filters.location);
      }

      // Filter by search term
      if (searchTerm) {
        newFilteredEvents = newFilteredEvents.filter(event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredEvents(newFilteredEvents);
    };

    applyFilters();
  }, [filters, searchTerm, events]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const handleRegister = (eventTitle) => {
    alert(`You have registered for ${eventTitle}!`);
  };

  const toggleDetails = (id) => {
    setSelectedEventId(selectedEventId === id ? null : id); // Toggle the selected event ID
  };

  return (
    <div className="event-listing bg-surface text-text">
      <h1 className="text-3xl font-bold text-primary">Event Listings</h1>

      {/* Search Bar */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg border-secondary"
        />
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <select name="date" onChange={handleFilterChange} className="border rounded-lg p-2 border-secondary">
          <option value="">Select Date</option>
          <option value="2025-10-01">October 1, 2025</option>
          <option value="2025-10-02">October 2, 2025</option>
          <option value="2025-07-25">July 25, 2025</option>
          <option value="2024-10-23">October 23, 2024</option> {/* Added date for Threads Exhibition */}
        </select>

        <select name="category" onChange={handleFilterChange} className="border rounded-lg p-2 border-secondary">
          <option value="">Select Category</option>
          <option value="Sports">Sports</option>
          <option value="Music">Music</option>
          <option value="Art">Art</option> {/* Added Art category */}
          <option value="Community">Community</option>
        </select>

        <select name="location" onChange={handleFilterChange} className="border rounded-lg p-2 border-secondary">
          <option value="">Select Location</option>
          <option value="Potchefstroom">Potchefstroom</option>
          <option value="Mahikeng">Mahikeng</option>
          <option value="Vanderbilpark">Vanderbilpark</option>
        </select>
      </div>

      {/* Event List */}
      <ul className="list-none">
        {filteredEvents.map(event => (
          <li key={event.id} className="p-4 border rounded-lg mb-2 border-secondary">
            <h2 className="text-xl font-semibold text-primary">{event.title}</h2>
            <img 
              src={event.image} 
              alt={event.title} 
              className="mb-2 w-full h-auto cursor-pointer" 
              onClick={() => toggleDetails(event.id)} 
            />
            {selectedEventId === event.id && (
              <div>
                <p>Date: {event.date}</p>
                <p>Category: {event.category}</p>
                <p>Location: {event.location}</p>
                <button
                  onClick={() => handleRegister(event.title)}
                  className="mt-2 bg-accent text-white px-4 py-2 rounded-lg"
                >
                  Register
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Back to Login Button */}
      <button
        onClick={onBackToLogin}
        className="mt-4 bg-gray-300 text-black px-4 py-2 rounded-lg"
      >
        Back to Login
      </button>
    </div>
  );
};

export default EventListing;