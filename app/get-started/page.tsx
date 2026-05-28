import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Work With Me | Wholara",
  description:
    "Options built around you and your lifestyle — from 1:1 and group consulting to corporate wellness and free, evidence-based answers with Ask Wholara.",
};

type ServiceCard = {
  badge?: string;
  label: string;
  title: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

const services: ServiceCard[] = [
  {
    badge: "Most Popular",
    label: "1:1 + Group",
    title: "Individual Consulting",
    description:
      "Personalized nutrition support for real life. From the 4-Week Group Reset to private 1:1 coaching, this is where the deep work happens.",
    features: [
      "Personalized to your labs, history, and goals",
      "In-person in Denver or virtual anywhere",
      "From group reset to full 1:1 coaching",
    ],
    cta: { label: "Explore Individual Options", href: "/individual-consulting" },
    featured: true,
  },
  {
    label: "Teams + Organizations",
    title: "Corporate Wellness",
    description:
      "Bring real nutrition science to your team. Lunch & Learns, ongoing newsletters, and full wellness programs that actually move the needle on performance.",
    features: [
      "Lunch & Learns for any team size",
      "Monthly wellness newsletter programs",
      "Tiered packages from single sessions to full programs",
    ],
    cta: { label: "Explore Corporate Options", href: "/corporate-wellness" },
  },
  {
    label: "Free · Always On",
    title: "Ask Wholara",
    description:
      "Get evidence-based nutrition answers any time, powered by 90+ clinical course materials from the Nutrition Therapy Institute.",
    features: [
      "Ask anything about nutrition, symptoms, or food",
      "Backed by real clinical science — not generic advice",
      "Free to use, no account required",
    ],
    cta: { label: "Try Ask Wholara", href: "/ask" },
  },
];

export default function GetStartedPage() {
  return (
    <div className="flex flex-1 flex-col bg-[#F5F0E8] text-[#2C4A35]">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* 1. HERO */}
        <section className="mx-auto max-w-3xl px-8 py-20 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-[#C4673A]">
            Work With Me
          </p>
          <h1
            className="font-display mt-5 font-medium leading-tight text-[#2e3328]"
            style={{ fontSize: "clamp(2.4rem, 5vw, 3.2rem)" }}
          >
            Options that are built around you and your lifestyle
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[#55594d]">
            Whether you&apos;re just getting started or ready to go deep, every
            path here is rooted in real clinical nutrition science —
            personalized to you, and designed to fit your actual life.
          </p>
        </section>

        {/* 2. SERVICE CARDS */}
        <section className="mx-auto w-full max-w-5xl px-8 pb-24">
          <div className="grid gap-6 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className={
                  "group flex flex-col rounded-2xl border border-[#e4ddd0] bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-10 " +
                  (service.featured ? "border-t-2 border-t-[#C4673A]" : "")
                }
              >
                {service.badge ? (
                  <span className="mb-5 inline-flex w-fit items-center rounded-full bg-[#C4673A]/12 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#C4673A]">
                    {service.badge}
                  </span>
                ) : null}

                <p className="text-xs font-medium uppercase tracking-widest text-[#7D9B76]">
                  {service.label}
                </p>
                <h2 className="font-display mt-2 text-2xl font-medium text-[#2e3328]">
                  {service.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#55594d]">
                  {service.description}
                </p>

                <ul className="mt-6 flex flex-col gap-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-relaxed text-[#2e3328]"
                    >
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#7D9B76]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <Link
                    href={service.cta.href}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#2C4A35] px-6 py-3.5 text-sm font-medium tracking-wide text-[#fdfbf7] transition-colors hover:bg-[#2e3328]"
                  >
                    {service.cta.label}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. BOTTOM STRIP */}
        <section className="w-full bg-[#2C4A35] px-8 py-16 text-center text-[#fdfbf7]">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-medium leading-snug sm:text-4xl">
              Not sure which is right for you?
            </h2>
            <p className="mt-4 text-lg text-[#fdfbf7]/80">
              Send a message and we&apos;ll figure it out together.
            </p>
            <Link
              href="/consultation"
              className="mt-8 inline-block rounded-full border border-[#fdfbf7]/50 px-8 py-3.5 text-sm font-medium tracking-wide text-[#fdfbf7] transition-colors hover:bg-[#fdfbf7]/10"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 10.5 8 14.5 16 5.5" />
    </svg>
  );
}
