import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Resources | Wholara",
  description:
    "Free nutrition guides and one-pagers from a Master Nutrition Therapist. Download ebooks on energy, hormones, gut health, and more.",
};

type Ebook = {
  title: string;
  subtitle: string;
  description: string;
  file: string;
  tag: string;
  accent: "sage" | "green";
};

type OnePager = {
  title: string;
  description: string;
  file: string;
  tag: string;
};

const ebooks: Ebook[] = [
  {
    title: "The Energy Cliff",
    subtitle: "Field Guide 02",
    description:
      "Why your energy crashes in the afternoon — and exactly what to do about it. A practical breakdown of blood sugar, cortisol, and the nutrients that keep you running.",
    file: "/resources/Wholara_FieldGuide_02_The_Energy_Cliff.pdf",
    tag: "Energy & Fatigue",
    accent: "sage",
  },
  {
    title: "Your Hormones, Explained",
    subtitle: "Field Guide 03",
    description:
      "A plain-language guide to how your hormones actually work — and how food, sleep, and stress are either helping or hurting them.",
    file: "/resources/Wholara_FieldGuide_03_Your_Hormones_Explained.pdf",
    tag: "Hormones",
    accent: "green",
  },
  {
    title: "The Gut-Brain Connection",
    subtitle: "eBook",
    description:
      "The science behind how your gut shapes your mood, focus, and stress response — and what to eat to support both.",
    file: "/resources/Wholara_GutBrain_eBook.pdf",
    tag: "Gut Health",
    accent: "sage",
  },
];

const onePagers: OnePager[] = [
  {
    title: "Fiber",
    description:
      "Why most people don't get enough, what kinds matter, and how to actually hit your daily target.",
    file: "/resources/wholara-fiber.pdf",
    tag: "Digestion",
  },
  {
    title: "Liver Support",
    description:
      "How your liver handles detox, hormones, and metabolism — and the foods that help it do its job.",
    file: "/resources/wholara-liver-supportOnePager.pdf",
    tag: "Detox & Hormones",
  },
  {
    title: "Magnesium",
    description:
      "The most underrated mineral. How to know if you're low and which form to take for sleep, stress, or muscle recovery.",
    file: "/resources/wholara-magnesium.pdf",
    tag: "Supplements",
  },
  {
    title: "Protein",
    description:
      "How much you actually need, when to eat it, and the best sources for energy, muscle, and hormone health.",
    file: "/resources/wholara-protein.pdf",
    tag: "Nutrition Basics",
  },
];

function DownloadArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M10 4v10" />
      <path d="m5.5 9.5 4.5 4.5 4.5-4.5" />
    </svg>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#C4673A]/10 px-3 py-1 text-xs font-medium text-[#C4673A]">
      {children}
    </span>
  );
}

function DownloadButton({
  href,
  label = "Download Free",
}: {
  href: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-wholara-green px-5 py-2.5 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-green-deep"
    >
      {label}
      <DownloadArrow className="h-4 w-4" />
    </a>
  );
}

function EbookCard({ ebook }: { ebook: Ebook }) {
  const accentClass =
    ebook.accent === "sage" ? "bg-wholara-sage" : "bg-wholara-green";
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#e4ddd0] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className={`h-2 w-full ${accentClass}`} aria-hidden />
      <div className="flex flex-1 flex-col p-8">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-sage">
            {ebook.subtitle}
          </span>
          <Tag>{ebook.tag}</Tag>
        </div>
        <h3 className="font-display mt-4 text-2xl font-light leading-snug text-wholara-green-deep sm:text-[1.75rem]">
          {ebook.title}
        </h3>
        <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-[#55594d]">
          {ebook.description}
        </p>
        <div className="mt-8">
          <DownloadButton href={ebook.file} />
        </div>
      </div>
    </article>
  );
}

function OnePagerCard({ item }: { item: OnePager }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-[#e4ddd0] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <Tag>{item.tag}</Tag>
      <h3 className="font-display mt-4 text-xl font-light leading-snug text-wholara-green-deep">
        {item.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#55594d]">
        {item.description}
      </p>
      <div className="mt-6">
        <DownloadButton href={item.file} />
      </div>
    </article>
  );
}

export default function ResourcesPage() {
  return (
    <div className="flex flex-1 flex-col bg-wholara-cream text-wholara-green">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden bg-wholara-cream">
          <div className="texture-grain absolute inset-0" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-8 py-20 text-center">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
              Free Resources
            </span>
            <h1 className="font-display mt-3 text-4xl font-light leading-[1.05] text-wholara-green sm:text-5xl md:text-6xl">
              Real nutrition science, designed for{" "}
              <span className="italic text-wholara-terracotta">real life</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[#55594d]">
              Download our free guides and one-pagers — written by a Master
              Nutrition Therapist and grounded in clinical research.
            </p>
          </div>
        </section>

        {/* Ebooks */}
        <section className="relative bg-wholara-cream">
          <div className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 sm:pb-20">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
              Field Guides & Ebooks
            </span>
            <h2 className="font-display mt-3 text-3xl font-light leading-tight text-wholara-green sm:text-4xl">
              The long reads.
            </h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {ebooks.map((ebook) => (
                <EbookCard key={ebook.file} ebook={ebook} />
              ))}
            </div>
          </div>
        </section>

        {/* One-pagers */}
        <section className="relative bg-wholara-cream-deep/40">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
              Quick Reference Guides
            </span>
            <h2 className="font-display mt-3 text-3xl font-light leading-tight text-wholara-green sm:text-4xl">
              The cheat sheets.
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {onePagers.map((item) => (
                <OnePagerCard key={item.file} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[#2C4A35] px-8 py-16 text-center text-[#fdfbf7]">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-light leading-tight sm:text-4xl">
              Want personalized guidance instead?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#fdfbf7]/85 sm:text-lg">
              These guides are a starting point. For recommendations built
              around your body, your labs, and your life — let&rsquo;s work
              together.
            </p>
            <Link
              href="/get-started"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-[#fdfbf7] px-7 py-3 text-sm font-medium text-[#fdfbf7] transition-colors hover:bg-[#fdfbf7] hover:text-wholara-green sm:text-base"
            >
              Work With Me
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
