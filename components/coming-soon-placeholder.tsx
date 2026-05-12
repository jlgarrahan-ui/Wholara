import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type ComingSoonPlaceholderProps = {
  eyebrow?: string;
};

export function ComingSoonPlaceholder({ eyebrow }: ComingSoonPlaceholderProps) {
  return (
    <div className="flex min-h-full flex-col bg-wholara-cream text-wholara-green">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
          <Image
            src="/wholara-logo-v2.png"
            alt="Wholara"
            width={220}
            height={92}
            priority
            quality={100}
            unoptimized
            className="h-20 w-auto sm:h-24"
          />

          {eyebrow ? (
            <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-wholara-sage">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="font-display mt-6 text-4xl font-light text-wholara-green sm:text-5xl">
            Coming Soon
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-wholara-sage sm:text-lg">
            We&apos;re working on something good. Check back soon — or reach out
            in the meantime.
          </p>

          <Link
            href="/consultation"
            className="cta-shadow mt-10 inline-flex items-center justify-center rounded-full bg-wholara-terracotta px-7 py-3 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep sm:text-base"
          >
            Get in Touch
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
