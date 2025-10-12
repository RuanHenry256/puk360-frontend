// src/EventListing.jsx
import React, { useEffect, useState } from 'react';
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

// Helpers for week generation/formatting (module scope)
function startOfWeek(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Mon=0..Sun=6
  date.setDate(date.getDate() - day);
  date.setHours(0,0,0,0);
  return date;
}
function endOfWeek(d) {
  const s = startOfWeek(d);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  e.setHours(23,59,59,999);
  return e;
}
function fmtISO(d) { return d.toISOString().slice(0,10); }
function fmtLabel(d) { return d.toLocaleDateString('en-ZA', { day:'2-digit', month:'short' }); }

export default function EventListing({ onSelectEvent, onShowProfile, showTopBar = true }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({ week: '', category: '', campus: '' });
  const [searchTerm, setSearchTerm] = useState('');
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
  const [weeks, setWeeks] = useState([]); // [{ value: 'YYYY-MM-DD_YYYY-MM-DD', label: '12 Oct – 18 Oct' }]
  const [categories, setCategories] = useState([]);
  const [campuses, setCampuses] = useState([]);

  useEffect(() => {
    const catsLive = Array.from(new Set(events.map(e => (e.category || '').trim()).filter(Boolean)));
    const cats = Array.from(new Set([...KNOWN_CATEGORIES, ...catsLive])).filter(Boolean).sort((a,b)=>a.localeCompare(b));
    setCategories(cats);

    const campsLive = Array.from(new Set(events.map(e => (e.campus || '').trim()).filter(Boolean)));
    const camps = Array.from(new Set([...KNOWN_CAMPUSES, ...campsLive])).filter(Boolean).sort((a,b)=>a.localeCompare(b));
    setCampuses(camps);

    if (events.length) {
      const dates = events.map(e => new Date(e.date + 'T00:00:00'));
      const min = new Date(Math.min.apply(null, dates));
      const max = new Date(Math.max.apply(null, dates));
      const start = startOfWeek(min); // Monday as start
      const end = endOfWeek(max);     // Sunday as end
      const out = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
        const ws = new Date(d);
        const we = endOfWeek(ws);
        const val = `${fmtISO(ws)}_${fmtISO(we)}`;
        const label = `${fmtLabel(ws)} – ${fmtLabel(we)}`;
        out.push({ value: val, label });
      }
      setWeeks(out);
    } else {
      setWeeks([]);
    }
  }, [events]);

  // Recompute filtered list when inputs change
  useEffect(() => {
    let list = events;
    if (filters.week) {
      const [ws, we] = filters.week.split('_');
      const from = new Date(ws + 'T00:00:00');
      const to = new Date(we + 'T23:59:59');
      list = list.filter(e => {
        const d = new Date(e.date + 'T00:00:00');
        return d >= from && d <= to;
      });
    }
    if (filters.category) list = list.filter(e => (e.category || '').toLowerCase() === filters.category.toLowerCase());
    if (filters.campus) list = list.filter(e => (e.campus || '').toLowerCase() === filters.campus.toLowerCase());
    if (searchTerm) list = list.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredEvents(list);
  }, [events, filters, searchTerm]);

  // Helpers moved to module scope

  const handleFilterChange = (e) => setFilters((p) => ({ ...p, [e.target.name]: e.target.value }));
  const toggleFilters = () => setFiltersOpen((prev) => !prev);
  const clearFilters = () => {
    setFilters({ week: '', category: '', campus: '' });
    setSearchTerm('');
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

        {/* Search + Filters */}
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
                  <label className="text-sm font-semibold text-secondary" htmlFor="filter-week">Date range (week)</label>
                  <select id="filter-week" name="week" value={filters.week} onChange={handleFilterChange}
                          className="w-full rounded-lg border border-secondary/60 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Any week</option>
                    {weeks.map(w => (
                      <option key={w.value} value={w.value}>{w.label}</option>
                    ))}
                  </select>
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






