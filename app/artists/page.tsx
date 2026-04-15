import { ArtistCard } from "@/components/artist-card";
import { SectionHeading } from "@/components/section-heading";
import { featuredArtists, releases } from "@/lib/content";

export default function ArtistsPage() {
  return (
    <section className="bg-black/70 px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow=""
          title="Roster, releases, and next-wave signals."
          body="A living catalog for artists and projects moving through the MUSIX MIND ecosystem."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featuredArtists.map((artist) => (
            <ArtistCard key={artist.name} artist={artist} />
          ))}
        </div>
        <div className="mt-16">
          <h2 className="text-3xl font-black">Releases</h2>
          <div className="mt-6 grid gap-4">
            {releases.map((release) => (
              <article
                key={release.title}
                className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-5 md:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <h3 className="text-xl font-black">{release.title}</h3>
                  <p className="mt-1 text-sm text-white/55">{release.artist}</p>
                </div>
                <p className="text-sm font-bold text-electric">{release.genre}</p>
                <p className="text-sm text-white/45">{release.year}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
