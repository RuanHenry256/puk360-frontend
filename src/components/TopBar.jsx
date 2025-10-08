import React from 'react';
import Button from './Button';
import ProfileButton from './ProfileButton';

export default function TopBar({ onBack, onProfileClick, backLabel = 'Back' }) {
  return (
    <div className="fixed inset-x-0 top-0 z-40 h-16 border-b border-secondary/40 bg-primary/5 backdrop-blur">
      <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {onBack ? (
          <Button
            type="button"
            onClick={onBack}
            variant="link"
            className="inline-flex items-center rounded-lg border border-secondary/60 bg-white px-3 py-1.5 text-sm font-semibold text-secondary no-underline hover:border-primary hover:text-primary"
          >
            ← {backLabel}
          </Button>
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
