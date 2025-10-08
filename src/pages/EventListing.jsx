// src/EventListing.jsx
import React, { useEffect, useState } from 'react';
import { sampleEvents, formatEventDate } from './sampleEvents';
import Button from '../components/Button';
import TopBar from '../components/TopBar';
import '../styles/filterPanel.css';

export default function EventListing({ onSelectEvent, onShowProfile }) {
  const [filteredEvents, setFilteredEvents] = useState(sampleEvents);
  const [filters, setFilters] = useState({ date: '', category: '', location: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  useEffect(() => {
    let list = sampleEvents;
    if (filters.date) list = list.filter(e => e.date === filters.date);
    if (filters.category) list = list.filter(e => e.category === filters.category);
    if (filters.location) list = list.filter(e => e.location === filters.location);
    if (searchTerm) list = list.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredEvents(list);
  }, [filters, searchTerm]);

  const handleFilterChange = (e) => setFilters((p) => ({ ...p, [e.target.name]: e.target.value }));
  const toggleFilters = () => setFiltersOpen((prev) => !prev);

  return (
    <div className="event-listing bg-surface text-text">
      <TopBar onProfileClick={onShowProfile} />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-[88px] pb-6 sm:px-6 lg:px-8">
        <header className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold text-primary sm:text-4xl">Event Listings</h1>
          <p className="text-sm text-secondary sm:text-base">Discover what's happening across campuses.</p>
          <span className="text-sm font-medium text-secondary">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </span>
        </header>

        {/* Search + Filters */}
        <section
          className={"filter-panel flex flex-col rounded-2xl border border-secondary/40 bg-primary/5 shadow-sm px-4 sm:px-6 " + (filtersOpen ? 'filter-panel--open' : 'filter-panel--closed')}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-secondary">Filters</h2>
            {!filtersOpen && (
              <Button
                type="button"
                variant="link"
                onClick={toggleFilters}
                aria-label="Expand filters"
                className="text-base font-semibold text-secondary no-underline hover:text-primary"
              >
                v
              </Button>
            )}
          </div>

          <div
            className={"filter-panel__content " + (filtersOpen ? 'is-open' : '')}
            aria-hidden={!filtersOpen}
          >
            <div className="filter-panel__inner flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-secondary" htmlFor="event-search">Search events</label>
                <input
                  id="event-search"
                  type="text"
                  placeholder="Search by name or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-secondary/60 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-secondary" htmlFor="filter-date">Date</label>
                  <select id="filter-date" name="date" value={filters.date} onChange={handleFilterChange}
                          className="w-full rounded-lg border border-secondary/60 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Any date</option>
                    <option value="2025-10-01">October 1, 2025</option>
                    <option value="2025-10-02">October 2, 2025</option>
                    <option value="2025-07-25">July 25, 2025</option>
                    <option value="2024-10-23">October 23, 2024</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-secondary" htmlFor="filter-category">Category</label>
                  <select id="filter-category" name="category" value={filters.category} onChange={handleFilterChange}
                          className="w-full rounded-lg border border-secondary/60 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Any category</option>
                    <option value="Sports">Sports</option>
                    <option value="Music">Music</option>
                    <option value="Art">Art</option>
                    <option value="Community">Community</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-secondary" htmlFor="filter-location">Location</label>
                  <select id="filter-location" name="location" value={filters.location} onChange={handleFilterChange}
                          className="w-full rounded-lg border border-secondary/60 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Any location</option>
                    <option value="Potchefstroom">Potchefstroom</option>
                    <option value="Mahikeng">Mahikeng</option>
                    <option value="Vanderbilpark">Vanderbilpark</option>
                  </select>
                </div>
              </div>
            </div>

            {filtersOpen && (
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  onClick={toggleFilters}
                  aria-label="Collapse filters"
                  className="text-base font-semibold text-secondary no-underline hover:text-primary"
                >
                  ^
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Cards as buttons */}
        <ul className="grid gap-4 sm:gap-6">
          {filteredEvents.map((event) => (
            <li
              key={event.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectEvent(event.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectEvent(event.id)}
              className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-secondary/40 bg-primary/5 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`View details for ${event.title}`}
            >
              <img src={event.image} alt={event.title} className="h-48 w-full object-cover sm:h-64" />
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
          ))}
        </ul>

        {/* Back to Top */}
        <Button
          type="button"
          onClick={scrollToTop}
          variant="link"
          className="w-full rounded-lg border border-secondary/50 bg-white px-4 py-2 text-sm font-semibold text-secondary transition-colors duration-150 hover:border-primary hover:text-primary no-underline sm:w-auto sm:self-center"
        >
          Back to Top
        </Button>
      </div>
    </div>
  );
}






