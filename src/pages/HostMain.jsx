import React, { useState } from 'react';
import BottomTabBar from '../components/BottomTabBar';

// HostMain: Minimal scaffold for host-facing dashboard/workspace
// Purpose: Provide a clean starting point for your devs to extend.
export default function HostMain() {
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'myevents' | 'requests'

  const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-primary">{title}</h2>
      {subtitle && <p className="text-sm text-secondary mt-1">{subtitle}</p>}
    </div>
  );

  // Host-specific tabs for the shared BottomTabBar
  const hostTabs = [
    { id: 'overview', label: 'Overview', icon: '1' },
    { id: 'myevents', label: 'My Events', icon: '2' },
    { id: 'requests', label: 'Requests', icon: '3' }
  ];

  const Overview = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
        <SectionHeader title="Welcome, Host" subtitle="High-level snapshot for your events" />
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white p-4 border border-secondary/30">
            <p className="text-sm text-secondary">Active Events</p>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
          <div className="rounded-lg bg-white p-4 border border-secondary/30">
            <p className="text-sm text-secondary">Pending Requests</p>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <SectionHeader title="Quick Actions" />
        <div className="flex flex-wrap gap-3">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Create Event</button>
          <button className="rounded-lg border border-secondary/60 px-4 py-2 text-sm font-semibold text-secondary hover:border-primary hover:text-primary">Manage My Events</button>
          <button className="rounded-lg border border-secondary/60 px-4 py-2 text-sm font-semibold text-secondary hover:border-primary hover:text-primary">View Requests</button>
        </div>
      </div>
    </div>
  );

  const MyEvents = () => (
    <div className="space-y-4">
      <SectionHeader title="My Events" subtitle="Drafts, scheduled, and past" />
      {[1,2,3].map((i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border border-secondary/40 bg-white p-4">
          <div>
            <p className="font-semibold text-text">Sample Event #{i}</p>
            <p className="text-sm text-secondary">TBD date • TBD venue</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-secondary/60 px-3 py-1.5 text-sm font-medium text-secondary hover:border-primary hover:text-primary">Edit</button>
            <button className="rounded-lg border border-secondary/60 px-3 py-1.5 text-sm font-medium text-secondary hover:border-primary hover:text-primary">View</button>
          </div>
        </div>
      ))}
    </div>
  );

  const Requests = () => (
    <div className="space-y-4">
      <SectionHeader title="Requests" subtitle="Approvals and administrative notices" />
      <div className="rounded-lg border border-secondary/40 bg-white p-4 text-secondary">
        No requests yet.
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'myevents':
        return <MyEvents />;
      case 'requests':
        return <Requests />;
      case 'overview':
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-text">
      {/* Simple title bar (local, not shared) */}
      <div className="fixed inset-x-0 top-0 z-40 h-16 border-b border-secondary/40 bg-primary/5 backdrop-blur">
        <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-primary">Host Dashboard</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-20 pb-24 sm:px-6 lg:px-8">
        {renderSection()}
      </div>

      {/**
       * Floating Action Button (FAB) — visual ONLY
       * ------------------------------------------------------------------
       * - Shows only on the "My Events" tab to emphasize quick event create.
       * - Non-functional placeholder: your devs can attach navigation later.
       * - Positioned above the BottomTabBar; adjust bottom spacing if needed.
       * - Safe to remove at any time without side effects.
       * ------------------------------------------------------------------
       */}
      {activeSection === 'myevents' && (
        <button
          type="button"
          aria-label="Create new event (placeholder)"
          title="Create new event (placeholder)"
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 transform rounded-full bg-primary text-white shadow-xl ring-4 ring-primary/20 hover:opacity-95 active:scale-95 transition w-16 h-16 flex items-center justify-center text-3xl"
          onClick={() => { /* placeholder: attach navigation to event creation */ }}
        >
          +
        </button>
      )}

      <BottomTabBar activeTab={activeSection} onTabChange={setActiveSection} tabs={hostTabs} />
    </div>
  );
}
