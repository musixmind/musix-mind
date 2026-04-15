import type { Artist } from "@/lib/types";

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <article className="glass-card overflow-hidden rounded-lg">
      <img src={artist.image} alt={`${artist.name} artist visual`} className="h-72 w-full object-cover" />
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">{artist.genre}</p>
        <h3 className="mt-2 text-2xl font-black text-white">{artist.name}</h3>
        <p className="mt-3 text-sm leading-6 text-white/58">{artist.highlight}</p>
      </div>
    </article>
  );
}
