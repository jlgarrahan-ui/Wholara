"use client";

import { useRef, useState } from "react";
import Link from "next/link";

type ServiceCard = {
  key: string;
  pill: string;
  badge?: string;
  label: string;
  title: string;
  icon: string;
  accent: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

const services: ServiceCard[] = [
  {
    key: "individuals",
    pill: "For Individuals",
    badge: "Most Popular",
    label: "1:1 + Group",
    title: "Individual Consulting",
    icon: "🌿",
    accent: "#C4673A",
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
    key: "teams",
    pill: "For Teams",
    label: "Teams + Organizations",
    title: "Corporate Wellness",
    icon: "🏢",
    accent: "#2C4A35",
    description:
      "Bring real nutrition science to your team. Lunch & Learns, ongoing newsletters, and full wellness programs that actually move the needle on performance.",
    features: [
      "Lunch & Learns for any team size",
      "Monthly wellness newsletter programs",
      "Tiered packages from single sessions to full programs",
    ],
    cta: { label: "Inquire Now", href: "/consultation" },
  },
  {
    key: "ask",
    pill: "Ask Anything",
    label: "Free · Always On",
    title: "Ask Wholara",
    icon: "💬",
    accent: "#7D9B76",
    description:
      "Get evidence-based nutrition answers any time, backed by real clinical science and 90+ hours of advanced nutrition coursework.",
    features: [
      "Ask anything about nutrition, symptoms, or food",
      "Backed by real clinical science and 90+ hours of advanced nutrition coursework",
      "Free to use, no account required",
    ],
    cta: { label: "Try Ask Wholara", href: "/ask" },
  },
];

export function ServiceCards() {
  const [active, setActive] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  function handleSelect(index: number) {
    setActive(index);
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-8 pb-24">
      {/* Pill tab switcher */}
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {services.map((service, index) => (
          <button
            key={service.key}
            type="button"
            onClick={() => handleSelect(index)}
            aria-pressed={active === index}
            className={
              "rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-colors " +
              (active === index
                ? "bg-[#C4673A] text-white shadow-sm"
                : "border border-[#e4ddd0] bg-white text-[#55594d] hover:text-[#C4673A]")
            }
          >
            {service.pill}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-7 lg:grid-cols-3">
        {services.map((service, index) => (
          <article
            key={service.key}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={
              "group relative flex flex-col overflow-hidden rounded-2xl border border-[#e4ddd0] bg-white p-10 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-12 " +
              (service.featured ? "shadow-md lg:-mt-4" : "shadow-sm") +
              (active === index
                ? " ring-2 ring-[#C4673A] ring-offset-2 ring-offset-[#F5F0E8]"
                : "")
            }
          >
            {/* Colored top accent bar */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1.5"
              style={{
                backgroundImage: `linear-gradient(90deg, ${service.accent}, ${service.accent}99)`,
              }}
            />

            {service.badge ? (
              <span className="mb-5 inline-flex w-fit items-center rounded-full bg-[#C4673A]/12 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#C4673A]">
                {service.badge}
              </span>
            ) : null}

            {/* Icon in a colored circle */}
            <div
              className="mb-6 flex h-14 w-14 items-center justify-center rounded-full text-2xl"
              style={{ backgroundColor: `${service.accent}1a` }}
            >
              <span aria-hidden>{service.icon}</span>
            </div>

            <p
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: service.accent }}
            >
              {service.label}
            </p>
            <h2 className="font-display mt-2 text-2xl font-medium text-[#2e3328]">
              {service.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#55594d]">
              {service.description}
            </p>

            <ul className="mt-6 flex flex-col gap-3.5">
              {service.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[#2e3328]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7D9B76]/15 text-[#7D9B76]">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-9">
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
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 10.5 8 14.5 16 5.5" />
    </svg>
  );
}
