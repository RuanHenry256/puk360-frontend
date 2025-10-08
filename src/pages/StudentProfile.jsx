import React, { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import TopBar from '../components/TopBar';
import { sampleEvents, formatEventDate } from './sampleEvents';

const StudentProfile = ({
  user,
  visitedEventIds = [],
  onBack,
  onSignOut,
  onUpdateProfile,
  onRequestHost
}) => {
  const fallbackName = useMemo(
    () => user?.name || user?.fullName || user?.firstName || 'Student',
    [user]
  );
  const fallbackEmail = useMemo(
    () => user?.email || 'student@example.com',
    [user]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: fallbackName, email: fallbackEmail });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  useEffect(() => {
    setFormData({ name: fallbackName, email: fallbackEmail });
  }, [fallbackName, fallbackEmail]);

  const visitedEvents = useMemo(
    () =>
      visitedEventIds
        .map((id) => sampleEvents.find((event) => event.id === id))
        .filter(Boolean),
    [visitedEventIds]
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setStatusMessage('');
    setErrorMessage('');
  };

  const handleSaveProfile = async () => {
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName || !trimmedEmail) {
      setErrorMessage('Please provide both name and email.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');
      setStatusMessage('');

      if (onUpdateProfile) {
        await onUpdateProfile({ name: trimmedName, email: trimmedEmail });
      }

      setStatusMessage('Profile updated successfully.');
      setIsEditing(false);
    } catch (error) {
      const message = error?.message || 'Failed to update profile. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({ name: fallbackName, email: fallbackEmail });
    setStatusMessage('');
    setErrorMessage('');
    setIsEditing(false);
  };

  const handleSignOutClick = () => {
    setShowSignOutConfirm(true);
  };

  const handleConfirmSignOut = () => {
    onSignOut?.();
  };

  const handleCancelSignOut = () => {
    setShowSignOutConfirm(false);
  };

  const isDirty =
    formData.name.trim() !== fallbackName || formData.email.trim() !== fallbackEmail;

  return (
    <div className="min-h-screen bg-surface text-text">
      <TopBar onBack={onBack} backLabel="Back to Events" />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pt-[88px] pb-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-secondary">Profile</p>
              <h1 className="text-3xl font-bold text-primary sm:text-4xl">Hello, {fallbackName}</h1>
              <p className="text-sm text-secondary">Manage your details and activity.</p>
            </div>
          </div>
          {(statusMessage || errorMessage) && (
            <p className={`text-sm ${errorMessage ? 'text-red-600' : 'text-green-600'}`}>
              {errorMessage || statusMessage}
            </p>
          )}
        </header>

        <section className="rounded-2xl border border-secondary/30 bg-primary/5 p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-primary">Your details</h2>
              {!isEditing && (
                <Button type="button" variant="primary" onClick={() => setIsEditing(true)} size="small">
                  Edit profile
                </Button>
              )}
            </div>
            {isEditing && (
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleCancelEdit} size="small">
                  Cancel
                </Button>
                <Button type="button" variant="primary" onClick={handleSaveProfile} disabled={!isDirty || isSaving} size="small">
                  {isSaving ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
            )}

            {isEditing ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
                  Name
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="rounded-lg border border-secondary/60 px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
                  Email
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rounded-lg border border-secondary/60 px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </label>
              </div>
            ) : (
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-secondary/10 p-4">
                  <dt className="text-sm font-medium text-secondary">Name</dt>
                  <dd className="text-lg font-semibold text-primary">{fallbackName}</dd>
                </div>
                <div className="rounded-xl bg-secondary/10 p-4">
                  <dt className="text-sm font-medium text-secondary">Email</dt>
                  <dd className="text-lg font-semibold text-primary break-words">{fallbackEmail}</dd>
                </div>
              </dl>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/30 bg-primary/5 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">Visited events</h2>
            <span className="text-sm text-secondary">{visitedEvents.length} total</span>
          </div>

          {visitedEvents.length === 0 ? (
            <p className="mt-4 text-sm text-secondary">
              You have not visited any events yet. Register for events to start tracking them here.
            </p>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {visitedEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-col gap-2 rounded-xl border border-secondary/30 bg-primary/5 p-4 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-primary">{event.title}</h3>
                  <p className="text-sm text-secondary">{formatEventDate(event.date)}</p>
                  <p className="text-sm text-secondary">{event.location}</p>
                  <span className="inline-flex w-fit rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                    {event.category}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Host request entry (moved below visited events) */}
        <section className="rounded-2xl border border-secondary/30 bg-primary/5 p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-primary">Become an Event Host</h2>
              <p className="text-sm text-secondary">
                Apply to host events. Admins will review your request.
              </p>
            </div>
            <Button type="button" variant="primary" onClick={onRequestHost} className="min-w-[200px]">
              Request Event Host
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/30 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-red-600">Sign out</h2>
              <p className="text-sm text-secondary">
                {showSignOutConfirm 
                  ? 'Are you sure you want to sign out?' 
                  : 'Signing out will require your credentials next time. You can sign back in at any time.'}
              </p>
            </div>
            {showSignOutConfirm ? (
              <div className="flex gap-2 min-w-[160px]">
                <Button 
                  type="button" 
                  variant="danger" 
                  onClick={handleConfirmSignOut}
                  className="flex-1"
                  size="small"
                >
                  Confirm
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancelSignOut}
                  className="flex-1"
                  size="small"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button type="button" variant="danger" onClick={handleSignOutClick} className="min-w-[160px]">
                Sign out
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentProfile;
