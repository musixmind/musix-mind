"use client";

import { useRef, useState } from "react";
import { AudioLines, CheckCircle2, LoaderCircle, UploadCloud } from "lucide-react";
import { genres } from "@/lib/content";

type FormState = "idle" | "submitting" | "success" | "error";

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function DemoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile({
      name: file.name,
      size: formatFileSize(file.size)
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/submit", {
      method: "POST",
      body: formData
    });

    const payload = await response.json();

    if (!response.ok) {
      setState("error");
      setMessage(payload.error ?? "Something went wrong. Try again.");
      return;
    }

    formRef.current?.reset();
    setSelectedFile(null);
    setState("success");
    setMessage(
      payload.notificationError
        ? "Demo saved successfully. Confirmation email is delayed right now, but our A&R team still received your submission."
        : "Demo received. A confirmation email has been sent and our A&R team will review it soon."
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="glass-card rounded-lg p-5 shadow-glow md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="label">Artist Name</span>
          <input className="field" name="artist_name" required placeholder="Your artist name" />
        </label>
        <label className="grid gap-2">
          <span className="label">Email</span>
          <input className="field" name="email" type="email" required placeholder="artist@email.com" />
        </label>
        <label className="grid gap-2">
          <span className="label">Track Title</span>
          <input className="field" name="track_title" required placeholder="Track title" />
        </label>
        <label className="grid gap-2">
          <span className="label">Genre</span>
          <select className="field" name="genre" required defaultValue="">
            <option value="" disabled className="bg-black">
              Select genre
            </option>
            {genres.map((genre) => (
              <option key={genre} value={genre} className="bg-black">
                {genre}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="label">Language</span>
          <input className="field" name="language" required placeholder="English, Tamil, Hindi..." />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="label">Track Link</span>
          <input
            className="field"
            name="track_link"
            type="url"
            required
            placeholder="SoundCloud, Dropbox, Google Drive, private stream"
          />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="label">Message</span>
          <textarea className="field min-h-36 resize-y" name="message" placeholder="Tell us the story behind the track." />
        </label>
        <label className="md:col-span-2">
          <span className="label">Upload Option</span>
          <span className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-electric/40 bg-electric/[0.06] px-6 py-10 text-center transition hover:border-white/50">
            <UploadCloud className="h-9 w-9 text-electric" />
            <span className="mt-4 text-sm font-bold text-white">Drag and drop audio, or browse</span>
            <span className="mt-1 text-xs text-white/45">MP3, WAV, AIFF. Max 25MB.</span>
            <input
              className="sr-only"
              name="audio"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
            />
          </span>
          {selectedFile ? (
            <div className="mt-3 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-emerald-200">{selectedFile.name}</p>
                  <p className="mt-1 text-xs text-emerald-100/70">{selectedFile.size} selected and ready to upload</p>
                </div>
              </div>
            </div>
          ) : null}
        </label>
      </div>
      {state === "submitting" ? (
        <div className="mt-6 rounded-lg border border-electric/20 bg-electric/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <LoaderCircle className="h-4 w-4 animate-spin text-electric" />
            <div>
              <p className="text-sm font-bold text-white">
                {selectedFile ? "Uploading your audio and sending the demo..." : "Sending your demo..."}
              </p>
              <p className="mt-1 text-xs text-white/55">
                Please wait a moment and keep this tab open.
              </p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-electric" />
          </div>
        </div>
      ) : null}
      <button className="primary-button mt-6 w-full" disabled={state === "submitting"}>
        {state === "submitting" ? "Submitting..." : "Submit Demo"}
      </button>
      {message ? (
        <p className={`mt-4 text-sm ${state === "error" ? "text-red-300" : "text-emerald-300"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
