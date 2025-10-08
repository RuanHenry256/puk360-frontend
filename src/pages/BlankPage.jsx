/**
 * Post-login blank page placeholder.
 * Used for testing components and navigation during development.
 */
import React from 'react';
import Button from '../components/Button';

export default function BlankPage({ onBack }) {
  return (
    <div className="min-h-screen bg-surface text-text">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <Button
          type="button"
          onClick={onBack}
          variant="link"
          className="inline-flex items-center rounded-lg border border-secondary/60 bg-white px-3 py-1.5 text-sm font-semibold text-secondary no-underline hover:border-primary hover:text-primary mb-6"
        >
          ← Back
        </Button>

        <div className="rounded-2xl border border-secondary/40 bg-white/90 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-primary mb-4">Blank Page</h1>
          <p className="text-secondary">
            This is a blank page used for testing and developing new components in the app. 
            When features are being built or tested, they can be temporarily placed here before 
            being integrated into the main application flow.
          </p>
        </div>
      </div>
    </div>
  );
}