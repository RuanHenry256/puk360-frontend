# Frontend Guide (Iteration)

This guide lists the major UI components and flows implemented.

## Event feed and details (student)
- `src/pages/EventListing.jsx`
  - Loads from `GET /api/events`
  - Week filter (Mon–Sun), dynamic Category and Campus filters, search, clear-all
  - Loading and error states
  - `showTopBar` prop allows embedding without the student TopBar
- `src/pages/ReviewEventDetail.js`
  - Fetches `GET /api/events/:id`
  - Renders Title, Description, Date/startTime–endTime, Hosted By, Venue/Campus, Image

## Host workspace
- `src/pages/HostMain.jsx`
  - Tabs: Overview, My Events, Feed, Account
  - Overview shows KPIs and insights using `/api/hosts/:id/...` endpoints
  - My Events: search + filters, click row → `HostEventDetail` overlay
  - Create Event overlay: `HostCreateEvent.jsx` (free‑text venue, ImageUrl, etc.)
  - Creation UI is responsive:
    - Desktop: “+ Create Event” button on the right of the filter bar
    - Mobile: floating `+` FAB at the bottom
  - Account editor mirrors student UX; banner shows Active/Inactive status
  - Uses `Sidebar.jsx` for navigation. On all breakpoints we now use a hamburger-triggered dropdown rather than a full-height rail:
    - Desktop and mobile: top-left hamburger opens a floating dropdown containing all nav items and the Sign out action.
    - The dropdown animates from under the navbar and closes with a fade/scale.
- `src/pages/HostEventDetail.jsx`
  - View mode with status selector, Edit toggles inline form
  - Actions: Save, Duplicate, Delete, Update Status
  - Honors `canEdit` (disabled for inactive hosts)

## Admin
- `src/pages/AdminMainDash.jsx`
  - Overview dashboard with metrics (two-column layout on desktop):
    - Engagement: Attended (Total, This Month), Avg Attendance/Event, Active Users (7d), Most Popular Event.
    - Event Analytics: Upcoming, Cancelled, Category breakdown, Top venues.
    - User Insights: New users (This Month), Verified vs Pending Hosts, Avg Host Rating, Most Active User.
    - Feedback & Reviews: Total Reviews, Avg Event Rating, Most Reviewed Event, recent snippets.
    - System Health: DB connection, Last backup, API uptime (past 24h), Storage used.
    - Charts: Victory (SVG) bar and line charts (`victory` package). No custom CSS bars anymore.
  - Events: Admins can search/filter all events, open details, duplicate/cancel/delete, and create events — mirrors the Host “My Events” UX but operates on all events.
  - Host Applications: grid + detail modal with Approve/Reject and reviewer comment.
  - Users: searchable list with role filter (All/Student/Host/Admin), color‑coded badges; dedicated edit screen (edit name/email/roles, delete, reactivate host, reset password).
    - Admins can set a new password for a user. Leave blank to keep existing.
  - Logs: new read‑only tab that shows audit logs from the backend (black terminal‑style viewer with search + refresh).
  - Profile: new tab allowing the currently‑signed‑in admin to edit their own name/email.
  - Uses `Sidebar.jsx` dropdown navigation.

## Shared components
- `src/components/Sidebar.jsx`
  - Reusable responsive menu for Host/Admin.
  - Modes:
    - `dropdown` (current): floating card under the navbar; used on all breakpoints.
    - `embed` (legacy): sticky rail for traditional desktop layouts.
  - Props: `{ open, onClose, items, activeId, onSelect, onSignOut, dropdown, embed }`.
  - Animation: fade/scale/slide from the navbar, with a small gap below the top bar.
- `src/components/Spinner.jsx`
  - Simple circular loader used across the app (example: `<Spinner size={40} />`)
- `src/api/client.js`
  - Event helpers: `api.events.list/get/create/delete/updateStatus`.
  - Host analytics: `api.hosts.stats/topEvents/categoryMix/rsvpTrend/recentReviews`.
  - Admin: `api.admin.users/*`, `api.admin.roles`, `api.admin.dashboard`, `api.admin.host-applications/*`, `api.admin.auditLogs(limit, token, q)`.

## Icons
- We use `lucide-react` for icons (install with `npm install lucide-react`).
- Examples: Host/Admin sidebars (Home, CalendarDays, Newspaper/ClipboardList, User2), event summary (Music, Tag, Building2, CalendarDays, Clock3, MapPin)

## Motion + Loading
- Desktop view changes add `page-animate` to fade/slide content in.
- Mobile lists use `fade-in-mobile` to softly fade in on load.
- All modals darken the background (`bg-black/50`).

---

## Admin: User Management (updated)
- Users list now loads from the backend and supports search.
  - Endpoint: `GET /api/admin/users?q=<term>` (Bearer token required)
- Tapping a user opens a dedicated edit screen.
  - Edit: name, email, roles (IDs: `1=Student`, `2=Host`, `3=Admin`).
  - Reset password: optional new/confirm password fields. If provided, password is updated by the backend (SQL SHA‑256 hash).
  - Delete user.
  - If Host role is selected and the host account is inactive, a Reactivate button appears (calls `POST /api/admin/hosts/:id/reactivate`).
- Overview tile “Total Users” uses the loaded list count instead of a hardcoded number.

Enhancements
- Role filter pills above the list: `All`, `Student`, `Host`, `Admin`.
  - Filters combine with the text search.
- Color‑coded role badges for quick scanning:
  - Student = purple, Host = blue, Admin = bright green.
- Mobile readability: user email is shortened (e.g., `45829084@myn...`) to keep the role badge inside the card without overflow.

Notes
- If `/api/admin/roles` is unavailable, the edit screen falls back to the known role IDs (1,2,3) and still pre‑selects the user’s current roles.

## Admin: Events (new)
- Mirrors the Host “My Events” experience but over all events:
  - Search, Upcoming/Past/All, and Status filters.
  - Row actions: Duplicate, Cancel, Delete.
  - Detail overlay uses `HostEventDetail` with `canEdit=true`.
  - “+ Create Event” opens `HostCreateEvent` overlay (admins can create new events).
  - Lists from `api.events.list({})` (no host filter).

## Admin: Overview metrics (updated)
- Reads from `GET /api/admin/dashboard` and renders the sections above.
- The UI merges server metrics with fallbacks derived from events/users so tiles never display misleading zeros.
- Category breakdown accepts either object maps or arrays of `{category, count}`.
- “New users (This Month)” and “Most active user” prefer server data which now draws from audit logs (see backend docs).

## Host Overview accuracy (new)
- Overview stats refresh when landing on the Overview tab and after creating an event, so “Upcoming Events” reflects new events.

## Login background + logos (new)
- Background planes oversize to eliminate top‑left gaps on wide screens; animation slowed for mobile and desktop.
- NWU logos are larger on desktop in both left hero and login card header.
 - Layout refinements: login card and controls reduced ~10% (smaller logo/title, tighter paddings, shorter inputs) for better default 100% zoom ergonomics.

## Environment
- Frontend uses `REACT_APP_API_URL` to reach the backend (defaults to `http://localhost:5000`).

