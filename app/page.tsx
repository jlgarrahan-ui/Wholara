import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type HowItWorks = {
  n: string;
  accent: string;
  title: string;
  body: string;
};

const howItWorks: HowItWorks[] = [
  {
    n: "01",
    accent: "bg-wholara-terracotta",
    title: "Root-cause, not surface-level",
    body:
      "Symptoms are signals. We work backward from how you actually feel to what your body is actually asking for.",
  },
  {
    n: "02",
    accent: "bg-wholara-sage",
    title: "Whole-food nutrition, not restriction",
    body:
      "No crash diets, no food fear, no eliminating entire categories of food for the rest of your life. Your body knows how to heal when you give it what it needs.",
  },
  {
    n: "03",
    accent: "bg-wholara-sage",
    title: "A plan that fits the week you actually have",
    body:
      "Designed around your schedule, your budget, your travel, your family. Not a perfect version of your life that doesn't exist.",
  },
  {
    n: "04",
    accent: "bg-wholara-terracotta",
    title: "Grounded in peer-reviewed research",
    body:
      "Every recommendation comes from a curated knowledge base, not the open internet.",
  },
];

type WayToWork = {
  title: string;
  body: string;
  cta: { label: string; href: string };
  accentTop: string;
};

const waysToWork: WayToWork[] = [
  {
    title: "1:1 Nutrition Coaching",
    body:
      "Fully personalized, practitioner-led guidance. For people with specific symptoms, history, or goals that need a tailored plan.",
    cta: { label: "Learn More", href: "/individual-consulting" },
    accentTop: "border-t-wholara-terracotta",
  },
  {
    title: "The 4-Week Group Reset",
    body:
      "A small-group program designed to activate your body's natural detox pathways, rebalance your hormones, and rebuild your energy — with the accountability of a group and the expertise of a Master Nutrition Therapist.",
    cta: { label: "Learn More", href: "/individual-consulting" },
    accentTop: "border-t-wholara-sage",
  },
  {
    title: "Ask Wholara",
    body:
      "A conversation, not a search box. Get evidence-based answers from a curated nutrition knowledge base — built by a Master Nutrition Therapist, not scraped from the open internet.",
    cta: { label: "Try Ask Wholara", href: "/ask" },
    accentTop: "border-t-wholara-green",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-wholara-cream text-wholara-green">
      <SiteHeader />

      <main className="flex flex-col flex-1">
        <Hero />
        <ProblemSection />
        <HowItWorksSection />
        <WaysToWorkSection />
        <BottomCta />
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

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-5 pt-10 pb-20 text-center sm:px-8 sm:pt-12 sm:pb-24 lg:pt-14 lg:pb-32">
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
          Tired of feeling like a{" "}
          <span className="italic text-wholara-terracotta">stranger</span> in
          your own body?
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#55594d] sm:text-lg">
          I spent most of my life there. Now I help people find their way back
          &mdash; with personalized, science-backed nutrition built around the
          life you actually live.
        </p>

        <p className="mt-3 text-sm font-medium text-[#7D9B76]">
          Julia Garrahan, MNT &middot; Harvard Medical School&ndash;certified
          Wellness &amp; Lifestyle Coach
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/consultation"
            className="cta-shadow inline-flex items-center justify-center gap-2 rounded-full bg-wholara-green px-8 py-4 text-base font-medium text-wholara-cream transition-colors hover:bg-wholara-green-deep"
          >
            Book a Free 20-Min Discovery Call
            <ArrowIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-wholara-green/30 bg-wholara-cream/40 px-8 py-4 text-base font-medium text-wholara-green transition-colors hover:border-wholara-green hover:bg-wholara-green hover:text-wholara-cream"
          >
            Read My Story
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
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
        className="pointer-events-none absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-wholara-terracotta/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-1/4 h-[420px] w-[420px] rounded-full bg-wholara-sage/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-8 py-20">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#C4673A]">
          The Problem
        </p>
        <h2 className="font-display text-3xl font-medium leading-tight text-[#fdfbf7] sm:text-4xl">
          You&rsquo;ve already tried the obvious things.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-[#fdfbf7]">
          You&rsquo;ve cleaned up your diet. You&rsquo;ve tried the supplements.
          Maybe you&rsquo;ve seen the doctors and run the labs and walked out
          with &ldquo;everything looks normal&rdquo; even though nothing feels
          normal.
        </p>
        <p className="mt-5 text-lg leading-relaxed text-[#fdfbf7]">
          The problem isn&rsquo;t you. The problem is that nutrition advice
          today is built for everyone, which means it&rsquo;s built for no one.
          Generic plans. Conflicting research. Trends dressed up as science.
          Whole categories of food turned into villains every two years.
        </p>
        <p className="font-display mt-8 text-2xl font-medium italic leading-snug text-[#C4673A]">
          Wholara is the opposite of that.
        </p>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="relative bg-wholara-cream-deep/50">
      <div className="texture-grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto w-full max-w-5xl px-8 py-20">
        <div className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#C4673A]">
            How Wholara Works
          </p>
          <h2 className="font-display mb-12 text-3xl font-medium leading-tight text-[#2e3328] sm:text-4xl">
            Real science. Real life. Built around you.
          </h2>
        </div>
        <ul className="grid gap-6 lg:grid-cols-2">
          {howItWorks.map(({ n, accent, title, body }) => (
            <li
              key={n}
              className="group rounded-2xl border border-[#e4ddd0] bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${accent} text-sm font-semibold text-wholara-cream`}
                aria-hidden
              >
                {n}
              </span>
              <h3 className="font-display mt-5 text-xl font-medium text-[#2e3328] sm:text-2xl">
                {title}
              </h3>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-[#55594d]">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function WaysToWorkSection() {
  return (
    <section className="relative bg-wholara-cream">
      <div className="relative mx-auto w-full max-w-5xl px-8 py-20">
        <div className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#C4673A]">
            What You Can Do With Wholara
          </p>
          <h2 className="font-display mb-12 text-3xl font-medium leading-tight text-[#2e3328] sm:text-4xl">
            Three ways to work together.
          </h2>
        </div>
        <ul className="grid gap-6 lg:grid-cols-3">
          {waysToWork.map(({ title, body, cta, accentTop }) => (
            <li
              key={title}
              className={`flex flex-col rounded-2xl border border-[#e4ddd0] border-t-2 ${accentTop} bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
            >
              <h3 className="font-display text-xl font-medium text-[#2e3328] sm:text-2xl">
                {title}
              </h3>
              <p className="mt-3 flex-1 text-[0.975rem] leading-relaxed text-[#55594d]">
                {body}
              </p>
              <div className="mt-6">
                <Link
                  href={cta.href}
                  className="inline-flex items-center gap-2 rounded-full bg-wholara-green px-5 py-2.5 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-green-deep"
                >
                  {cta.label}
                  <ArrowIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function BottomCta() {
  return (
    <section className="bg-wholara-green px-8 py-20 text-center text-[#fdfbf7]">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl">
          Not sure where to start?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[#fdfbf7]/80">
          Book a free 20-minute discovery call. We&rsquo;ll talk through
          what&rsquo;s been getting in the way of how you want to feel, and
          figure out together whether Wholara is the right fit. No pressure. No
          pitch.
        </p>
        <div className="mt-10">
          <Link
            href="/consultation"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#fdfbf7] px-8 py-4 text-base font-medium text-[#fdfbf7] transition-colors hover:bg-[#fdfbf7] hover:text-wholara-green"
          >
            Book a Free 20-Min Discovery Call
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
