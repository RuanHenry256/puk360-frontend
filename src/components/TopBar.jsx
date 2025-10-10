import React from 'react';
import ProfileButton from './ProfileButton';

export default function TopBar({ onBack, onProfileClick, backLabel = 'Back' }) {
  return (
    <div className="fixed inset-x-0 top-0 z-40 h-16 border-b border-secondary/40 bg-primary/5 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {backLabel}
          </button>
        ) : (
          <span />
        )}
        {onProfileClick && (
          <ProfileButton onClick={onProfileClick} ariaLabel="Open profile" title="Open profile" />
        )}
      </div>
    </div>
  );
}

