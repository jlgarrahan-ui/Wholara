import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Creates a Stripe Checkout Session for the $9/mo Ask Wholara Premium
// subscription and returns its hosted URL. The client redirects the browser to
// that URL. Configure these in the environment (Vercel + .env.local):
//   STRIPE_SECRET_KEY  — your Stripe secret key (sk_live_… / sk_test_…)
//   STRIPE_PRICE_ID    — the recurring Price id for the $9/mo plan (price_…)
export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  // Primary name is STRIPE_PRICE_ID; STRIPE_PREMIUM_PRICE_ID is accepted as a
  // fallback so older env setups keep working.
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

  // Derive absolute return URLs from the request origin so this works in local
  // dev and production without hardcoding a domain. Fall back to an explicit
  // NEXT_PUBLIC_SITE_URL, then to the request URL's own origin.
  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ??
    new URL(req.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      // {CHECKOUT_SESSION_ID} is a literal Stripe template — it must stay
      // un-encoded so Stripe can substitute the real id on redirect. The /ask
      // page verifies it server-side and then unlocks unlimited questions.
      success_url: `${origin}/ask?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/ask?upgrade=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const detail = e instanceof Error ? e.message : "Could not start checkout.";
    console.error("[api/checkout/premium] Stripe error", e);
    return NextResponse.json({ error: detail }, { status: 502 });
  }
}
