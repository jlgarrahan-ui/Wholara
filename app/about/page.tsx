import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About | Wholara",
  description:
    "Julia Garrahan is a Master Nutrition Therapist who built Wholara after years of her own health struggles. Read her story.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col bg-[#F5F0E8] text-[#2C4A35]">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* 1. HERO */}
        <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-16 px-8 py-24 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#C4673A]">
              Who&apos;s Behind Wholara
            </p>
            <h1 className="font-display text-5xl font-medium leading-tight text-[#2e3328]">
              Julia Garrahan
            </h1>
            <div className="mt-3 space-y-1 text-sm leading-relaxed text-[#7D9B76]">
              <p>Master Nutrition Therapist, Nutrition Therapy Institute</p>
              <p>
                Certified Wellness &amp; Lifestyle Coach, Harvard Medical School
                Executive Education
              </p>
            </div>

            <div aria-hidden className="my-6 h-px bg-[#e4ddd0]" />

            <p className="text-lg leading-relaxed text-[#55594d]">
              These days, helping people get their energy, their confidence, and
              their lives back is the whole point of my work.
            </p>
            <p className="font-display mt-5 text-2xl font-medium italic leading-snug text-[#7D9B76]">
              If you&apos;re tired of feeling like a{" "}
              <span className="font-medium text-[#2C4A35]">
                stranger in your own body
              </span>
              , you&apos;re in the{" "}
              <span className="font-medium text-[#C4673A]">right place</span>.
            </p>
            <p className="mt-3 text-base text-[#55594d]">
              Let&apos;s go find your answers, together.
            </p>
            <Link
              href="/consultation"
              className="mt-8 inline-block rounded-full bg-[#2C4A35] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1e3325]"
            >
              Book a Free 20-Min Discovery Call
            </Link>
          </div>

          <div className="relative row-start-1 md:row-start-auto md:justify-self-end">
            <div
              aria-hidden
              className="absolute rounded-2xl border border-[#7D9B76]"
              style={{ top: 14, right: -14, bottom: -14, left: 14, zIndex: -1 }}
            />
            <Image
              src="/wholara-julia-portrait.jpg"
              alt="Julia Garrahan"
              width={380}
              height={500}
              className="rounded-2xl shadow-lg"
              style={{ objectFit: "cover" }}
            />
          </div>
        </section>

        {/* STORY + CREDENTIALS BAND (relative wrapper so the wildflowers can rise from the band into the story above) */}
        <div className="relative w-full">
          {/* 2. MY STORY */}
          <section className="w-full bg-[#FAFAF8] py-20">
            <div className="mx-auto max-w-2xl px-8">
              <p className="mb-10 text-center text-xs font-medium uppercase tracking-widest text-[#C4673A]">
                My Story
              </p>

              <p className="font-display mb-10 text-2xl font-medium italic leading-relaxed text-[#2C4A35]">
                People ask me sometimes if I really get what it&apos;s like to
                feel let down by your own body.{" "}
                <span className="font-bold text-[#C4673A]">I do.</span>{" "}
                I&apos;ve spent most of my life learning exactly how that
                feels.
              </p>

              <p className="mb-7 text-base leading-[1.9] text-[#3a3a35]">
                I was a sick kid. In and out of the hospital for asthma, a long
                list of foods I couldn&apos;t eat, and what felt like one
                infection after another.
              </p>

              <p className="mb-7 text-base leading-[1.9] text-[#3a3a35]">
                At 14 I got an ulcerative colitis diagnosis, with a two-week
                hospital stay to go with it. At 17 I was put on hormonal birth
                control for acne and an irregular cycle, and not long after,
                the panic attacks started. They got bad enough that I ended up
                on Xanax. Then I came off the birth control, and they just
                stopped. That was the first time it really hit me that maybe my
                body was trying to tell me something.
              </p>

              <p className="mb-7 text-base leading-[1.9] text-[#3a3a35]">
                Then freshman year of college, I hit a wall. Not the kind you
                push through. A fatigue and depression that just flattened me.
                I spent months bouncing between antidepressants and barely
                keeping my grades alive before anyone figured out it was Lyme
                disease, which meant months of antibiotics. And the whole time
                I was still trying to be an athlete, which felt almost like a
                joke given how exhausted I was. Then came hypothyroidism. A
                year later, Babesia, a Lyme co-infection, and yet another round
                of treatment.
              </p>

              <p className="mb-7 text-base leading-[1.9] text-[#3a3a35]">
                And it kept going. Five more years of it. Periods I
                couldn&apos;t predict, a stomach that was never happy,
                Epstein-Barr flaring back up, weight I couldn&apos;t explain,
                depression, a chronic fatigue syndrome diagnosis. A stranger in
                my own body, every day.
              </p>

              <blockquote className="font-display my-12 border-l-[3px] border-[#C4673A] pl-6 text-2xl italic leading-snug text-[#2C4A35]">
                Then one morning I woke up and decided I was done living like
                that.
              </blockquote>

              <p className="mb-7 text-base leading-[1.9] text-[#3a3a35]">
                I&apos;d already seen every doctor and run every lab I could
                think of. So I did the one thing still in my control. I went
                back to school and went looking for the answers nobody had been
                able to give me.
              </p>

              <div className="my-10 flex items-center justify-center gap-4 text-[#C4673A]">
                <span className="h-px flex-1 bg-current opacity-50" aria-hidden />
                <span className="text-lg" aria-hidden>
                  ✦
                </span>
                <span className="h-px flex-1 bg-current opacity-50" aria-hidden />
              </div>

              <p className="mb-7 text-base leading-[1.9] text-[#3a3a35]">
                And slowly, things turned around. My energy came back, and then
                some. My periods are regular for the first time in my life. My
                stomach finally calmed down. But the change I didn&apos;t see
                coming was the emotional one. I handle stress now in a way I
                genuinely didn&apos;t think I had in me, the sense of humor
                I&apos;d written off as gone is back, and most days my mood is
                the kind that rubs off on people.
              </p>

              <p className="mb-7 text-base leading-[1.9] text-[#3a3a35]">
                All of it gave me a real soft spot for whatever you&apos;re
                carrying right now, because odds are I&apos;ve carried some
                version of it too. And it gave me the conviction to spend the
                rest of my career helping other people get there too.
              </p>
            </div>
          </section>

          {/* 3. CREDENTIALS BAND */}
          <section className="relative mt-8 w-full bg-[#2C4A35] text-[#fdfbf7]">
            {/* Wildflowers anchored at the top of the green band, reaching up the page */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-full hidden translate-y-10 lg:block"
            >
              <div className="relative mx-auto h-[750px] w-full max-w-5xl">
                <LeftWildflowerCluster className="absolute bottom-0 left-0 h-full w-[195px]" />
                <RightWildflowerCluster className="absolute bottom-0 right-0 h-full w-[195px]" />
              </div>
            </div>

            <div className="mx-auto max-w-[760px] px-8 py-16 text-center">
              <p className="mb-6 text-xs uppercase tracking-widest text-[#fdfbf7]/60">
                Who&apos;s behind Wholara
              </p>
              <h2
                className="font-display font-medium leading-snug"
                style={{ fontSize: "clamp(1.7rem, 4vw, 2.3rem)" }}
              >
                These days, helping people get their energy, their confidence, and
                their lives back is the whole point.
              </h2>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <span className="rounded-full border border-[#fdfbf7]/30 px-5 py-2 text-sm tracking-wide">
                  Master Nutrition Therapist
                </span>
                <span className="rounded-full border border-[#fdfbf7]/30 px-5 py-2 text-sm tracking-wide">
                  Certified Wellness &amp; Lifestyle Coach
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* 4. CLOSING CTA */}
        <section className="mx-auto max-w-[640px] px-8 py-24 text-center">
          <h2
            className="font-display font-medium leading-tight text-[#2e3328]"
            style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)" }}
          >
            If you&apos;re tired of feeling like a stranger in your own body,
            you&apos;re in the right place.
          </h2>
          <p className="mt-6 text-lg text-[#55594d]">
            Let&apos;s go find your answers, together.
          </p>
          <Link
            href="/get-started"
            className="mt-9 inline-block rounded-full bg-[#2C4A35] px-8 py-4 text-sm font-medium tracking-wide text-[#fdfbf7] transition-colors hover:bg-[#2e3328]"
          >
            Get Started
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Flower({
  cx,
  cy,
  petal,
  center,
}: {
  cx: number;
  cy: number;
  petal: string;
  center: string;
}) {
  const angles = [0, 60, 120, 180, 240, 300];
  return (
    <g>
      {angles.map((a) => (
        <ellipse
          key={a}
          cx={cx}
          cy={cy - 10}
          rx={4.5}
          ry={8}
          fill={petal}
          stroke="#2C4A35"
          strokeWidth={0.7}
          strokeOpacity={0.4}
          transform={`rotate(${a} ${cx} ${cy})`}
        />
      ))}
      <circle
        cx={cx}
        cy={cy}
        r={3.6}
        fill={center}
        stroke="#2C4A35"
        strokeWidth={0.7}
        strokeOpacity={0.4}
      />
    </g>
  );
}

function WildflowerClusterContent() {
  return (
    <>
      <g fill="none" stroke="#2C4A35" strokeLinecap="round" strokeWidth={1.8}>
        <path d="M24 34 C 18 150, 30 320, 24 500" />
        <path d="M65 324 C 68 380, 62 450, 65 500" />
        <path d="M107 154 C 112 280, 102 410, 107 500" />
      </g>

      <g fill="#2C4A35">
        <ellipse cx={14} cy={170} rx={5} ry={2.3} transform="rotate(-30 14 170)" />
        <ellipse cx={32} cy={300} rx={5} ry={2.3} transform="rotate(30 32 300)" />
        <ellipse cx={15} cy={440} rx={5} ry={2.3} transform="rotate(-30 15 440)" />
        <ellipse cx={74} cy={440} rx={4.6} ry={2.1} transform="rotate(35 74 440)" />
        <ellipse cx={118} cy={270} rx={5} ry={2.3} transform="rotate(30 118 270)" />
        <ellipse cx={96} cy={440} rx={5} ry={2.3} transform="rotate(-30 96 440)" />
      </g>

      <Flower cx={24} cy={30} petal="#C4673A" center="#E8B84B" />
      <Flower cx={65} cy={320} petal="#F5F0E8" center="#C4673A" />
      <Flower cx={107} cy={150} petal="#7D9B76" center="#E8B84B" />
    </>
  );
}

function LeftWildflowerCluster({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 500"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <WildflowerClusterContent />
    </svg>
  );
}

function RightWildflowerCluster({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 500"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g transform="matrix(-1 0 0 1 130 0)">
        <WildflowerClusterContent />
      </g>
    </svg>
  );
}
