"use client";

import { useState } from "react";
import { Clock3, Mail, Music, UserRound } from "lucide-react";
import { AudioPlayer } from "@/components/audio-player";
import type { Submission, SubmissionStatus } from "@/lib/types";

const tagClass: Record<SubmissionStatus, string> = {
  Pending: "border-yellow-300/30 bg-yellow-300/10 text-yellow-200",
  Reviewed: "border-sky-300/30 bg-sky-300/10 text-sky-200",
  Shortlisted: "border-violet-300/30 bg-violet-300/10 text-violet-200",
  Signed: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
};

const statuses: SubmissionStatus[] = ["Pending", "Reviewed", "Shortlisted", "Signed"];

export function SubmissionCard({
  submission,
  onStatusChange
}: {
  submission: Submission;
  onStatusChange: (id: string, status: SubmissionStatus) => Promise<void>;
}) {
  const [status, setStatus] = useState<SubmissionStatus>(submission.status);
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(nextStatus: SubmissionStatus) {
    setIsSaving(true);
    setStatus(nextStatus);
    await onStatusChange(submission.id, nextStatus);
    setIsSaving(false);
  }

  return (
    <article className="glass-card rounded-lg p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${tagClass[status]}`}>
              {status}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/55">
              {submission.genre}
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-black text-white">{submission.track_title}</h3>
          <div className="mt-3 grid gap-2 text-sm text-white/55 sm:grid-cols-2">
            <span className="inline-flex items-center gap-2">
              <UserRound className="h-4 w-4 text-electric" />
              {submission.artist_name}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-electric" />
              {submission.email}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-electric" />
              {new Date(submission.created_at).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center gap-2">
              <Music className="h-4 w-4 text-electric" />
              {submission.plays} plays tracked
            </span>
          </div>
        </div>
        <select
          value={status}
          onChange={(event) => handleChange(event.target.value as SubmissionStatus)}
          disabled={isSaving}
          className="field max-w-52"
        >
          {statuses.map((item) => (
            <option key={item} value={item} className="bg-black">
              {item}
            </option>
          ))}
        </select>
      </div>
      {submission.message ? <p className="mt-5 text-sm leading-6 text-white/60">{submission.message}</p> : null}
      <div className="mt-5">
        <AudioPlayer
          src={submission.upload_url}
          trackLink={submission.track_link}
          submissionId={submission.id}
        />
      </div>
    </article>
  );
}
