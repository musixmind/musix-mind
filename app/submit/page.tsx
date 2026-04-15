import { DemoForm } from "@/components/demo-form";
import { SectionHeading } from "@/components/section-heading";

export default function SubmitPage() {
  return (
    <section className="relative overflow-hidden bg-black/65 px-5 py-20">
      <div className="absolute inset-0 opacity-50 [background:radial-gradient(circle_at_75%_20%,rgba(0,163,255,0.22),transparent_25%),radial-gradient(circle_at_15%_80%,rgba(139,92,246,0.16),transparent_30%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            eyebrow=""
            title="Send the track that says it all."
            body="Private links are welcome. Uploads help the team listen inside the dashboard. Keep it unreleased, intentional, and ready."
          />
          <div className="mt-8 grid gap-4">
            {["One strongest demo", "Streaming or cloud link", "Optional audio upload", "Clear contact email"].map(
              (item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60">
                  {item}
                </div>
              )
            )}
          </div>
        </div>
        <DemoForm />
      </div>
    </section>
  );
}
