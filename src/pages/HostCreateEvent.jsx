import React, { useRef, useState } from 'react';
import Button from '../components/Button';
import { api } from '../api/client';

const CAMPUSES = ['Potchefstroom', 'Mahikeng', 'Vaal'];
const CATEGORIES = [
  'Entertainment', 'Community', 'Music', 'Sports', 'Art', 'Academic',
  'Workshop', 'Seminar', 'Career', 'Networking', 'Cultural', 'Technology',
  'Health & Wellness', 'Gaming', 'Competition', 'Orientation', 'Charity', 'Other'
];

export default function HostCreateEvent({ onCancel, onCreated }) {
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [form, setForm] = useState({
    Title: '',
    Description: '',
    Date: '',
    startTime: '',
    endTime: '',
    campus: 'Potchefstroom',
    venue: '',
    category: 'Entertainment',
    hostedBy: 'NWU Events',
    ImageUrl: '',
  });

  const update = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // Image upload handlers (drag-and-drop or click to browse)
  const handleChooseFile = () => fileInputRef.current?.click();
  const handleFile = (file) => {
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, JPEG, GIF, WebP).');
      return;
    }
    setError('');
    setImageFile(file);
    try {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } catch (_e) {
      setImagePreview('');
    }
  };
  const handleInputChange = (e) => handleFile(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  };
  const preventDefault = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      if (!token || !user?.id) throw new Error('Not signed in');

      // Optional: upload selected image to S3 via presigned URL (when backend supports it)
      let imageUrl = null;
      if (imageFile) {
        try {
          const { uploadUrl, publicUrl } = await api.uploads.presignImage(
            imageFile.name,
            imageFile.type,
            token
          );
          await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': imageFile.type },
            body: imageFile,
          });
          imageUrl = publicUrl || null;
        } catch (_) {
          imageUrl = null; // uploads not configured yet
        }
      }

      const payload = {
        ...form,
        Host_User_ID: user.id,
        Status: 'Scheduled',
      };
      if (imageUrl) payload.ImageUrl = imageUrl;

      const created = await api.events.create(payload, token);
      onCreated?.(created);
    } catch (e2) {
      setError(e2.message || 'Failed to create event');
    }
  };

  return (
    <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-primary">Create Event</h2>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: image drag & drop area */}
        <div>
          <label className="mb-2 block text-sm font-medium text-secondary">Event image</label>
          <div
            className="flex h-56 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-secondary/50 bg-secondary/5 p-4 text-center hover:bg-secondary/10"
            onClick={handleChooseFile}
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
            onDrop={handleDrop}
            role="button"
            aria-label="Upload event image"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Selected event" className="h-full w-full rounded-lg object-contain" />
            ) : (
              <div className="text-sm text-secondary">
                <p className="font-medium text-primary">Drag and drop image here</p>
                <p className="mt-1">or click to browse</p>
                <p className="mt-2 text-xs">PNG, JPG, JPEG, GIF, WebP</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
          </div>
        </div>

        {/* Right: existing form */}
        <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-secondary">Title</label>
          <input name="Title" value={form.Title} onChange={update} required className="w-full rounded-lg border px-3 py-2" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-secondary">Description</label>
          <textarea name="Description" value={form.Description} onChange={update} rows={4} className="w-full rounded-lg border px-3 py-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Date</label>
            <input type="date" name="Date" value={form.Date} onChange={update} required className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Start Time</label>
            <input type="time" name="startTime" value={form.startTime} onChange={update} required className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">End Time</label>
            <input type="time" name="endTime" value={form.endTime} onChange={update} className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Campus</label>
            <select name="campus" value={form.campus} onChange={update} className="w-full rounded-lg border px-3 py-2">
              {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Venue (text)</label>
            <input name="venue" value={form.venue} onChange={update} placeholder="e.g. Amphi Theatre" className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Category</label>
            <select name="category" value={form.category} onChange={update} className="w-full rounded-lg border px-3 py-2">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-secondary">Hosted By</label>
              <input name="hostedBy" value={form.hostedBy} onChange={update} className="w-full rounded-lg border px-3 py-2" />
            </div>
          </div>

        

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Create Event</Button>
        </div>
        </form>
      </div>
    </div>
  );
}



