import React, { useState } from 'react';

// persistentOn: CSS breakpoint at which the menu stays open as a side rail (e.g., 'lg')
export default function BurgerMenu({ open, onClose, items = [], activeId, onSelect, onSignOut, persistentOn = 'lg' }) {
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const bp = persistentOn; // shorthand
  return (
    <>
      {/* Overlay */}
      {open && (
        <div className={`fixed inset-0 z-50 bg-black/30 ${bp}:hidden`} onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col transform bg-white shadow-xl transition-transform
        ${open ? 'translate-x-0' : '-translate-x-full'}
        ${bp}:translate-x-0 ${bp}:fixed ${bp}:top-16 ${bp}:h-[calc(100%-4rem)] ${bp}:shadow-none ${bp}:border-r ${bp}:border-secondary/30`}
        role="dialog" aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between border-b border-secondary/30 p-4">
          <span className="text-lg font-semibold text-primary">Menu</span>
          <button type="button" className={`rounded px-2 py-1 text-secondary hover:bg-secondary/10 ${bp}:hidden`} onClick={onClose} aria-label="Close menu">✕</button>
        </div>
        <nav className="p-2 flex-1 overflow-auto">
          {items.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => { onSelect?.(it.id); onClose?.(); }}
              className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${activeId === it.id ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-secondary/10'}`}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">{it.icon || '•'}</span>
              <span className="font-medium">{it.label}</span>
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
    </>
  );
}
