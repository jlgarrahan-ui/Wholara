import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Individual Consulting | Wholara",
  description:
    "Wholara's Individual Consulting programs — the 4-Week Group Reset and 1:1 Nutrition Coaching with a Master Nutrition Therapist. Whole food nutrition, evidence-based protocols, and personalized support.",
};

type IconProps = { className?: string };

const groupIncludes: string[] = [
  "Weekly live group sessions with a Master Nutrition Therapist",
  "Daily email check-ins and micro-lessons",
  "Weekly recipes designed around the nutrition protocol",
  "Direct access to your nutritionist throughout the 4 weeks",
  "The Wholara app for personalized support between sessions",
  "A community of people on the same journey",
];

const groupExpectations: string[] = [
  "Weight loss without starvation or restriction",
  "Reduced bloating and improved digestion",
  "Deeper, more restorative sleep",
  "Mental clarity and sustained energy",
  "More balanced hormones and steadier mood",
  "Long-term health tools you will use for the rest of your life",
];

const oneOnOneIncludes: string[] = [
  "Initial 60-minute deep-dive consultation",
  "Personalized nutrition and lifestyle protocol",
  "Supplement guidance based on your specific needs",
  "Follow-up sessions to adjust and refine your plan",
  "Direct access to Ask Wholara between sessions",
  "Ongoing support as your body responds and evolves",
];

type ComparisonRow = {
  label: string;
  group: string;
  oneOnOne: string;
};

const comparisonRows: ComparisonRow[] = [
  {
    label: "Best for",
    group:
      "People who thrive with community, accountability, and a defined start and finish.",
    oneOnOne:
      "People with specific symptoms, history, or goals that need a fully tailored plan.",
  },
  {
    label: "Format",
    group:
      "4 weeks of live small-group sessions plus daily support between sessions.",
    oneOnOne:
      "Private sessions on your schedule, with follow-ups as your body evolves.",
  },
  {
    label: "Practitioner access",
    group:
      "Weekly group sessions and direct nutritionist access throughout the program.",
    oneOnOne:
      "One-on-one time with a Master Nutrition Therapist focused entirely on you.",
  },
  {
    label: "Ask Wholara access",
    group: "Included for the duration of the program.",
    oneOnOne: "Included between sessions and ongoing.",
  },
  {
    label: "Investment",
    group: "A defined 4-week investment in your health.",
    oneOnOne: "Flexible — pay per session or in supported packages.",
  },
];

export default function IndividualConsultingPage() {
  return (
    <div className="flex flex-col flex-1 bg-wholara-cream text-wholara-green">
      <SiteHeader />

      <main className="flex flex-col flex-1">
        <Hero />
        <ScienceBanner />
        <GroupReset />
        <OneOnOneCoaching />
        <Comparison />
        <BottomCta />
      </main>

      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-wholara-cream">
      <div className="texture-grain absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-wholara-terracotta/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-[420px] w-[420px] rounded-full bg-wholara-sage/20 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-12 text-center sm:px-8 sm:py-16 lg:py-20">
        <h1 className="font-display text-4xl font-light leading-[1.05] text-wholara-green sm:text-5xl md:text-6xl lg:text-7xl">
          Your health is personal.{" "}
          <span className="italic text-wholara-terracotta">
            Your support should be too.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-wholara-green/80 sm:text-lg">
          Whether you&rsquo;re looking for one-on-one guidance or the power of a
          small group, Wholara&rsquo;s Individual Consulting programs meet you
          exactly where you are &mdash; and take you somewhere better.
        </p>
      </div>
    </section>
  );
}

function ScienceBanner() {
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

      <div className="relative mx-auto w-full max-w-4xl px-5 py-10 text-center sm:px-8 sm:py-12 lg:py-14">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-cream/70">
          The science of small groups
        </span>

        <blockquote className="font-display mt-6 text-2xl italic leading-snug text-wholara-cream sm:text-3xl md:text-4xl lg:text-[2.6rem]">
          &ldquo;Medical research proves that when a person is making
          nutritional changes, the support structure of a small group yields
          greater weight loss and permanent change than any other single
          component of change.&rdquo;
        </blockquote>

        <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-wholara-cream/85 sm:text-lg">
          This isn&rsquo;t about willpower. It&rsquo;s about having the right
          people around you while you change. That&rsquo;s exactly what the
          Wholara 4-Week Group Reset was built for.
        </p>
      </div>
    </section>
  );
}

function GroupReset() {
  return (
    <section className="relative bg-wholara-cream">
      <div className="texture-grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
        <div className="relative overflow-hidden rounded-3xl border border-wholara-green/15 bg-wholara-cream-deep/40 shadow-[0_30px_80px_-40px_rgba(44,74,53,0.35)]">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1.5 bg-wholara-terracotta"
          />

          <span className="absolute right-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-wholara-terracotta px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-wholara-cream sm:right-7 sm:top-7">
            <span className="h-1.5 w-1.5 rounded-full bg-wholara-cream" />
            Most Popular
          </span>

          <div className="px-6 pb-10 pl-7 pt-12 sm:px-10 sm:pb-14 sm:pl-12 sm:pt-14 lg:px-14 lg:pl-16">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
              4-Week Group Reset
            </span>
            <h2 className="font-display mt-3 text-3xl leading-tight text-wholara-green sm:text-4xl lg:text-5xl">
              The 4-Week Group Reset
            </h2>
            <p className="mt-3 max-w-3xl text-lg italic text-wholara-green/75 sm:text-xl">
              Fuel your body. Clear the fog. Feel like yourself again.
            </p>

            <p className="mt-8 max-w-3xl text-base leading-relaxed text-wholara-green/80 sm:text-lg">
              Your body already knows how to heal &mdash; it just needs the
              right conditions. The Wholara 4-Week Group Reset is a small-group
              program designed to activate your body&rsquo;s natural detox
              pathways, rebalance your hormones, and give you the energy,
              clarity, and confidence that comes from truly nourishing yourself.
              This isn&rsquo;t a crash diet. It&rsquo;s a nutrition protocol
              delivered with the intimacy of a small group and the
              expertise of a Master Nutrition Therapist &mdash; so the changes
              you make actually stick.
            </p>

            <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
              <ChecklistColumn
                eyebrow="What's Included"
                items={groupIncludes}
                tone="terracotta"
              />
              <ChecklistColumn
                eyebrow="What You Can Expect"
                items={groupExpectations}
                tone="sage"
              />
            </div>

            <div className="mt-12 rounded-2xl border border-wholara-sage/40 bg-wholara-sage/20 p-6 sm:p-7">
              <p className="text-base leading-relaxed text-wholara-green/85 sm:text-lg">
                The program is built around supporting your body&rsquo;s four
                key detox pathways &mdash; liver, gut, lymphatic, and cellular
                &mdash; through targeted whole food nutrition, strategic
                supplementation guidance, and lifestyle protocols grounded in
                research.
              </p>
            </div>

            <div className="mt-12 flex flex-col items-start gap-3">
              <Link
                href="/consultation?interest=group-reset-waitlist"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-wholara-terracotta bg-transparent px-8 py-3.5 text-base font-medium text-wholara-terracotta transition-colors hover:bg-wholara-terracotta/10"
              >
                Join the Waitlist
                <ArrowIcon className="h-4 w-4" />
              </Link>
              <p className="text-sm italic text-wholara-green/65">
                Groups are kept intentionally small to ensure personalized
                attention. Spots are limited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChecklistColumn({
  eyebrow,
  items,
  tone,
}: {
  eyebrow: string;
  items: string[];
  tone: "terracotta" | "sage";
}) {
  const dot =
    tone === "terracotta" ? "bg-wholara-terracotta" : "bg-wholara-sage";
  const checkBg =
    tone === "terracotta"
      ? "bg-wholara-terracotta text-wholara-cream"
      : "bg-wholara-sage text-wholara-cream";
  const eyebrowColor =
    tone === "terracotta" ? "text-wholara-terracotta" : "text-wholara-sage";

  return (
    <div>
      <span
        className={
          "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] " +
          eyebrowColor
        }
      >
        <span className={"h-1.5 w-1.5 rounded-full " + dot} />
        {eyebrow}
      </span>
      <ul className="mt-5 space-y-3.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              className={
                "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full " +
                checkBg
              }
              aria-hidden
            >
              <CheckIcon className="h-3 w-3" />
            </span>
            <span className="text-[0.975rem] leading-relaxed text-wholara-green/85">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OneOnOneCoaching() {
  return (
    <section className="relative bg-wholara-sage text-wholara-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(44,74,53,0.06) 0 1px, transparent 1px 16px)",
        }}
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-cream/80">
              1:1 Coaching
            </span>
            <h2 className="font-display mt-4 text-3xl leading-tight text-wholara-cream sm:text-4xl lg:text-5xl">
              One-on-One Nutrition Coaching
            </h2>
            <p className="mt-4 text-lg italic text-wholara-cream/85 sm:text-xl">
              For those who want fully personalized, practitioner-led guidance.
            </p>

            <p className="mt-8 text-base leading-relaxed text-wholara-cream/90 sm:text-lg">
              Sometimes you need someone in your corner who knows your full
              picture &mdash; your history, your goals, your lifestyle, and the
              specific things standing between you and feeling your best.
              That&rsquo;s what 1:1 coaching with a Master Nutrition Therapist
              delivers. Every session is built around you. We dig into your
              symptoms, your labs if you have them, your diet, your stress,
              your sleep &mdash; and we build a protocol that actually fits
              your life. No generic plans. No guesswork.
            </p>
          </div>

          <div className="rounded-3xl border border-wholara-cream/25 bg-wholara-cream p-7 text-wholara-green sm:p-9 lg:p-10">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
              What&rsquo;s Included
            </span>
            <ul className="mt-6 space-y-3.5">
              {oneOnOneIncludes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-wholara-terracotta text-wholara-cream"
                    aria-hidden
                  >
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  <span className="text-[0.975rem] leading-relaxed text-wholara-green/85">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <Link
                href="/consultation"
                className="cta-shadow inline-flex w-full items-center justify-center gap-2 rounded-full bg-wholara-terracotta px-6 py-3.5 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep sm:w-auto sm:px-8 sm:py-4 sm:text-base"
              >
                Book a Discovery Call
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section className="relative bg-wholara-cream">
      <div className="relative mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
        <div className="max-w-3xl">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
            Compare
          </span>
          <h2 className="font-display mt-4 text-3xl leading-tight text-wholara-green sm:text-4xl lg:text-5xl">
            Which is right <span className="italic">for me?</span>
          </h2>
        </div>

        <div className="mt-12 hidden overflow-hidden rounded-3xl border border-wholara-green/15 bg-wholara-cream-deep/40 md:block">
          <div className="grid grid-cols-[1.1fr_1.4fr_1.4fr] divide-x divide-wholara-green/10 bg-wholara-cream-deep/70">
            <div className="px-6 py-5 text-xs font-medium uppercase tracking-[0.16em] text-wholara-green/55">
              &nbsp;
            </div>
            <div className="px-6 py-5 text-sm font-semibold uppercase tracking-[0.16em] text-wholara-terracotta">
              4-Week Group Reset
            </div>
            <div className="px-6 py-5 text-sm font-semibold uppercase tracking-[0.16em] text-wholara-terracotta">
              1:1 Coaching
            </div>
          </div>

          <ul className="divide-y divide-wholara-green/10">
            {comparisonRows.map((row) => (
              <li
                key={row.label}
                className="grid grid-cols-[1.1fr_1.4fr_1.4fr] divide-x divide-wholara-green/10"
              >
                <div className="px-6 py-6 text-sm font-semibold uppercase tracking-[0.14em] text-wholara-sage">
                  {row.label}
                </div>
                <div className="px-6 py-6 text-[0.975rem] leading-relaxed text-wholara-green/85">
                  {row.group}
                </div>
                <div className="px-6 py-6 text-[0.975rem] leading-relaxed text-wholara-green/85">
                  {row.oneOnOne}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 grid gap-5 md:hidden">
          {comparisonRows.map((row) => (
            <div
              key={row.label}
              className="rounded-2xl border border-wholara-green/15 bg-wholara-cream-deep/40 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wholara-sage">
                {row.label}
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-wholara-terracotta">
                    4-Week Group Reset
                  </p>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-wholara-green/85">
                    {row.group}
                  </p>
                </div>
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-wholara-terracotta">
                    1:1 Coaching
                  </p>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-wholara-green/85">
                    {row.oneOnOne}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCta() {
  return (
    <section className="relative overflow-hidden bg-wholara-terracotta text-wholara-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(245,240,232,0.12) 0 1px, transparent 1px 18px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-20 h-[360px] w-[360px] rounded-full bg-wholara-cream/15 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-5xl px-5 py-10 text-center sm:px-8 sm:py-12 lg:py-14">
        <h2 className="font-display text-3xl leading-tight text-wholara-cream sm:text-4xl lg:text-5xl">
          Not sure which is <span className="italic">right for you?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-wholara-cream/90 sm:text-lg">
          Book a free 20-minute discovery call and we&rsquo;ll figure it out
          together.
        </p>
        <div className="mt-9">
          <Link
            href="/consultation"
            className="cta-shadow inline-flex items-center justify-center gap-2 rounded-full bg-wholara-green px-8 py-4 text-base font-medium text-wholara-cream transition-colors hover:bg-wholara-green-deep"
          >
            Let&rsquo;s Talk
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}
