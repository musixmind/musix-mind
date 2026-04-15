import { SectionHeading } from "@/components/section-heading";

const values = [
  "Taste before noise",
  "Useful feedback loops",
  "Artist-owned momentum",
  "Release strategy with patience"
];

export default function AboutPage() {
  return (
    <section className="bg-black/70 px-5 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow=""
            title="MUSIX MIND is a South Indian future facing record label."
            body="We search for artists with a point of view, then pair creative instinct with a structured pipeline that keeps every submission visible, searchable, and actionable."
          />
        </div>
        <div className="glass-card overflow-hidden rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1400&q=80"
            alt="Live music stage with dramatic lights"
            className="h-[520px] w-full object-cover opacity-80"
          />
        </div>
      </div>
      <div className="mx-auto mt-16 grid max-w-7xl gap-4 md:grid-cols-4">
        {values.map((value) => (
          <div key={value} className="glass-card rounded-lg p-5">
            <p className="text-lg font-black">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
