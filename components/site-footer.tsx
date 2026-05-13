import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="border-t border-wholara-green/10 bg-wholara-cream">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/wholara-logo-v2.png"
            alt="Wholara"
            width={120}
            height={32}
            className="h-8 w-auto"
            unoptimized
          />
        </div>

        <nav
          className="flex flex-wrap gap-x-7 gap-y-3"
          aria-label="Footer"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-wholara-green/70 transition-colors hover:text-wholara-terracotta"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-wholara-green/55">
          © {new Date().getFullYear()} Wholara. Rooted in real science.
        </p>
      </div>
    </footer>
  );
}
