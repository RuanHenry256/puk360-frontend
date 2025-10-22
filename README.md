# PUK360 Frontend

React + Tailwind app for students, hosts, and admins.

## Development

1) Set backend URL in `.env`:
```
REACT_APP_API_URL=http://localhost:5000
```
2) Install deps and start:
```
npm install
npm start
```

## Structure

- `src/pages/EventListing.jsx` â€” student event feed (loads from `/api/events`), week/category/campus filters, `showTopBar` prop for embedded use.
- `src/pages/ReviewEventDetail.js` â€” student event details (Title/Description/Date/startTimeâ€“endTime/Hosted By/Venue/Campus/Image).
- `src/pages/HostMain.jsx` â€” host workspace (Overview, My Events, Feed, Account) with left sidebar.
- `src/pages/HostCreateEvent.jsx` â€” create event overlay (freeâ€‘text `venue`, `ImageUrl`).
- `src/pages/HostEventDetail.jsx` â€” editable event detail overlay (Save/Duplicate/Delete/Status) honoring host active status.
- `src/pages/AdminMainDash.jsx` — admin dashboard with:
  - Two-column Overview metrics (Engagement, Event Analytics, User Insights, Feedback & Reviews, System Health).
  - Victory charts for events-per-month and user growth.
  - Events tab mirroring Host “My Events” but over all events (search/filter, detail overlay, duplicate/cancel/delete, create).
  - Host Applications review (grid + detail modal with approve/reject + comment).
  - Users management (search, filter by role, edit user, delete, reactivate host, reset password). On mobile, emails shorten for layout.
  - Logs tab (read-only terminal view) from `/api/admin/logs`.
  - Profile tab to edit the current admin profile (name/email).
- `src/components/Sidebar.jsx` — hamburger dropdown menu (animated) used across desktop and mobile. Legacy sticky rail available via `embed` prop.
- `src/api/client.js` — API helpers (`events`, `hosts` analytics, admin users/roles/host applications/dashboard/logs).
For a deeper walkâ€‘through see `docs/FRONTEND_GUIDE.md`.
