"use client";

import { useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, UploadCloud } from "lucide-react";
import { genres } from "@/lib/content";

type FormState = "idle" | "submitting" | "success" | "error";

type SelectedFile = {
  file: File;
  name: string;
  size: string;
};

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function makeStorageFileName(fileName: string) {
  const extension = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")) : ".bin";
  const base = fileName
    .replace(extension, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return `${base || "demo-file"}-${crypto.randomUUID()}${extension.toLowerCase()}`;
}

async function uploadFileToSupabaseStorage(
  file: File,
  onProgress: (progress: number) => void
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET;

  if (!supabaseUrl || !supabaseAnonKey || !bucket) {
    throw new Error(
      "Storage is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET."
    );
  }

  const objectPath = `demo-uploads/${makeStorageFileName(file.name)}`;

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`);
    xhr.setRequestHeader("apikey", supabaseAnonKey);
    xhr.setRequestHeader("Authorization", `Bearer ${supabaseAnonKey}`);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const percent = Math.min(95, Math.round((event.loaded / event.total) * 95));
      onProgress(percent);
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed while sending the file to storage."));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve(`${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`);
        return;
      }

      try {
        const payload = JSON.parse(xhr.responseText) as { message?: string; error?: string };
        reject(new Error(payload.message ?? payload.error ?? "Storage upload failed."));
      } catch {
        reject(new Error("Storage upload failed."));
      }
    };

    xhr.send(file);
  });
}

export function DemoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile({
      file,
      name: file.name,
      size: formatFileSize(file.size)
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    setProgress(0);
    setProgressLabel(selectedFile ? "Preparing your upload..." : "Sending your demo...");

    const formData = new FormData(event.currentTarget);
    const payload = {
      artist_name: String(formData.get("artist_name") ?? ""),
      email: String(formData.get("email") ?? ""),
      track_title: String(formData.get("track_title") ?? ""),
      genre: String(formData.get("genre") ?? ""),
      language: String(formData.get("language") ?? ""),
      track_link: String(formData.get("track_link") ?? ""),
      message: String(formData.get("message") ?? ""),
      upload_url: undefined as string | undefined
    };

    try {
      if (selectedFile) {
        setProgressLabel("Uploading your file to secure storage...");
        payload.upload_url = await uploadFileToSupabaseStorage(selectedFile.file, setProgress);
      }

      setProgress((current) => Math.max(current, 96));
      setProgressLabel("Saving your submission and sending emails...");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Upload failed. Please try again.");
      setProgress(0);
      setProgressLabel("");
      return;
    }

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const responsePayload = await response.json();

    if (!response.ok) {
      setState("error");
      setMessage(responsePayload.error ?? "Something went wrong. Try again.");
      setProgress(0);
      setProgressLabel("");
      return;
    }

    formRef.current?.reset();
    setSelectedFile(null);
    setState("success");
    setProgress(100);
    setProgressLabel("Done");
    setMessage(
      responsePayload.notificationError
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
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <LoaderCircle className="mt-0.5 h-4 w-4 animate-spin text-electric" />
              <div>
                <p className="text-sm font-bold text-white">{progressLabel}</p>
                <p className="mt-1 text-xs text-white/55">
                  {selectedFile ? "Fast direct upload is in progress. Keep this tab open." : "Please wait a moment."}
                </p>
              </div>
            </div>
            <span className="rounded-full border border-electric/20 bg-black/25 px-3 py-1 text-xs font-bold text-electric">
              {progress}%
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-electric transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.14em] text-white/40">
            <span>Upload</span>
            <span>Store</span>
            <span>Notify</span>
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
