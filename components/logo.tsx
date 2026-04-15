import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="MUSIX MIND home">
      <img
        src="/musixmind-logo-trimmed.png"
        alt="MUSIX MIND"
        width={144}
        height={48}
        style={{ width: "144px", height: "48px" }}
        className="h-12 w-36 object-contain object-left"
      />
    </Link>
  );
}
