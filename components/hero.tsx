import Link from "next/link";
import { Music2, Radar, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black/30">
      <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_50%_20%,rgba(0,163,255,0.2),transparent_28%),linear-gradient(135deg,rgba(139,92,246,0.14),transparent_35%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/65 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-electric" />
            Future-facing record label
          </div>
          <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl">
            Discover. Submit. Get Signed.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
            Send your strongest unreleased track to MUSIX MIND and move through a clean A&R review process built for serious artists.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/submit" className="primary-button">
              Submit Your Demo
            </Link>
            <Link href="/artists" className="secondary-button">
              Explore Releases
            </Link>
          </div>
        </div>
        <div className="glass-card relative overflow-hidden rounded-lg shadow-glow">
          <img
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80"
            alt="Music studio with neon lighting"
            className="h-[520px] w-full object-cover opacity-80"
          />
          <div className="absolute inset-x-5 bottom-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
              <Radar className="mb-3 h-5 w-5 text-electric" />
              <p className="text-sm font-bold">A&R Queue</p>
              <p className="mt-1 text-xs text-white/50">Curated, tagged, reviewed.</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
              <Music2 className="mb-3 h-5 w-5 text-violetneon" />
              <p className="text-sm font-bold">Demo Playback</p>
              <p className="mt-1 text-xs text-white/50">Links and uploads in one flow.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
