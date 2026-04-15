import { Mail, MapPin, Send } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

export default function ContactPage() {
  return (
    <section className="bg-black/70 px-5 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeading
          eyebrow=""
          title="Reach the team."
          body="For partnerships, press, sync, and release conversations."
        />
        <div className="glass-card rounded-lg p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-black/40 p-5">
              <Mail className="h-5 w-5 text-electric" />
              <p className="mt-4 text-sm font-black">Email</p>
              <p className="mt-2 text-sm text-white/55">hello@musixmind.com</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/40 p-5">
              <MapPin className="h-5 w-5 text-electric" />
              <p className="mt-4 text-sm font-black">Base</p>
              <p className="mt-2 text-sm text-white/55">Global, remote-first</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/40 p-5">
              <Send className="h-5 w-5 text-electric" />
              <p className="mt-4 text-sm font-black">Demos</p>
              <p className="mt-2 text-sm text-white/55">Use the submission portal</p>
            </div>
          </div>
          <form className="mt-6 grid gap-4">
            <input className="field" placeholder="Name" />
            <input className="field" type="email" placeholder="Email" />
            <textarea className="field min-h-36" placeholder="Message" />
            <button className="primary-button" type="button">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
