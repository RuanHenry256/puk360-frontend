/**
 * Minimal API client for the frontend.
 * Wraps fetch with JSON handling and exposes common API calls.
 */
const RAW_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ensure no trailing slash
const API_BASE = RAW_BASE.replace(/\/+$/, "");

async function http(path, { method = "GET", body, token } = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const text = typeof data === 'string' ? data : '';
    const looksHtml = /<\s*!doctype|<\s*html/i.test(text);
    const message = (data && data.error)
      || (looksHtml ? `API ${method} ${url} returned ${res.status}. Is the backend running at ${API_BASE}?`
      : (text || `HTTP ${res.status}`));
    throw new Error(message);
  }
  return data;
}

export const api = {
  login: (email, password) => http("/api/auth/login", { method: "POST", body: { email, password } }),
  register: (name, email, password) => http("/api/auth/register", { method: "POST", body: { name, email, password } }),
  updateProfile: (updates, token) => http("/api/users/me", { method: "PATCH", body: updates, token }),
  // generic helpers
  post: (path, body, token) => http(path, { method: "POST", body, token }),
  // host applications
  createHostApplication: (
    { org_name, event_category, proposed_event_title, proposed_event_summary, proposed_date, motivation },
    token
  ) =>
    http("/api/host-applications", {
      method: "POST",
      // include event_category explicitly so backend doesn't try to derive from summary
      body: { org_name, event_category, proposed_event_title, proposed_event_summary, proposed_date, motivation },
      token,
    }),
  // events
  events: {
    list: async (params = {}) => {
      const search = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && String(v).length) search.set(k, String(v));
      });
      const path = `/api/events${search.toString() ? `?${search.toString()}` : ''}`;
      const res = await http(path, { method: "GET" });
      return Array.isArray(res?.data) ? res.data : [];
    },
    get: async (id) => {
      const res = await http(`/api/events/${id}`, { method: "GET" });
      return res?.data || null;
    },
    create: async (payload, token) => {
      const res = await http("/api/events", { method: "POST", body: payload, token });
      return res?.data || null;
    },
    delete: async (id, token) => {
      await http(`/api/events/${id}`, { method: "DELETE", token });
      return true;
    },
    updateStatus: async (id, Status, token) => {
      const res = await http(`/api/events/${id}/status`, { method: "PATCH", body: { Status }, token });
      return res?.data || null;
    },
  },
  venues: {
    list: async () => {
      const res = await http("/api/venues", { method: "GET" });
      return Array.isArray(res?.data) ? res.data : [];
    },
  },
  hosts: {
    stats: async (hostUserId) => {
      const res = await http(`/api/hosts/${hostUserId}/stats`, { method: 'GET' });
      return res?.data || { avgRating: 0, totalUpcoming: 0, avgRsvpPerEvent: 0 };
    },
    topEvents: async (hostUserId, metric = 'rsvps', limit = 2) => {
      const res = await http(`/api/hosts/${hostUserId}/top-events?metric=${encodeURIComponent(metric)}&limit=${limit}`, { method: 'GET' });
      return Array.isArray(res?.data) ? res.data : [];
    },
    categoryMix: async (hostUserId) => {
      const res = await http(`/api/hosts/${hostUserId}/category-mix`, { method: 'GET' });
      return Array.isArray(res?.data) ? res.data : [];
    },
    rsvpTrend: async (hostUserId, days = 30) => {
      const res = await http(`/api/hosts/${hostUserId}/rsvp-trend?days=${days}`, { method: 'GET' });
      return Array.isArray(res?.data) ? res.data : [];
    },
    recentReviews: async (hostUserId, limit = 5) => {
      const res = await http(`/api/hosts/${hostUserId}/recent-reviews?limit=${limit}`, { method: 'GET' });
      return Array.isArray(res?.data) ? res.data : [];
    },
  },
  rsvp: {
    listByUser: async (userId) => {
      const res = await http(`/api/events/users/${userId}`, { method: 'GET' });
      return Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
    },
  },
  uploads: {
    // Request a presigned URL for image upload. Backend should respond with
    // { uploadUrl, publicUrl } where uploadUrl is the PUT URL and publicUrl is the eventual CDN/S3 URL.
    presignImage: async (filename, contentType, token) => {
      return http('/api/uploads/presign', {
        method: 'POST',
        body: { filename, contentType, folder: 'events' },
        token,
      });
    },
  },
  admin: {
    listUsers: async (q = '', token) => {
      const qp = q && String(q).trim().length ? `?q=${encodeURIComponent(q)}` : '';
      const res = await http(`/api/admin/users${qp}`, { method: 'GET', token });
      return Array.isArray(res?.data) ? res.data : [];
    },
    getUser: async (id, token) => {
      const res = await http(`/api/admin/users/${id}`, { method: 'GET', token });
      return res?.data || res;
    },
    reactivateHost: async (id, token) => {
      const res = await http(`/api/admin/hosts/${id}/reactivate`, { method: 'POST', token });
      return res?.data || null;
    },
    listRoles: async (token) => {
      const res = await http('/api/admin/roles', { method: 'GET', token });
      return Array.isArray(res?.data) ? res.data : [];
    },
    dashboard: async (token) => {
      const res = await http('/api/admin/dashboard', { method: 'GET', token });
      return res?.data || { counts: {}, recent: {} };
    },
    updateUser: async (id, payload, token) => {
      const res = await http(`/api/admin/users/${id}`, { method: 'PATCH', body: payload, token });
      return res?.data || null;
    },
    deleteUser: async (id, token) => {
      const res = await http(`/api/admin/users/${id}`, { method: 'DELETE', token });
      return !!res?.ok || true;
    },
    listHostApplications: async (status = 'All', token) => {
      const res = await http(`/api/admin/host-applications?status=${encodeURIComponent(status)}`, { method: 'GET', token });
      return Array.isArray(res?.data) ? res.data : [];
    },
    reviewHostApplication: async (id, { decision, comment }, token) => {
      const res = await http(`/api/admin/host-applications/${id}`, { method: 'PATCH', body: { decision, comment }, token });
      return res?.ok !== false;
    },
  },
  // convenience update for events
  updateEvent: async (id, body, token) => http(`/api/events/${id}`, { method: 'PATCH', body, token }),
};
