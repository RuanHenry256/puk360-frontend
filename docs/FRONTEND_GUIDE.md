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
  - Renders Title, Description, Date/Time, Hosted By, Venue/Campus, Image

## Host workspace
- `src/pages/HostMain.jsx`
  - Tabs: Overview, My Events, Feed, Account
  - Overview shows KPIs and insights using `/api/hosts/:id/...` endpoints
  - My Events: search + filters, click row → `HostEventDetail` overlay
  - Create Event overlay: `HostCreateEvent.jsx` (free‑text venue, ImageUrl, etc.)
  - Account editor mirrors student UX; banner shows Active/Inactive status
  - Uses `Sidebar.jsx` for navigation (mobile drawer / desktop rail)
- `src/pages/HostEventDetail.jsx`
  - View mode with status selector, Edit toggles inline form
  - Actions: Save, Duplicate, Delete, Update Status
  - Honors `canEdit` (disabled for inactive hosts)

## Admin
- `src/pages/AdminMainDash.jsx`
  - New Host Applications section
  - Two‑column card grid (desktop)
  - Detail modal with Approve/Reject + reviewer comment
  - Uses `Sidebar.jsx`

## Shared components
- `src/components/Sidebar.jsx`
  - Reusable responsive menu for Host/Admin
  - Props: `{ open, onClose, items, activeId, onSelect, onSignOut }`
- `src/api/client.js`
  - Added `api.events.create/delete/updateStatus`, `api.hosts.*` analytics, and `api.admin.*` review endpoints

