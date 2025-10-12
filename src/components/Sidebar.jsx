import React, { useState } from 'react';

// Reusable responsive sidebar for Host/Admin pages
// - Mobile: slide-in drawer with overlay (controlled by open/onClose)
// - Desktop (lg+): persistent rail under the fixed header (top-16)
export default function Sidebar({
  open,
  onClose,
  items = [],
  activeId,
  onSelect,
  onSignOut,
  embed = false, // when true, render sticky desktop rail only
}) {
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  if (embed) {
    // Sticky desktop rail for layouts; hidden on mobile
    return (
      <div className="hidden w-64 lg:block">
        <div className="sticky top-16">
          <div className="mt-4 flex h-[calc(100vh-6rem)] flex-col rounded-3xl border border-secondary/30 bg-white/80 p-4 shadow-xl backdrop-blur">
            <nav className="flex-1 space-y-3 overflow-auto">
              {items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => onSelect?.(it.id)}
                  className={[
                    'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition',
                    activeId === it.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-primary hover:bg-white/90 border border-secondary/30',
                  ].join(' ')}
                >
                  <span className={[
                    'inline-flex h-7 w-7 items-center justify-center rounded-md',
                    activeId === it.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary',
                  ].join(' ')}>{it.icon || '•'}</span>
                  <span className="font-semibold">{it.label}</span>
                </button>
              ))}
            </nav>
            {onSignOut && (
              <div className="border-t border-secondary/30 pt-3">
                {confirmSignOut ? (
                  <div className="flex gap-2">
                    <button type="button" className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700" onClick={() => { onSignOut?.(); setConfirmSignOut(false); }}>Confirm</button>
                    <button type="button" className="flex-1 rounded-lg border border-secondary/60 px-3 py-2 text-sm font-semibold text-secondary hover:border-primary hover:text-primary" onClick={() => setConfirmSignOut(false)}>Cancel</button>
                  </div>
                ) : (
                  <button type="button" className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100" onClick={() => setConfirmSignOut(true)}>Sign out</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay for mobile */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      {/* Panel: mobile drawer + desktop rail */}
      <aside
        className={[
          'fixed left-0 top-0 z-50 lg:z-30 flex h-full w-64 transform transition-transform',
          open ? 'translate-x-0' : '-translate-x-full',
          // Desktop rail sits under header; transparent so inner card can look detached
          'lg:translate-x-0 lg:top-16 lg:h-[calc(100%-4rem)]',
        ].join(' ')}
        aria-label="Sidebar navigation"
      >
        {/* Mobile content (simple panel) */}
        <div className="flex h-full w-full flex-col bg-white shadow-xl lg:hidden">
          <div className="flex items-center justify-between border-b border-secondary/30 p-4">
            <span className="text-lg font-semibold text-primary">Menu</span>
            <button type="button" className="rounded px-2 py-1 text-secondary hover:bg-secondary/10" onClick={onClose} aria-label="Close menu">✕</button>
          </div>
          <nav className="flex-1 overflow-auto p-3">
            {items.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => { onSelect?.(it.id); onClose?.(); }}
                className={[
                  'mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left shadow-sm',
                  activeId === it.id ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-secondary/10 border border-secondary/30',
                ].join(' ')}
              >
                <span className={[
                  'inline-flex h-7 w-7 items-center justify-center rounded-md',
                  activeId === it.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary',
                ].join(' ')}>{it.icon || '•'}</span>
                <span className="font-semibold">{it.label}</span>
              </button>
            ))}
          </nav>
          {onSignOut && (
            <div className="border-t border-secondary/30 p-3">
              {confirmSignOut ? (
                <div className="flex gap-2">
                  <button type="button" className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700" onClick={() => { onSignOut?.(); setConfirmSignOut(false); onClose?.(); }}>Confirm</button>
                  <button type="button" className="flex-1 rounded-lg border border-secondary/60 px-3 py-2 text-sm font-semibold text-secondary hover:border-primary hover:text-primary" onClick={() => setConfirmSignOut(false)}>Cancel</button>
                </div>
              ) : (
                <button type="button" className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100" onClick={() => setConfirmSignOut(true)}>Sign out</button>
              )}
            </div>
          )}
        </div>

        {/* Desktop content (detached card aesthetic) */}
        <div className="hidden h-full w-full flex-col p-4 lg:flex">
          <div className="mt-4 flex h-full flex-col rounded-3xl border border-secondary/30 bg-white/80 p-4 shadow-xl backdrop-blur">
            <nav className="flex-1 space-y-3 overflow-auto">
              {items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => onSelect?.(it.id)}
                  className={[
                    'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition',
                    activeId === it.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-primary hover:bg-white/90 border border-secondary/30',
                  ].join(' ')}
                >
                  <span className={[
                    'inline-flex h-7 w-7 items-center justify-center rounded-md',
                    activeId === it.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary',
                  ].join(' ')}>{it.icon || '•'}</span>
                  <span className="font-semibold">{it.label}</span>
                </button>
              ))}
            </nav>
            {onSignOut && (
              <div className="border-t border-secondary/30 pt-3">
                {confirmSignOut ? (
                  <div className="flex gap-2">
                    <button type="button" className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700" onClick={() => { onSignOut?.(); setConfirmSignOut(false); }}>Confirm</button>
                    <button type="button" className="flex-1 rounded-lg border border-secondary/60 px-3 py-2 text-sm font-semibold text-secondary hover:border-primary hover:text-primary" onClick={() => setConfirmSignOut(false)}>Cancel</button>
                  </div>
                ) : (
                  <button type="button" className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100" onClick={() => setConfirmSignOut(true)}>Sign out</button>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

