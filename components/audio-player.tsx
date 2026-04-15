"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";

type AudioPlayerProps = {
  src?: string;
  trackLink: string;
  submissionId?: string;
};

export function AudioPlayer({ src, trackLink, submissionId }: AudioPlayerProps) {
  const [tracked, setTracked] = useState(false);

  async function trackPlayback() {
    if (!submissionId || tracked) {
      return;
    }

    setTracked(true);
    await fetch(`/api/submissions/${submissionId}/play`, { method: "POST" });
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black/45 p-4">
      {src ? (
        <audio className="w-full accent-electric" controls src={src} onPlay={trackPlayback}>
          <track kind="captions" />
        </audio>
      ) : (
        <a
          href={trackLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold text-electric hover:text-white"
          onClick={trackPlayback}
        >
          <PlayCircle className="h-5 w-5" />
          Open Track Link
        </a>
      )}
    </div>
  );
}
