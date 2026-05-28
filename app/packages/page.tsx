import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Programs | Wholara",
  description:
    "Pre-built Wholara meal plans that customize to you — anti-inflammatory, GLP-1 support, dopamine reset, and more. Exciting things coming soon.",
};

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

export default function PackagesPage() {
  return (
    <div className="flex flex-1 flex-col bg-wholara-cream text-wholara-green">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden bg-wholara-cream">
          <div className="texture-grain absolute inset-0" aria-hidden />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-wholara-terracotta/15 blur-3xl"
          />
          <div className="relative mx-auto w-full max-w-5xl px-5 py-12 text-center sm:px-8 sm:py-16 lg:py-20">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
              Programs
            </span>
            <h1 className="font-display mt-3 text-4xl font-light leading-[1.05] text-wholara-green sm:text-5xl md:text-6xl">
              Plans built around a goal,{" "}
              <span className="italic text-wholara-terracotta">
                personalized to you.
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-wholara-green/80 sm:text-lg">
              We&rsquo;re putting the finishing touches on a library of Wholara
              programs &mdash; structured plans you can start today and shape to
              your life as you go. Here&rsquo;s a first look at what&rsquo;s on
              the way.
            </p>
          </div>
        </section>

        {/* Personalized Plans */}
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

        {/* Coming soon strip */}
        <section className="relative overflow-hidden bg-wholara-cream">
          <div className="texture-grain absolute inset-0" aria-hidden />
          <div className="relative mx-auto w-full max-w-3xl px-5 py-14 text-center sm:px-8 sm:py-16">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-wholara-terracotta">
              More on the way
            </span>
            <h2 className="font-display mt-3 text-3xl leading-tight text-wholara-green sm:text-4xl">
              Exciting things are{" "}
              <span className="italic text-wholara-terracotta">
                coming soon.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-wholara-green/80 sm:text-lg">
              New plans and programs are in the works. Check back soon &mdash;
              or use Ask Wholara any time in the meantime.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
