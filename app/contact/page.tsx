import { Mail, MapPin, Send } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
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
              <p className="mt-2 text-sm text-white/55">musixmind1@gmail.com</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/40 p-5">
              <MapPin className="h-5 w-5 text-electric" />
              <p className="mt-4 text-sm font-black">Location</p>
              <p className="mt-2 text-sm text-white/55">Coimbatore, India</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/40 p-5">
              <Send className="h-5 w-5 text-electric" />
              <p className="mt-4 text-sm font-black">Demos</p>
              <p className="mt-2 text-sm text-white/55">Use the submission portal</p>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
