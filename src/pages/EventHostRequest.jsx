// src/pages/EventHostRequest.jsx
import React, { useMemo, useState } from "react";
import Button from "../components/Button";
import TopBar from "../components/TopBar";
import { api } from "../api/client";
import HostRequestSummaryModal from "../components/HostRequestSummaryModal";

export default function EventHostRequest({ onBack }) {
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const token = localStorage.getItem("token");
  const isAuthed = !!token;

  const [form, setForm] = useState({ org_name: "", event_category: "", motivation: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  const onChange = (e) => {
    setError("");
    setSuccessMsg("");
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!isAuthed) return "Your session has expired. Please sign in again.";
    if (!form.org_name?.trim()) return "Please enter your organisation name.";
    if (!form.event_category?.trim()) return "Please select the type of events you do.";
    if (!form.motivation?.trim()) return "Please provide a short motivation for your application.";
    return "";
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");
    setSuccessMsg("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const res = await api.createHostApplication(
        { org_name: form.org_name, event_category: form.event_category, motivation: form.motivation },
        token
      );

      const applicationId = res?.application_id || res?.data?.application_id;
      const status = res?.status || res?.data?.status || "PENDING";
      const submittedAt = new Date().toISOString();

      setSummaryData({
        org_name: form.org_name,
        event_category: form.event_category,
        motivation: form.motivation,
        applicationId,
        status,
        submittedAt,
      });
      setShowSummary(true);

      setSuccessMsg(applicationId ? `Request submitted! Reference #${applicationId}.` : "Request submitted!");
      setForm({ org_name: "", event_category: "", motivation: "" });
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Something went wrong submitting your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-text">
      <TopBar onBack={onBack} backLabel="Back to Profile" />
      <HostRequestSummaryModal open={showSummary} onClose={() => setShowSummary(false)} data={summaryData} />

      <div className="mx-auto w-full max-w-4xl flex flex-col gap-6 px-4 pt-[88px] pb-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-2 rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-sm uppercase tracking-wide text-secondary">Host Application</p>
              <h1 className="text-3xl font-bold text-primary sm:text-4xl">Request Event Host Access</h1>
              <p className="text-sm text-secondary">
                {isAuthed ? (
                  <>Signed in as <span className="font-semibold">{storedUser?.Name || storedUser?.name || storedUser?.Email || storedUser?.email || "Student"}</span></>
                ) : (
                  <span className="text-red-600">Your session has expired. Please sign in again.</span>
                )}
              </p>
            </div>
          </div>
          {(error || successMsg) && (
            <p className={`text-sm ${error ? "text-red-600" : "text-green-600"}`}>{error || successMsg}</p>
          )}
        </header>

        {/* Form */}
        <section className="rounded-2xl border border-secondary/30 bg-primary/5 p-6 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
              Organisation / Society Name
              <input
                type="text"
                name="org_name"
                value={form.org_name}
                onChange={onChange}
                placeholder="e.g., NWU Computer Society"
                className="rounded-lg border border-secondary/60 px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
              Type of Events
              <select
                name="event_category"
                value={form.event_category}
                onChange={onChange}
                className="rounded-lg border border-secondary/60 px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Select a category</option>
                <option value="Sports">Sports</option>
                <option value="Music">Music</option>
                <option value="Art">Art</option>
                <option value="Community">Community</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
              Motivation
              <textarea
                name="motivation"
                value={form.motivation}
                onChange={onChange}
                rows={4}
                placeholder="Briefly describe why you/your society should host events."
                className="rounded-lg border border-secondary/60 px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
              />
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
              <small className="text-secondary text-sm">
                Submitting creates a review ticket for admins. If approved, your account becomes a Host.
              </small>
              <Button type="submit" variant="primary" disabled={loading || !isAuthed} className="min-w-[200px]">
                {loading ? "Submitting…" : "Submit request"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
