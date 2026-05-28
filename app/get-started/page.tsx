import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ServiceCards } from "./service-cards";

export const metadata: Metadata = {
  title: "Work With Me | Wholara",
  description:
    "Options built around you and your lifestyle — from 1:1 and group consulting to corporate wellness and free, evidence-based answers with Ask Wholara.",
};

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
        <ServiceCards />

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
