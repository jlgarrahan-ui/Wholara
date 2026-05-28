import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Get Started | Wholara",
  description:
    "Not sure where to start? Explore Wholara's individual consulting, corporate wellness, meal plans, and ebooks — and find the right place to begin.",
};

type IconProps = { className?: string };

const corporateOfferings: Array<{
  title: string;
  body: string;
  cta: { label: string; href: string };
}> = [
  {
    title: "Lunch and Learn",
    body:
      "A 45-minute live or virtual presentation on how nutrition impacts burnout, motivation, mood, and energy. Practical takeaways your team uses the same day.",
    cta: { label: "Learn More", href: "/corporate-wellness" },
  },
  {
    title: "Newsletter Program",
    body:
      "Monthly deep-dive newsletters and weekly micro-content delivered to your team's inbox. Consistent wellness education that compounds over time.",
    cta: { label: "Learn More", href: "/corporate-wellness" },
  },
  {
    title: "Tiered Packages",
    body:
      "From foundational team access to fully customized enterprise wellness strategies — three tiers built to grow with your organization.",
    cta: { label: "See Packages", href: "/corporate-wellness" },
  },
];

const mealPlans: Array<{ title: string; body: string }> = [
  {
    title: "Anti-Inflammatory Plan",
    body:
      "6 weeks of meals, recipes, and guidance to reduce inflammation and restore balance.",
  },
  {
    title: "GLP-1 Support",
    body:
      "Built for people on GLP-1 medications — protein targets, micronutrient gaps, and GI-friendly meals.",
  },
  {
    title: "Dopamine Reset",
    body:
      "A 2-week protocol to regulate your dopamine system through food, lifestyle, and daily rhythm.",
  },
  {
    title: "30-Day Reset",
    body:
      "A full month of guided nutrition to detox, restore gut health, and build lasting habits.",
  },
];

export default function GetStartedPage() {
  return (
    <div className="flex flex-col flex-1 bg-wholara-cream text-wholara-green">
      <SiteHeader />

      <main className="flex flex-col flex-1">
        <Hero />
        <IndividualConsultingSection />
        <CorporateWellnessSection />
        <MealPlansSection />
        <EbooksSection />
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
          Not sure where to start?{" "}
          <span className="italic text-wholara-terracotta">
            You&rsquo;re in the right place.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-wholara-green/80 sm:text-lg">
          Everyone&rsquo;s starting point is different. Here&rsquo;s a quick
          look at everything Wholara offers &mdash; find what fits your life
          right now.
        </p>
      </div>
    </section>
  );
}

function IndividualConsultingSection() {
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
        <div className="max-w-3xl">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
            Personal Support
          </span>
          <h2 className="font-display mt-3 text-3xl leading-tight text-wholara-cream sm:text-4xl lg:text-5xl">
            Built Around <span className="italic">You.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-wholara-cream/90 sm:text-lg">
            If you&rsquo;re dealing with something specific &mdash; fatigue,
            hormonal imbalance, gut issues, weight, sleep, stress &mdash; or
            you simply want a real practitioner in your corner, Individual
            Consulting is where to start. Choose between one-on-one sessions
            with a Master Nutrition Therapist or join our intimate 4-Week
            Group Reset program meeting weekly in Denver, CO.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:gap-7">
          <article className="flex flex-col rounded-3xl border border-wholara-cream/40 bg-wholara-cream p-7 text-wholara-green sm:p-8">
            <h3 className="font-display text-2xl text-wholara-green sm:text-3xl">
              1:1 Coaching
            </h3>
            <p className="mt-5 text-[0.975rem] leading-relaxed text-wholara-green/80">
              Fully personalized sessions built around your symptoms, your
              labs, your lifestyle. No generic plans &mdash; just real
              guidance tailored to you.
            </p>
            <div className="mt-auto pt-7">
              <Link
                href="/individual-consulting"
                className="cta-shadow inline-flex items-center justify-center gap-2 rounded-full bg-wholara-terracotta px-7 py-3.5 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep"
              >
                Learn More
                <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>

          <article className="flex flex-col rounded-3xl border border-wholara-cream/40 bg-wholara-cream p-7 text-wholara-green sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="font-display text-2xl text-wholara-green sm:text-3xl">
                4-Week Group Reset
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-wholara-terracotta/15 px-2.5 py-1 text-xs font-medium text-wholara-terracotta">
                <span aria-hidden>📍</span>
                Denver, CO
              </span>
            </div>
            <p className="mt-5 text-[0.975rem] leading-relaxed text-wholara-green/80">
              Small group. Big results. Meet weekly in Denver with a Master
              Nutrition Therapist for 4 weeks of guided nutrition, daily
              check-ins, and community support.
            </p>
            <div className="mt-auto pt-7">
              <Link
                href="/consultation?interest=group-reset-waitlist"
                className="cta-shadow inline-flex items-center justify-center gap-2 rounded-full bg-wholara-terracotta px-7 py-3.5 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep"
              >
                Join the Waitlist
                <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function CorporateWellnessSection() {
  return (
    <section className="relative bg-wholara-cream">
      <div className="texture-grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
        <div className="max-w-3xl">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
            For Organizations
          </span>
          <h2 className="font-display mt-3 text-3xl leading-tight text-wholara-green sm:text-4xl lg:text-5xl">
            Bring Wholara to <span className="italic">Your Team.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-wholara-green/80 sm:text-lg">
            Your team&rsquo;s performance starts with how they fuel
            themselves. Wholara&rsquo;s Corporate Wellness programs bring
            evidence-based nutrition education directly to your organization
            &mdash; reducing burnout, improving focus, and building a team
            that shows up as their best every single day.
          </p>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {corporateOfferings.map(({ title, body, cta }) => (
            <li
              key={title}
              className="flex flex-col rounded-3xl border border-wholara-sage/40 bg-wholara-sage p-7 text-wholara-cream sm:p-8"
            >
              <h3 className="font-display text-2xl text-wholara-cream sm:text-3xl">
                {title}
              </h3>
              <p className="mt-5 text-[0.975rem] leading-relaxed text-wholara-cream/90">
                {body}
              </p>
              <div className="mt-auto pt-7">
                <Link
                  href={cta.href}
                  className="cta-shadow inline-flex items-center justify-center gap-2 rounded-full bg-wholara-terracotta px-7 py-3.5 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep"
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

function MealPlansSection() {
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

      <div className="relative mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
        <div className="max-w-3xl">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
            Personalized Plans
          </span>
          <h2 className="font-display mt-3 text-3xl leading-tight text-wholara-cream sm:text-4xl lg:text-5xl">
            Pre-Built Plans That{" "}
            <span className="italic">Customize to You.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-wholara-cream/90 sm:text-lg">
            Start with a Wholara meal plan built around a specific health
            goal &mdash; then personalize it to your lifestyle through Ask
            Wholara. Drag-and-drop recipes, weekly grocery lists, and an AI
            tool that answers your questions as you go.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {mealPlans.map(({ title, body }) => (
            <li
              key={title}
              className="relative flex flex-col rounded-3xl border border-wholara-cream/15 bg-wholara-green-deep/45 p-6 sm:p-7"
            >
              <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-wholara-terracotta px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-wholara-cream">
                Coming Soon
              </span>
              <h3 className="font-display mt-7 text-xl text-wholara-cream sm:text-2xl">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-wholara-cream/85">
                {body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm italic text-wholara-cream/75">
          All plans include Ask Wholara access for the duration of your
          program.
        </p>
      </div>
    </section>
  );
}

function EbooksSection() {
  return (
    <section className="relative bg-wholara-cream">
      <div className="texture-grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
        <div className="max-w-3xl">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
            Start Learning
          </span>
          <h2 className="font-display mt-3 text-3xl leading-tight text-wholara-green sm:text-4xl lg:text-5xl">
            Dive Into the <span className="italic">Science.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-wholara-green/80 sm:text-lg">
            Want to learn before you commit? Wholara&rsquo;s ebooks give you
            the knowledge behind our approach &mdash; written by a Master
            Nutrition Therapist in plain language you can actually use. No
            fluff, no fads.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <article className="relative flex w-full max-w-xl flex-col rounded-3xl border border-wholara-green/15 bg-wholara-cream-deep/50 p-7 text-center sm:p-9">
            <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-wholara-terracotta px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-wholara-cream">
              Coming Soon
            </span>
            <BookIcon
              className="mx-auto mt-3 h-12 w-12 text-wholara-terracotta"
              aria-hidden
            />
            <h3 className="font-display mt-5 text-2xl text-wholara-green sm:text-3xl">
              Wholara Ebooks
            </h3>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-wholara-green/80">
              Evidence-based nutrition guides on inflammation, hormones, gut
              health, energy, and more.
            </p>
            <div className="mt-7 flex justify-center">
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-wholara-terracotta bg-transparent px-7 py-3 text-sm font-medium text-wholara-terracotta transition-colors hover:bg-wholara-terracotta/10"
              >
                Notify Me
                <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
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
          Still not sure?{" "}
          <span className="italic">Let&rsquo;s figure it out together.</span>
        </h2>
        <div className="mt-9">
          <Link
            href="/consultation"
            className="cta-shadow inline-flex items-center justify-center gap-2 rounded-full bg-wholara-green px-8 py-4 text-base font-medium text-wholara-cream transition-colors hover:bg-wholara-green-deep"
          >
            Book a Free Discovery Call
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function BookIcon({ className }: IconProps) {
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
      <path d="M4 5a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5Z" />
      <path d="M4 5a2 2 0 0 0 2 2h12" />
      <path d="M8 11h7" />
      <path d="M8 15h5" />
    </svg>
  );
}
