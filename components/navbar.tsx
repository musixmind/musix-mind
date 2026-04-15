import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
  { href: "/submit", label: "Submit" },
  { href: "/about", label: "About" },
  { href: "/artists", label: "Artists" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Logo />
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-white/65 transition hover:text-electric"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/submit" className="primary-button hidden sm:inline-flex">
          Submit Your Demo
        </Link>
      </nav>
    </header>
  );
}
