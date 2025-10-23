# Poster Uploads (Frontend)

This covers the UX and client flow for S3 poster uploads.

## UX
- Drag‑and‑drop or click to select an image in the Create Event modal.
- Immediate preview appears; an overlay progress bar shows upload progress.
- On success, the preview swaps to the remote S3 URL.
- On submit, event creation requires an image; only `ImageUrl` is sent (no file bytes).

## Validation
- Allowed types: PNG, JPG/JPEG, WEBP, GIF
- Max size: 8MB

## API
- Presign: `POST /api/poster/presign` with `{ mimeType }`
- Response: `{ key, uploadUrl, publicUrl }`
- Upload: `PUT uploadUrl` with `Content-Type: mimeType` (XHR used to show progress)

## Files
- `src/pages/HostCreateEvent.jsx` — upload + preview + progress; includes `ImageUrl` on create
- `src/api/client.js` — `api.poster.presign(mimeType, token)`
- `src/pages/ReviewEventDetail.js` — inline 4:3 poster preview with click‑to‑view‑full modal
