import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSubscriptionRow } from "@/lib/subscription";

export const runtime = "nodejs";

// Creates a Stripe Checkout Session for the $9/mo unlimited plan and redirects
// the browser to Stripe's hosted checkout. Requires a logged-in Supabase user;
// the user id rides along as client_reference_id AND in metadata so the webhook
// can map the resulting subscription back to the right account.
//   STRIPE_SECRET_KEY — sk_live_… / sk_test_…
//   STRIPE_PRICE_ID   — the recurring $9/mo Price id (price_…)
export async function POST(req: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ??
    new URL(req.url).origin;

  if (!user) {
    // Not logged in — send them to log in first, then back to the account page.
    return NextResponse.redirect(`${origin}/login?next=/account`, {
      status: 303,
    });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const priceId = (
    process.env.STRIPE_PRICE_ID ?? process.env.STRIPE_PREMIUM_PRICE_ID
  )?.trim();
  if (!secretKey) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY is not set in the environment." },
      { status: 503 },
    );
  }
  if (!priceId) {
    return NextResponse.json(
      { error: "STRIPE_PRICE_ID is not set in the environment." },
      { status: 503 },
    );
  }

  const stripe = new Stripe(secretKey);

  try {
    // Reuse an existing Stripe customer if we already have one for this user so
    // we don't create duplicate customers on repeat checkouts.
    const existing = await getSubscriptionRow(user.id);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      client_reference_id: user.id,
      metadata: { supabase_user_id: user.id },
      // Carry the id onto the Subscription too, so subscription.updated/deleted
      // and invoice events can also resolve the user.
      subscription_data: { metadata: { supabase_user_id: user.id } },
      ...(existing?.stripe_customer_id
        ? { customer: existing.stripe_customer_id }
        : { customer_email: user.email ?? undefined }),
      success_url: `${origin}/account?checkout=success`,
      cancel_url: `${origin}/account?checkout=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.redirect(session.url, { status: 303 });
  } catch (e) {
    const detail = e instanceof Error ? e.message : "Could not start checkout.";
    console.error("[api/checkout] Stripe error", e);
    return NextResponse.json({ error: detail }, { status: 502 });
  }
}
