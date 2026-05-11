import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Corporate Wellness | Wholara",
  description:
    "Wholara's Corporate Wellness program brings clinical nutrition science to your organization — reducing burnout, sharpening focus, and helping teams perform at their best.",
};

type IconProps = { className?: string };

const impactCards: Array<{
  title: string;
  body: string;
  icon: (props: IconProps) => React.ReactElement;
}> = [
  {
    title: "Burnout Recovery",
    body:
      "Chronic stress depletes adrenal reserves and disrupts cortisol regulation. Strategic nutrition directly restores the body's stress resilience.",
    icon: BatteryIcon,
  },
  {
    title: "Motivation & Drive",
    body:
      "Dopamine is synthesized from dietary amino acids. Poor nutrition disrupts the pathways your team needs to feel motivated and focused.",
    icon: BoltIcon,
  },
  {
    title: "Cognitive Performance",
    body:
      "Blood sugar crashes produce the mental fog employees experience mid-morning. Eating for stable blood sugar transforms cognitive output across the whole workday.",
    icon: BrainIcon,
  },
  {
    title: "Stress Resilience",
    body:
      "GABA — the brain's calming neurotransmitter — is produced in the gut and directly influenced by diet. The right foods shift your team from stressed to resilient.",
    icon: ShieldIcon,
  },
  {
    title: "Mood & Emotional Regulation",
    body:
      "90% of serotonin is produced in the gut. Nutrient deficiencies impair serotonin synthesis, contributing to low mood and burnout.",
    icon: HeartIcon,
  },
  {
    title: "Sustained Energy",
    body:
      "Real energy is built through nutrition, not caffeine. Mitochondrial nutrients like CoQ10, B vitamins, and magnesium restore energy at the cellular level.",
    icon: SunIcon,
  },
];

const standaloneOfferings: Array<{
  title: string;
  subtitle: string;
  body: string;
  tag: string;
}> = [
  {
    title: "Lunch & Learn",
    subtitle: "Virtual or In-Person · 45 Minutes",
    body:
      "An evidence-based presentation covering how nutrition impacts the gut-brain connection — specifically the neurotransmitters driving burnout, motivation, mood, and energy. Your team leaves with actionable tools they can use the same day: foods that fuel focus, swaps that eliminate energy crashes, and small daily shifts that create lasting change. No fluff, no fads — just real science made practical.",
    tag: "Book individually or as part of a package.",
  },
  {
    title: "Corporate Wellness Newsletter",
    subtitle: "Monthly + Weekly",
    body:
      "Monthly deep-dive newsletters and weekly micro-content delivered to your team's inbox. Clinical nutrition science made practical — tips, seasonal recipes, habit strategies, and the latest research translated into real life. Consistent wellness education that compounds over time.",
    tag: "Available as a standalone or included in all packages.",
  },
];

const packages: Array<{
  tier: string;
  name: string;
  tagline: string;
  includes: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
}> = [
  {
    tier: "Tier 1",
    name: "The Foundation",
    tagline:
      "For companies ready to start investing in their team's health.",
    includes: [
      "1 Lunch & Learn session",
      "Corporate Wellness Newsletter",
      "Full team access to the Wholara app",
      "30-Day Corporate Wellness Restart program",
    ],
    cta: { label: "Get Started", href: "/app" },
  },
  {
    tier: "Tier 2",
    name: "The Culture Shift",
    tagline:
      "For companies committed to making wellness a competitive advantage.",
    includes: [
      "Everything in Tier 1",
      "Monthly Lunch & Learns",
      "Full Wholara course library + ebooks + meal plans",
      "Ask Wholara personalization for every employee",
      "Optional 1:1 coaching add-on with a Master Nutrition Therapist",
    ],
    cta: { label: "Get Started", href: "/app" },
    highlighted: true,
  },
  {
    tier: "Tier 3",
    name: "The Full Partnership",
    tagline:
      "For organizations making employee wellbeing a strategic priority.",
    includes: [
      "Everything in Tier 2",
      "Custom number of employee and executive 1:1 consultations",
      "Virtual or in-person events tailored to your organization",
      "Operational support and custom content",
      "Fully customized wellness strategy",
    ],
    cta: { label: "Book a Consultation", href: "/consultation" },
  },
];

export default function CorporateWellnessPage() {
  return (
    <div className="flex flex-col flex-1 bg-wholara-cream text-wholara-green">
      <SiteHeader />

      <main className="flex flex-col flex-1">
        <Hero />
        <BusinessCase />
        <NutritionImpact />
        <StandaloneOfferings />
        <Packages />
        <FinalCta />
      </main>

      <SiteFooter />
    </div>
  );
}

function Hero() {
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
        className="pointer-events-none absolute -top-32 -right-24 h-[520px] w-[520px] rounded-full bg-wholara-terracotta/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[480px] w-[480px] rounded-full bg-wholara-sage/25 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-32 lg:py-40">
        <span className="inline-flex items-center gap-2 rounded-full border border-wholara-cream/25 bg-wholara-cream/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-wholara-cream/85">
          <span className="h-1.5 w-1.5 rounded-full bg-wholara-terracotta" />
          Corporate Wellness
        </span>

        <h1 className="font-display mt-8 text-4xl font-light leading-[1.05] text-wholara-cream sm:text-5xl md:text-6xl lg:text-7xl">
          Your team&rsquo;s performance starts at the{" "}
          <span className="italic text-wholara-terracotta">cellular level.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-wholara-cream/80 sm:text-lg">
          Wholara&rsquo;s Corporate Wellness program gives organizations a
          science-backed, nutrition-first approach to reducing burnout,
          boosting focus, and building a team that shows up as their best every
          single day.
        </p>

        <div className="mt-10">
          <Link
            href="/consultation"
            className="cta-shadow inline-flex items-center justify-center gap-2 rounded-full bg-wholara-terracotta px-8 py-4 text-base font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep"
          >
            Book a Consultation
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function BusinessCase() {
  return (
    <section className="relative bg-wholara-cream">
      <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
          The business case
        </span>
        <h2 className="font-display mt-4 text-3xl leading-tight text-wholara-green sm:text-4xl lg:text-5xl">
          Burnout is a business problem,{" "}
          <span className="italic">not just a personal one.</span>
        </h2>

        <p className="mt-8 max-w-3xl text-base leading-relaxed text-wholara-green/80 sm:text-lg">
          Workplace stress costs U.S. companies over{" "}
          <strong className="font-semibold text-wholara-green">
            $300 billion
          </strong>{" "}
          annually in lost productivity, absenteeism, and turnover. Research
          shows that for every <strong className="font-semibold text-wholara-green">$1</strong>{" "}
          invested in employee wellness, organizations see an average return of{" "}
          <strong className="font-semibold text-wholara-green">$3.27</strong>{" "}
          in reduced healthcare costs. Wholara brings clinical nutrition
          science directly to your organization — practical, personalized, and
          built for real working people.
        </p>

        <dl className="mt-12 grid gap-6 sm:grid-cols-3">
          <Stat label="Annual cost of workplace stress" value="$300B+" />
          <Stat label="ROI per $1 in wellness spend" value="$3.27" />
          <Stat label="Built for" value="Real working teams" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-wholara-green/15 bg-wholara-cream-deep/40 p-6">
      <dt className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-wholara-green/55">
        {label}
      </dt>
      <dd className="font-display mt-2 text-3xl text-wholara-green sm:text-4xl">
        {value}
      </dd>
    </div>
  );
}

function NutritionImpact() {
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
      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-cream/80">
            How nutrition impacts your team
          </span>
          <h2 className="font-display mt-4 text-3xl leading-tight text-wholara-cream sm:text-4xl lg:text-5xl">
            The science is clear.{" "}
            <span className="italic">
              What your team eats changes how they work.
            </span>
          </h2>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {impactCards.map(({ title, body, icon: Icon }) => (
            <li
              key={title}
              className="group relative flex flex-col rounded-3xl border border-wholara-cream/20 bg-wholara-green/30 p-7 backdrop-blur-sm transition-colors hover:bg-wholara-green/45 sm:p-8"
            >
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-wholara-cream text-wholara-green"
                aria-hidden
              >
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="font-display mt-6 text-2xl text-wholara-cream">
                {title}
              </h3>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-wholara-cream/85">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StandaloneOfferings() {
  return (
    <section className="relative bg-wholara-cream">
      <div className="texture-grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
          Standalone offerings
        </span>
        <h2 className="font-display mt-4 text-3xl leading-tight text-wholara-green sm:text-4xl lg:text-5xl">
          À La Carte <span className="italic">Options.</span>
        </h2>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-7">
          {standaloneOfferings.map(({ title, subtitle, body, tag }) => (
            <li
              key={title}
              className="flex flex-col rounded-3xl border border-wholara-green/15 bg-wholara-cream-deep/35 p-7 sm:p-9"
            >
              <h3 className="font-display text-2xl text-wholara-green sm:text-3xl">
                {title}
              </h3>
              <p className="mt-1.5 text-sm font-medium uppercase tracking-[0.16em] text-wholara-terracotta">
                {subtitle}
              </p>
              <p className="mt-5 text-base leading-relaxed text-wholara-green/80">
                {body}
              </p>
              <div className="mt-auto pt-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-wholara-green/20 bg-wholara-cream px-3.5 py-1.5 text-xs font-medium text-wholara-green/75">
                  <span className="h-1.5 w-1.5 rounded-full bg-wholara-terracotta" />
                  {tag}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Packages() {
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
        className="pointer-events-none absolute -bottom-32 right-0 h-[420px] w-[420px] rounded-full bg-wholara-terracotta/20 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-cream/70">
            Packages
          </span>
          <h2 className="font-display mt-4 text-3xl leading-tight text-wholara-cream sm:text-4xl lg:text-5xl">
            Choose Your <span className="italic text-wholara-terracotta">Level.</span>
          </h2>
        </div>

        <ul className="mt-14 grid items-stretch gap-6 md:grid-cols-3 lg:gap-7">
          {packages.map((pkg) => (
            <li
              key={pkg.tier}
              className={
                "relative flex flex-col rounded-3xl p-7 sm:p-8 " +
                (pkg.highlighted
                  ? "border-2 border-wholara-terracotta bg-wholara-green-deep/80 cta-shadow lg:-translate-y-3"
                  : "border border-wholara-cream/15 bg-wholara-green-deep/45")
              }
            >
              {pkg.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-wholara-terracotta px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-wholara-cream">
                  Most Popular
                </span>
              )}

              <span
                className={
                  "text-[0.7rem] font-medium uppercase tracking-[0.18em] " +
                  (pkg.highlighted
                    ? "text-wholara-terracotta"
                    : "text-wholara-cream/60")
                }
              >
                {pkg.tier}
              </span>

              <h3 className="font-display mt-2 text-3xl leading-tight text-wholara-cream sm:text-[2rem]">
                {pkg.name}
              </h3>

              <p className="mt-3 text-sm italic leading-relaxed text-wholara-cream/75">
                {pkg.tagline}
              </p>

              <ul className="mt-7 space-y-3.5">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className={
                        "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full " +
                        (pkg.highlighted
                          ? "bg-wholara-terracotta text-wholara-cream"
                          : "bg-wholara-sage text-wholara-green")
                      }
                      aria-hidden
                    >
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-wholara-cream/90">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-9">
                <Link
                  href={pkg.cta.href}
                  className="cta-shadow inline-flex w-full items-center justify-center gap-2 rounded-full bg-wholara-terracotta px-6 py-3.5 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep"
                >
                  {pkg.cta.label}
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

function FinalCta() {
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

      <div className="relative mx-auto w-full max-w-5xl px-5 py-20 text-center sm:px-8 sm:py-24 lg:py-28">
        <h2 className="font-display text-3xl leading-tight text-wholara-cream sm:text-4xl lg:text-5xl">
          Ready to invest in <span className="italic">your team?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-wholara-cream/90 sm:text-lg">
          Book a free 30-minute consultation to discuss what Wholara Corporate
          Wellness looks like for your organization.
        </p>
        <div className="mt-9">
          <Link
            href="/consultation"
            className="cta-shadow inline-flex items-center justify-center gap-2 rounded-full bg-wholara-green px-8 py-4 text-base font-medium text-wholara-cream transition-colors hover:bg-wholara-green-deep"
          >
            Book a Consultation
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- inline icons ---------- */

function BatteryIcon({ className }: IconProps) {
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
      <rect x="3" y="8" width="15" height="9" rx="2" />
      <path d="M18 11h2v3h-2" />
      <path d="M7 12.5h4" />
    </svg>
  );
}

function BoltIcon({ className }: IconProps) {
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
      <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />
    </svg>
  );
}

function BrainIcon({ className }: IconProps) {
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
      <path d="M9 4.5a2.5 2.5 0 0 0-2.5 2.5v.5A2.5 2.5 0 0 0 5 9.5v1A2.5 2.5 0 0 0 6.5 13v.5A2.5 2.5 0 0 0 9 16h0a1 1 0 0 0 1-1V5.5A1 1 0 0 0 9 4.5Z" />
      <path d="M15 4.5a2.5 2.5 0 0 1 2.5 2.5v.5A2.5 2.5 0 0 1 19 9.5v1a2.5 2.5 0 0 1-1.5 2.5v.5A2.5 2.5 0 0 1 15 16h0a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z" />
      <path d="M10 11h4" />
      <path d="M8.5 19a2 2 0 0 0 1.5.5 2 2 0 0 0 2-2v-1" />
      <path d="M15.5 19a2 2 0 0 1-1.5.5 2 2 0 0 1-2-2v-1" />
    </svg>
  );
}

function ShieldIcon({ className }: IconProps) {
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
      <path d="M12 3 4 6v6c0 4.5 3.4 7.9 8 9 4.6-1.1 8-4.5 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
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

function SunIcon({ className }: IconProps) {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="M3 12h2" />
      <path d="M19 12h2" />
      <path d="m5.6 5.6 1.4 1.4" />
      <path d="m17 17 1.4 1.4" />
      <path d="m5.6 18.4 1.4-1.4" />
      <path d="m17 7 1.4-1.4" />
    </svg>
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
