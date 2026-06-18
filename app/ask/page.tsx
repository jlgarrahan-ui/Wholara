import Link from "next/link";
import { AskConsentGate } from "./ask-consent-gate";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAskSetupMessage } from "@/lib/supabase/ask-config";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSubscriptionRow, isSubscriptionActive } from "@/lib/subscription";

export const dynamic = "force-dynamic";

// Resolve the logged-in user and whether they have an active subscription.
// Wrapped so a missing/misconfigured auth setup degrades to "logged out, free
// preview" rather than crashing the page.
async function getSessionState(): Promise<{
  email: string | null;
  subscribed: boolean;
}> {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { email: null, subscribed: false };
    const row = await getSubscriptionRow(user.id);
    return { email: user.email ?? null, subscribed: isSubscriptionActive(row) };
  } catch {
    return { email: null, subscribed: false };
  }
}

export default async function AskPage() {
  const setupMessage = getAskSetupMessage();
  const { email, subscribed } = await getSessionState();

  return (
    <div className="flex min-h-full flex-col bg-wholara-cream text-wholara-green">
      <SiteHeader />
      <main className="relative flex flex-1 flex-col px-5 py-8 sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 hidden min-[1100px]:block"
          style={{ right: "calc(50% + 384px + 8px)" }}
        >
          <LeftWildflowerCluster className="h-[500px] w-[130px]" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 hidden min-[1100px]:block"
          style={{ left: "calc(50% + 384px + 8px)" }}
        >
          <RightWildflowerCluster className="h-[500px] w-[130px]" />
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
          <div className="mb-3 flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-xs text-wholara-green/60 sm:text-[0.8125rem]">
            {email ? (
              <>
                <span className="mr-auto truncate">
                  Logged in as{" "}
                  <span className="font-medium text-wholara-green">{email}</span>
                </span>
                <Link
                  href="/account"
                  className="font-medium text-wholara-green/80 transition-colors hover:text-wholara-terracotta-deep"
                >
                  Account
                </Link>
                <form action="/auth/signout" method="post" className="contents">
                  <button
                    type="submit"
                    className="font-medium text-wholara-green/80 transition-colors hover:text-wholara-terracotta-deep"
                  >
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login?next=/ask"
                className="font-medium text-wholara-green/80 transition-colors hover:text-wholara-terracotta-deep"
              >
                Log in
              </Link>
            )}
          </div>
          <div className="mb-6">
            <h1 className="font-display text-3xl font-light text-wholara-green sm:text-4xl">
              Ask Wholara
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-wholara-green/70 sm:text-[0.9375rem]">
              A conversation, not a search box. Tell Wholara what&rsquo;s going
              on and she&rsquo;ll ask the right questions before pulling from a
              nutrition knowledge base.
            </p>
          </div>
          <div className="flex h-[600px] flex-col rounded-3xl border border-wholara-green/10 bg-wholara-cream-deep/30 p-4 sm:h-[min(75vh,720px)] sm:p-6">
            <AskConsentGate
              setupMessage={setupMessage}
              isSubscribed={subscribed}
              isLoggedIn={Boolean(email)}
            />
          </div>
        </div>
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
