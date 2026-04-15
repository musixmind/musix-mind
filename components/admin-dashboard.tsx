"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Inbox, Radio, Settings, ShieldCheck } from "lucide-react";
import { SubmissionCard } from "@/components/submission-card";
import type { Submission, SubmissionStatus } from "@/lib/types";

const sidebar = [
  { label: "Submissions", icon: Inbox },
  { label: "Playback", icon: Radio },
  { label: "Insights", icon: BarChart3 },
  { label: "Settings", icon: Settings }
];

export function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/submissions")
      .then((response) => response.json())
      .then((payload) => setSubmissions(payload.submissions ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  const metrics = useMemo(() => {
    return {
      pending: submissions.filter((submission) => submission.status === "Pending").length,
      shortlisted: submissions.filter((submission) => submission.status === "Shortlisted").length,
      signed: submissions.filter((submission) => submission.status === "Signed").length
    };
  }, [submissions]);

  async function updateStatus(id: string, status: SubmissionStatus) {
    const response = await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      return;
    }

    setSubmissions((current) =>
      current.map((submission) => (submission.id === id ? { ...submission, status } : submission))
    );
  }

  return (
    <div className="grid min-h-screen border-t border-white/10 lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-white/10 bg-white/[0.03] p-5 lg:border-b-0 lg:border-r">
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric/15 text-electric">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-black text-white">A&R Console</p>
              <p className="text-xs text-white/45">Admin review room</p>
            </div>
          </div>
        </div>
        <nav className="mt-6 grid gap-2">
          {sidebar.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-bold text-white/62 transition hover:bg-white/[0.06] hover:text-electric"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <section className="px-5 py-8 md:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label text-electric">Admin Dashboard</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Demo Submissions</h1>
            <p className="mt-4 max-w-2xl text-white/58">
              Review inbound tracks, play uploads, move artists through the label pipeline.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="glass-card rounded-lg p-5">
            <p className="label">Pending</p>
            <p className="mt-3 text-4xl font-black text-yellow-200">{metrics.pending}</p>
          </div>
          <div className="glass-card rounded-lg p-5">
            <p className="label">Shortlisted</p>
            <p className="mt-3 text-4xl font-black text-violet-200">{metrics.shortlisted}</p>
          </div>
          <div className="glass-card rounded-lg p-5">
            <p className="label">Signed</p>
            <p className="mt-3 text-4xl font-black text-emerald-200">{metrics.signed}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-5">
          {isLoading ? (
            <div className="glass-card rounded-lg p-8 text-white/55">Loading submissions...</div>
          ) : submissions.length ? (
            submissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} onStatusChange={updateStatus} />
            ))
          ) : (
            <div className="glass-card rounded-lg p-8">
              <p className="text-lg font-black">No submissions yet.</p>
              <p className="mt-2 text-sm text-white/55">New demos will appear here after artists submit the form.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
