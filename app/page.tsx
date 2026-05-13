import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const features = [
  {
    title: "Real Science",
    body:
      "Every answer is grounded in a Master Nutrition Therapist and Harvard-trained Wellness Coach's evidence-based knowledge base, not the whole internet.",
    icon: MicroscopeIcon,
    accent: "bg-wholara-green text-wholara-cream",
  },
  {
    title: "Personalized to You",
    body:
      "No generic plans. Wholara learns what you need and builds around your real life.",
    icon: FingerprintIcon,
    accent: "bg-wholara-terracotta text-wholara-cream",
  },
  {
    title: "Meet You Where You Are",
    body:
      "Busy, overwhelmed, or just getting started — Wholara fits into your life, not the other way around.",
    icon: HeartIcon,
    accent: "bg-wholara-sage text-wholara-cream",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-wholara-cream text-wholara-green">
      <SiteHeader />

      <main className="flex flex-col flex-1">
        <Hero />
        <FeatureGrid />
        <PhilosophyStrip />
      </main>

      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="texture-paper relative overflow-hidden">
      {/* organic blob shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 h-[640px] w-[640px] rounded-full bg-wholara-sage/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-32 h-[560px] w-[560px] rounded-full bg-wholara-terracotta/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-wholara-cream-deep/40 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-5 pt-10 pb-20 text-center sm:px-8 sm:pt-12 sm:pb-24 lg:pt-14 lg:pb-36">
        <Image
          src="/wholara-logo-v2.png"
          alt="Wholara"
          width={800}
          height={336}
          priority
          quality={100}
          sizes="(max-width: 640px) 19rem, (max-width: 768px) 22rem, (max-width: 1024px) 26rem, 30rem"
          unoptimized
          className="h-28 w-auto max-w-[min(100%,30rem)] shrink-0 sm:h-36 md:h-40 lg:h-44"
        />

        <h1 className="font-display mt-10 text-4xl font-light leading-[1.05] text-wholara-green sm:text-5xl md:text-6xl lg:text-7xl">
          You&rsquo;re one of a kind.
          <span className="mt-1.5 block italic text-wholara-terracotta sm:mt-2">
            Your nutrition should be too.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-wholara-green/80 sm:text-lg">
          Wholara was built by a Master Nutrition Therapist and Certified
          Wellness and Lifestyle Coach from Harvard Medical School who believes
          your health shouldn&rsquo;t be a luxury. Every recommendation is
          rooted in real science — personalized to you, designed
          around your life, and accessible no matter where you&rsquo;re
          starting from.
        </p>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-[0.18em] text-wholara-green/55">
          <span>Master Nutrition Therapist</span>
          <span className="text-wholara-terracotta">·</span>
          <span>Certified Wellness &amp; Lifestyle Coach</span>
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/get-started"
            className="cta-shadow inline-flex items-center justify-center gap-2 rounded-full bg-wholara-terracotta px-8 py-4 text-base font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep"
          >
            Get Started
            <ArrowIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/individual-consulting"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-wholara-green/30 bg-wholara-cream/40 px-8 py-4 text-base font-medium text-wholara-green transition-colors hover:border-wholara-green hover:bg-wholara-green hover:text-wholara-cream"
          >
            Individual Consulting
          </Link>
          <Link
            href="/corporate-wellness"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-wholara-sage/60 bg-wholara-cream/40 px-8 py-4 text-base font-medium text-wholara-green transition-colors hover:border-wholara-sage hover:bg-wholara-sage hover:text-wholara-cream"
          >
            Corporate Wellness
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="relative bg-wholara-cream-deep">
      <div className="texture-grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto w-full max-w-7xl px-5 pt-10 pb-20 sm:px-8 sm:pt-12 sm:pb-24 lg:pt-14 lg:pb-28">
        <div className="w-full">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
            The Wholara difference
          </span>
          <h2 className="font-display mt-3 whitespace-nowrap text-[clamp(1rem,0.35rem+3.4vw,2.75rem)] leading-tight tracking-tight text-wholara-green">
            Nutrition that actually{" "}
            <span className="italic">knows you.</span>
          </h2>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map(({ title, body, icon: Icon, accent }) => (
            <li
              key={title}
              className="group relative flex flex-col rounded-3xl border border-wholara-green/10 bg-wholara-cream p-7 transition-transform duration-300 hover:-translate-y-1 hover:border-wholara-green/25 sm:p-8"
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}
                aria-hidden
              >
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="font-display mt-6 text-2xl text-wholara-green">
                {title}
              </h3>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-wholara-green/75">
                {body}
              </p>
              <span
                aria-hidden
                className="mt-6 inline-flex w-fit items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                Learn more <ArrowIcon className="h-3 w-3" />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PhilosophyStrip() {
  return (
    <section className="relative overflow-hidden bg-wholara-green text-wholara-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(245,240,232,0.05) 0 1px, transparent 1px 18px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-wholara-terracotta/30 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-wholara-sage-soft">
            A note from Wholara
          </span>
          <p className="font-display mt-5 text-2xl leading-snug text-wholara-cream sm:text-3xl lg:text-[2.4rem]">
            &ldquo;Your health shouldn&rsquo;t be a luxury, and it
            shouldn&rsquo;t be a guessing game. Wholara brings nutrition into
            the everyday — so support is something you{" "}
            <span className="italic text-wholara-terracotta">live with</span>,
            not something you have to chase.&rdquo;
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-wholara-cream/15 bg-wholara-cream/5 p-7 backdrop-blur-sm sm:p-8">
            <h3 className="font-display text-2xl text-wholara-cream sm:text-3xl">
              Ready when you are.
            </h3>
            <p className="mt-3 text-wholara-cream/75">
              Start with a few questions about what you eat, how you live, and
              what you&rsquo;re working toward. Wholara takes it from there.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/get-started"
                className="cta-shadow inline-flex items-center justify-center gap-2 rounded-full bg-wholara-terracotta px-6 py-3 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep"
              >
                Get Started
                <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/individual-consulting"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-wholara-cream/30 px-6 py-3 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-cream hover:text-wholara-green"
              >
                Individual Consulting
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- inline icons (no external deps) ---------- */

type IconProps = { className?: string };

function MicroscopeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 21h12" />
      <path d="M9 21v-3a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v3" />
      <path d="M12 15a5 5 0 0 0 5-5" />
      <path d="M9 4l5 1.5-1.2 4-5-1.5z" />
      <path d="M13 9.5l2.5.8" />
      <path d="M8.8 5.5L7 6" />
    </svg>
  );
}

function FingerprintIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6.5 8a6 6 0 0 1 11 3" />
      <path d="M5 12a7 7 0 0 1 .5-2.5" />
      <path d="M8 19a10 10 0 0 1-1.5-5 5.5 5.5 0 0 1 11 0c0 .8-.1 1.6-.3 2.4" />
      <path d="M11 21a13 13 0 0 1-1.5-6 3 3 0 0 1 6 0c0 1.2-.2 2.4-.5 3.5" />
      <path d="M12 14v2" />
    </svg>
  );
}

function HeartIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
    </svg>
  );
}
