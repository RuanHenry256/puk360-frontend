// src/EventListing.jsx
import React, { useEffect, useState } from 'react';
import { Search, X as XIcon } from 'lucide-react';
import { api } from '../api/client';
import Button from '../components/Button';
import TopBar from '../components/TopBar';
import '../styles/filterPanel.css';
import Spinner from '../components/Spinner';

// Local date formatter (keeps previous display format)
const formatEventDate = (dateString) =>
  new Date(`${dateString}T00:00:00`).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

// Known options (module scope to avoid changing useEffect deps)
const KNOWN_CAMPUSES = ['Potchefstroom', 'Mahikeng', 'Vaal'];
const KNOWN_CATEGORIES = ['Entertainment', 'Community', 'Music', 'Sports', 'Art', 'Academic'];

// Date range picker now used; prior week helpers removed.

export default function EventListing({ onSelectEvent, onShowProfile, showTopBar = true }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', category: '', campus: '', status: '' });
  const [searchTerm, setSearchTerm] = useState(''); // applied term
  const [searchInput, setSearchInput] = useState(''); // live input
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load events from API on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const raw = await api.events.list();
        const normalized = raw.map((e) => ({
          id: e.Event_ID,
          title: e.Title,
          date: typeof e.Date === 'string' ? e.Date.slice(0, 10) : new Date(e.Date).toISOString().slice(0, 10),
          category: e.category || 'General',
          location: e.venue || e.campus || '',
          campus: e.campus || '',
          // Use image only if non-empty and looks like a URL; else null for white placeholder
          image: (typeof e.ImageUrl === 'string' && e.ImageUrl.trim() && /^(https?:)?\/\//i.test(e.ImageUrl.trim())) ? e.ImageUrl.trim() : null,
        }));
        if (!cancelled) {
          setEvents(normalized);
          setFilteredEvents(normalized);
          setError('');
          setLoading(false);
        }
      } catch (err) {
        console.warn('Failed to load events', err);
        if (!cancelled) {
          setEvents([]);
          setFilteredEvents([]);
          setError('Failed to load events');
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Build dynamic filter options from loaded events
  const [categories, setCategories] = useState([]);
  const [campuses, setCampuses] = useState([]);

  useEffect(() => {
    const catsLive = Array.from(new Set(events.map(e => (e.category || '').trim()).filter(Boolean)));
    const cats = Array.from(new Set([...KNOWN_CATEGORIES, ...catsLive])).filter(Boolean).sort((a,b)=>a.localeCompare(b));
    setCategories(cats);

    const campsLive = Array.from(new Set(events.map(e => (e.campus || '').trim()).filter(Boolean)));
    const camps = Array.from(new Set([...KNOWN_CAMPUSES, ...campsLive])).filter(Boolean).sort((a,b)=>a.localeCompare(b));
    setCampuses(camps);

    // Using explicit start/end dates now; no week options generation required.
  }, [events]);

  // Recompute filtered list when inputs change
  useEffect(() => {
    let list = events;
    // Date range filtering (inclusive)
    if (filters.startDate || filters.endDate) {
      const from = filters.startDate ? new Date(filters.startDate + 'T00:00:00') : null;
      const to = filters.endDate ? new Date(filters.endDate + 'T23:59:59') : null;
      list = list.filter((e) => {
        const d = new Date(e.date + 'T00:00:00');
        const afterStart = from ? d >= from : true;
        const beforeEnd = to ? d <= to : true;
        return afterStart && beforeEnd;
      });
    }
    if (filters.category) list = list.filter(e => (e.category || '').toLowerCase() === filters.category.toLowerCase());
    if (filters.campus) list = list.filter(e => (e.campus || '').toLowerCase() === filters.campus.toLowerCase());
    // Status filter (upcoming/completed)
    if (filters.status) {
      const today = new Date(); today.setHours(0,0,0,0);
      list = list.filter((e) => {
        const d = new Date((e.date || '') + 'T00:00:00');
        if (filters.status === 'upcoming') return d >= today;
        if (filters.status === 'completed') return d < today;
        return true;
      });
    }
    if (searchTerm) list = list.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredEvents(list);
  }, [events, filters, searchTerm]);

  // Helpers moved to module scope

  const handleFilterChange = (e) => setFilters((p) => ({ ...p, [e.target.name]: e.target.value }));
  const toggleFilters = () => setFiltersOpen((prev) => !prev);
  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '', category: '', campus: '', status: '' });
    setSearchTerm('');
    setSearchInput('');
  };

  return (
    <div className="event-listing text-text">
      {showTopBar && <TopBar onProfileClick={onShowProfile} />}
      <div className={`mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 ${showTopBar ? 'pt-[88px]' : 'pt-6'} pb-6 sm:px-6 lg:px-8`}>
        <header className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Event Listings</h1>
          <p className="text-sm text-white/80 sm:text-base">Discover what's happening across campuses.</p>
          <span className="text-sm font-medium text-white/70">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </span>
        </header>

        {/* Search above filters (inline bar with icon button) */}
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="event-search-top">Search events</label>
          <div className="flex w-full">
            <input
              id="event-search-top"
              type="text"
              placeholder="Search by name or keyword"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setSearchTerm(searchInput); }}
              className="w-full rounded-l-lg border border-secondary/60 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {searchInput && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => { setSearchInput(''); setSearchTerm(''); }}
                className="inline-flex items-center justify-center border border-l-0 border-secondary/60 bg-white px-3 py-2 text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <XIcon size={18} />
              </button>
            )}
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchTerm(searchInput)}
              className="inline-flex items-center justify-center rounded-r-lg border border-l-0 border-secondary/60 bg-white px-3 py-2 text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <section
          className={"filter-panel flex flex-col rounded-2xl border border-secondary/40 bg-primary/5 shadow-sm px-4 sm:px-6 " + (filtersOpen ? 'filter-panel--open' : 'filter-panel--closed')}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-primary">Filters</h2>
            <button
              type="button"
              onClick={toggleFilters}
              aria-label={filtersOpen ? 'Collapse filters' : 'Expand filters'}
              aria-expanded={filtersOpen}
              className="text-base font-semibold text-primary hover:opacity-90 focus:outline-none"
            >
              {filtersOpen ? '▲' : '▼'}
            </button>
          </div>

          <div
            className={"filter-panel__content " + (filtersOpen ? 'is-open' : '')}
            aria-hidden={!filtersOpen}
          >
            <div className="filter-panel__inner flex flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-secondary" htmlFor="filter-start">Start date</label>
                  <input
                    id="filter-start"
                    name="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-secondary/60 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-secondary" htmlFor="filter-end">End date</label>
                  <input
                    id="filter-end"
                    name="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-secondary/60 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-secondary" htmlFor="filter-category">Category</label>
                  <select id="filter-category" name="category" value={filters.category} onChange={handleFilterChange}
                          className="w-full rounded-lg border border-secondary/60 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Any category</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-secondary" htmlFor="filter-campus">Campus</label>
                  <select id="filter-campus" name="campus" value={filters.campus} onChange={handleFilterChange}
                          className="w-full rounded-lg border border-secondary/60 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Any campus</option>
                    {campuses.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-secondary" htmlFor="filter-status">Status</label>
                  <select id="filter-status" name="status" value={filters.status} onChange={handleFilterChange}
                          className="w-full rounded-lg border border-secondary/60 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Any status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Clear filters */}
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg border border-secondary/60 px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:border-primary hover:text-primary"
                >
                  Clear all filters
                </button>
              </div>
            </div>

            {/* Toggle button remains in header; no footer control */}
          </div>
        </section>

        {/* Cards / Loading / Error */}
        {loading ? (
          <div className="flex items-center justify-center py-12 text-secondary"><Spinner size={40} label="Loading events" /></div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-red-600">{error}</div>
        ) : (
          filteredEvents.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-secondary">
              {searchTerm ? `No events were found matching the name "${searchTerm}".` : 'No events match your filters.'}
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 fade-in-mobile">
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
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="h-48 w-full object-cover sm:h-64" />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-white text-secondary sm:h-64">
                      {event.title}
                    </div>
                  )}
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
          )
        )}

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






