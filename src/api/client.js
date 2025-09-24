/**
 * Minimal API client for the frontend.
 * Wraps fetch with JSON handling and exposes login/register calls.
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
    throw new Error((data && data.error) || (typeof data === "string" ? data : `HTTP ${res.status}`));
  }
  return data;
}

export const api = {
  login: (email, password) => http("/api/auth/login", { method: "POST", body: { email, password } }),
  register: (name, email, password) => http("/api/auth/register", { method: "POST", body: { name, email, password } }),
};
