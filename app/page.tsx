import Link from "next/link";
import { ArtistCard } from "@/components/artist-card";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { featuredArtists } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="bg-black/75 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow=""
            title="Signals worth following."
            body="A focused roster of artists shaping high-emotion, high-detail records."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredArtists.map((artist) => (
              <ArtistCard key={artist.name} artist={artist} />
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-white/10 bg-white/[0.03] px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-center">
          <SectionHeading
            eyebrow=""
            title="A label built like a product team."
            body="MUSIX MIND combines taste-led A&R, structured review workflows, and artist-first feedback loops."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {["Submit", "Review", "Sign"].map((step, index) => (
              <div key={step} className="glass-card rounded-lg p-5">
                <p className="text-sm font-black text-electric">0{index + 1}</p>
                <h3 className="mt-4 text-2xl font-black">{step}</h3>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  {index === 0 && "Artists upload or link demos in a clean submission flow."}
                  {index === 1 && "A&R reviews tracks with status, playback, and notes in one view."}
                  {index === 2 && "Shortlisted talent moves toward release strategy and deal terms."}
                </p>
              </div>
            ))}
          </div>
          <Link href="/about" className="secondary-button w-fit">
            Read About MUSIX MIND
          </Link>
        </div>
      </section>
    </>
  );
}
