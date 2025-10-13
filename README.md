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

- `src/pages/EventListing.jsx` — student event feed (loads from `/api/events`), week/category/campus filters, `showTopBar` prop for embedded use.
- `src/pages/ReviewEventDetail.js` — student event details (Title/Description/Date/Time/Hosted By/Venue/Campus/Image).
- `src/pages/HostMain.jsx` — host workspace (Overview, My Events, Feed, Account) with left sidebar.
- `src/pages/HostCreateEvent.jsx` — create event overlay (free‑text `venue`, `ImageUrl`).
- `src/pages/HostEventDetail.jsx` — editable event detail overlay (Save/Duplicate/Delete/Status) honoring host active status.
- `src/pages/AdminMainDash.jsx` – admin dashboard with Host Applications review (grid + detail modal) and Users management (search, edit, delete, reactivate host).
  - Users list includes role filter pills (`All`, `Student`, `Host`, `Admin`) and color‑coded badges (Student=purple, Host=blue, Admin=bright green). On mobile, emails are shortened (e.g., `45829084@myn...`) to keep badges neatly inside cards.
- `src/components/Sidebar.jsx` — responsive sidebar; mobile drawer + desktop rail.
- `src/api/client.js` — API helpers (`events`, `hosts` analytics, `admin` host applications).

For a deeper walk‑through see `docs/FRONTEND_GUIDE.md`.
