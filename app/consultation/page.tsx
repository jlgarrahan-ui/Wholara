import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ConsultationForm } from "./consultation-form";

export const metadata: Metadata = {
  title: "Book a Consultation | Wholara",
  description:
    "Reach out to Wholara for individual nutrition coaching or a corporate wellness program. We respond within 24 hours.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const GROUP_RESET_WAITLIST_MESSAGE =
  "I'm interested in joining the waitlist for the 4-Week Group Reset program in Denver, CO.";

export default async function ConsultationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const interest =
    typeof params.interest === "string" ? params.interest : undefined;

  const initialServiceInterest: "individual" | "corporate" =
    interest === "group-reset-waitlist" ? "individual" : "individual";
  const initialMessage =
    interest === "group-reset-waitlist" ? GROUP_RESET_WAITLIST_MESSAGE : "";

  return (
    <div className="flex flex-col flex-1 bg-wholara-cream text-wholara-green">
      <SiteHeader />
      <main className="flex flex-col flex-1">
        <Hero />
        <FormSection
          initialServiceInterest={initialServiceInterest}
          initialMessage={initialMessage}
        />
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
        className="pointer-events-none absolute -top-32 -right-24 h-[460px] w-[460px] rounded-full bg-wholara-terracotta/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-wholara-sage/25 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-20 text-center sm:px-8 sm:py-28 lg:py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-wholara-cream/25 bg-wholara-cream/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-wholara-cream/85">
          <span className="h-1.5 w-1.5 rounded-full bg-wholara-terracotta" />
          Get in touch
        </span>

        <h1 className="font-display mt-7 text-5xl font-light leading-[1.05] text-wholara-cream sm:text-6xl lg:text-7xl">
          Let&rsquo;s <span className="italic text-wholara-terracotta">Talk.</span>
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-relaxed text-wholara-cream/85 sm:text-lg">
          Whether you&rsquo;re looking for personal nutrition guidance or a
          wellness program for your team — we&rsquo;d love to hear from you.
          Fill out the form below and we&rsquo;ll be in touch within 24 hours.
        </p>
      </div>
    </section>
  );
}

function FormSection({
  initialServiceInterest,
  initialMessage,
}: {
  initialServiceInterest: "individual" | "corporate";
  initialMessage: string;
}) {
  return (
    <section className="relative bg-wholara-cream">
      <div className="texture-grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto w-full max-w-[600px] px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-wholara-green/10 border-l-[6px] border-l-wholara-terracotta bg-white p-7 shadow-[0_24px_60px_-30px_rgba(44,74,53,0.35)] sm:p-9">
          <ConsultationForm
            initialServiceInterest={initialServiceInterest}
            initialMessage={initialMessage}
          />
        </div>
      </div>
    </section>
  );
}
