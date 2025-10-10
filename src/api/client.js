/**
 * Minimal API client for the frontend.
 * Wraps fetch with JSON handling and exposes common API calls.
 */

const RAW_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Ensure no trailing slash
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
    throw new Error((data && data.error) || (typeof data === "string" ? data : `HTTP ${res.status}`));
  }
  return data;
}

export const api = {
  login: (email, password) => 
    http("/api/auth/login", { method: "POST", body: { email, password } }),
  
  register: (name, email, password) => 
    http("/api/auth/register", { method: "POST", body: { name, email, password } }),
  
  updateProfile: (updates, token) => 
    http("/api/users/me", { method: "PATCH", body: updates, token }),
  
  // New function to fetch users
  getUsers: () => 
    http("/api/users", { method: "GET" }),

  // Generic helpers
  post: (path, body, token) => 
    http(path, { method: "POST", body, token }),

  // Host applications
  createHostApplication: (
    { org_name, event_category, proposed_event_title, proposed_event_summary, proposed_date, motivation },
    token
  ) =>
    http("/api/host-applications", {
      method: "POST",
      body: { org_name, event_category, proposed_event_title, proposed_event_summary, proposed_date, motivation },
      token,
    }),
};