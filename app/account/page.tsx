import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSubscriptionRow, isSubscriptionActive } from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Your account — Wholara",
};

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const { checkout } = await searchParams;
  const row = await getSubscriptionRow(user.id);
  const subscribed = isSubscriptionActive(row);

  return (
    <div className="flex min-h-full flex-col bg-wholara-cream text-wholara-green">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md rounded-3xl border border-wholara-green/10 bg-wholara-cream-deep/30 p-8 sm:p-10">
          <p className="mb-2 text-xs tracking-wide text-wholara-green/55">
            Signed in as{" "}
            <span className="font-medium text-wholara-green">{user.email}</span>
          </p>
          <h1 className="font-display text-3xl font-light text-wholara-green sm:text-4xl">
            Your account
          </h1>

          {checkout === "cancelled" && !subscribed && (
            <p
              className="mt-4 rounded-2xl border border-wholara-terracotta/35 bg-wholara-terracotta/10 px-4 py-3 text-sm text-wholara-terracotta-deep"
              role="status"
            >
              No worries — your checkout was cancelled and you haven&rsquo;t been
              charged.
            </p>
          )}

          {subscribed ? (
            <>
              {checkout === "success" && (
                <p
                  className="mt-4 rounded-2xl border border-wholara-sage/40 bg-wholara-cream px-4 py-3 text-sm text-wholara-green"
                  role="status"
                >
                  You&rsquo;re subscribed — thank you! 🌿
                </p>
              )}
              <p className="mt-4 text-sm leading-relaxed text-wholara-green/80 sm:text-[0.9375rem]">
                You&rsquo;re all set. Unlimited access to Ask Wholara.
                <br />
                Ask anything, anytime. No counting questions.
              </p>
              <form action="/api/portal" method="post" className="mt-6">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-wholara-green px-6 py-3 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-green-deep"
                >
                  Manage subscription
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="mt-4 text-sm leading-relaxed text-wholara-green/80 sm:text-[0.9375rem]">
                You&rsquo;re on the free preview. Five questions a month.
                <br />
                Want more? Unlimited access to Ask Wholara is $9 a month. Ask as
                many questions as you need, whenever you need them.
              </p>
              <form action="/api/checkout" method="post" className="mt-6">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-wholara-terracotta px-6 py-3 text-sm font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep"
                >
                  Subscribe — $9/month
                </button>
              </form>
              <p className="mt-3 text-center text-xs text-wholara-green/55">
                Cancel anytime. No lock-in.
              </p>
            </>
          )}

          <div className="mt-8 border-t border-wholara-green/10 pt-5 text-center">
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm text-wholara-green/60 underline underline-offset-2 transition-colors hover:text-wholara-terracotta-deep"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
