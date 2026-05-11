import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/nav";
import { ArrowIcon } from "@/components/icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-wholara-green/10 bg-wholara-cream/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center" aria-label="Wholara home">
          <Image
            src="/wholara-logo-v2.png"
            alt="Wholara"
            width={160}
            height={67}
            priority
            quality={100}
            sizes="(max-width: 640px) 140px, 160px"
            unoptimized
            className="h-10 w-auto shrink-0 sm:h-11"
          />
        </Link>

        <nav
          className="hidden items-center gap-3 lg:flex xl:gap-5"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 text-xs font-medium tracking-wide text-wholara-green/80 transition-colors hover:text-wholara-terracotta xl:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 rounded-full bg-wholara-green px-4 py-2 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-green-deep sm:px-5"
          >
            Get Started
            <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <nav
        className="flex gap-5 overflow-x-auto border-t border-wholara-green/10 px-5 py-3 lg:hidden"
        aria-label="Mobile primary"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-sm font-medium text-wholara-green/75 hover:text-wholara-terracotta"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
