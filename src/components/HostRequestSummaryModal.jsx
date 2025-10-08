import React from "react";
import Button from "./Button";

export default function HostRequestSummaryModal({ open, onClose, data }) {
  if (!open || !data) return null;

  const {
    org_name,
    event_category,
    motivation,
    applicationId,
    status,
    submittedAt,
  } = data;

  const submitted = submittedAt
    ? new Date(submittedAt)
    : new Date();

  const submittedLocal = submitted.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white dark:bg-surface-dm border border-primary/30 dark:border-primary-dm/30 shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-primary/20 dark:border-primary-dm/20 bg-primary/5 dark:bg-primary-dm/10">
          <h3 className="text-lg font-semibold">Host Application Submitted</h3>
        </div>
        <div className="px-6 py-5 space-y-3">
          <div className="text-sm"><span className="font-semibold">Reference:</span> #{applicationId || "—"}</div>
          <div className="text-sm"><span className="font-semibold">Date & Time:</span> {submittedLocal}</div>
          <div className="text-sm"><span className="font-semibold">Status:</span> {status || "PENDING"}</div>
          <hr className="my-3 border-primary/20 dark:border-primary-dm/20" />
          <div className="text-sm"><span className="font-semibold">Organisation:</span> {org_name}</div>
          <div className="text-sm"><span className="font-semibold">Category:</span> {event_category}</div>
          <div className="text-sm whitespace-pre-wrap"><span className="font-semibold">Motivation:</span> {" "}{motivation}</div>
        </div>
        <div className="px-6 py-4 bg-primary/5 dark:bg-primary-dm/10 flex justify-end gap-3">
          <Button onClick={onClose} type="button" variant="primary">Close</Button>
        </div>
      </div>
    </div>
  );
}

