import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <Logo />
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/55">
            Independent A&R for artists building tomorrow&apos;s sound.
          </p>
        </div>
        <p className="text-sm text-white/45">© 2026 MUSIX MIND. All rights reserved.</p>
      </div>
    </footer>
  );
}
