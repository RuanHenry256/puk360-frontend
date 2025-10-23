import React, { useEffect, useRef, useState } from 'react';
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
  const [imageUrl, setImageUrl] = useState(''); // remote public URL from S3
  const [imageKey, setImageKey] = useState(''); // S3 object key
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notify, setNotify] = useState({ visible: false, type: 'error', message: '' });

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
  const handleFile = async (file) => {
    if (!file) return;

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    const maxBytes = 8 * 1024 * 1024; // 8MB
    if (!file.type || !allowed.includes(file.type)) {
      toastError('Invalid file. Allowed: PNG, JPG/JPEG, WEBP, GIF (≤ 8MB).');
      return;
    }
    if (file.size > maxBytes) {
      toastError('File too large. Max size is 8MB.');
      return;
    }

    setError('');
    setImageFile(file);

    // Revoke previous preview to avoid leaks
    if (imagePreview) {
      try { URL.revokeObjectURL(imagePreview); } catch (_) {}
    }
    // Immediate local preview
    try {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } catch (_e) {
      setImagePreview('');
    }

    // Begin presign + upload flow
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not signed in');

      setUploading(true);
      setUploadProgress(0);

      const presign = await api.poster.presign(file.type, token);
      if (!presign || !presign.uploadUrl || !presign.publicUrl) {
        throw new Error('Failed to presign upload.');
      }

      const { uploadUrl, publicUrl, key } = presign;

      await putWithProgress(uploadUrl, file, file.type, (pct) => setUploadProgress(pct));

      setImageUrl(publicUrl || '');
      setImageKey(key || '');
      // swap preview to remote URL to match acceptance
      try { if (imagePreview) URL.revokeObjectURL(imagePreview); } catch (_) {}
      if (publicUrl) setImagePreview(publicUrl);
      setUploadProgress(100);
      setUploading(false);
    } catch (e) {
      setUploading(false);
      setUploadProgress(0);
      setImageUrl('');
      setImageKey('');
      toastError(e?.message || 'Image upload failed');
    }
  };
  const handleInputChange = (e) => handleFile(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  };
  const preventDefault = (e) => e.preventDefault();

  // XHR PUT with upload progress
  function putWithProgress(url, blob, contentType, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          onProgress?.(pct);
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(true);
        } else {
          reject(new Error(`Upload failed (${xhr.status})`));
        }
      };
      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(blob);
    });
  }

  // simple in-component toast
  function toastError(message) {
    setNotify({ visible: true, type: 'error', message });
    // also keep legacy inline error for accessibility
    setError(message);
    window.clearTimeout(toastError._t);
    toastError._t = window.setTimeout(() => setNotify((p) => ({ ...p, visible: false })), 3500);
  }

  useEffect(() => {
    return () => {
      if (imagePreview) {
        try { URL.revokeObjectURL(imagePreview); } catch (_) {}
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      if (!token || !user?.id) throw new Error('Not signed in');

      if (imageFile && uploading) {
        toastError('Please wait for image upload to finish.');
        return;
      }

      const payload = {
        ...form,
        Host_User_ID: user.id,
        Status: 'Scheduled',
      };
      if (!imageUrl) {
        toastError('Please add an image for your event.');
        return;
      }
      payload.ImageUrl = imageUrl;

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
            className="relative flex h-56 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-secondary/50 bg-secondary/5 p-4 text-center hover:bg-secondary/10"
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
            {/* Progress bar overlay */}
            {uploading && (
              <div className="absolute inset-x-0 bottom-0 mx-3 mb-3 h-2 rounded-full bg-secondary/30">
                <div
                  className="h-2 rounded-full bg-primary transition-[width]"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleInputChange}
            />
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

      {/* Toast notification */}
      {notify.visible && (
        <div className="pointer-events-none fixed right-6 top-6 z-50">
          <div className={`rounded-lg px-4 py-2 text-sm shadow ${notify.type==='error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
            {notify.message}
          </div>
        </div>
      )}
    </div>
  );
}
