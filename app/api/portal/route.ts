import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSubscriptionRow } from "@/lib/subscription";

export const runtime = "nodejs";

// Opens the Stripe Billing Portal so a subscriber can update payment details or
// cancel. Requires a logged-in user who has a stripe_customer_id on record.
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
    return NextResponse.redirect(`${origin}/login?next=/account`, {
      status: 303,
    });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY is not set in the environment." },
      { status: 503 },
    );
  }

  const row = await getSubscriptionRow(user.id);
  if (!row?.stripe_customer_id) {
    // No Stripe customer yet — nothing to manage. Send them to subscribe.
    return NextResponse.redirect(`${origin}/account`, { status: 303 });
  }

  const stripe = new Stripe(secretKey);
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: row.stripe_customer_id,
      return_url: `${origin}/account`,
    });
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (e) {
    const detail =
      e instanceof Error ? e.message : "Could not open the billing portal.";
    console.error("[api/portal] Stripe error", e);
    return NextResponse.json({ error: detail }, { status: 502 });
  }
}
