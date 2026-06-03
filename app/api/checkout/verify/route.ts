import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Confirms a completed Ask Wholara Premium checkout. The /ask page calls this
// with the session_id Stripe appends to the success URL. If the session is
// paid, the client persists an unlock flag and stops enforcing the preview
// limit. Verifying against Stripe (rather than trusting the redirect alone)
// keeps a stray ?session_id from unlocking Premium for free.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json(
      { premium: false, error: "session_id is required" },
      { status: 400 },
    );
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    return NextResponse.json(
      { premium: false, error: "STRIPE_SECRET_KEY is not set." },
      { status: 503 },
    );
  }

  const stripe = new Stripe(secretKey);
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // A finished subscription checkout reports payment_status "paid" (or, for
    // some flows, status "complete"). Either confirms the upgrade is real.
    const isPaid =
      session.payment_status === "paid" || session.status === "complete";

    return NextResponse.json({
      premium: isPaid,
      email: isPaid ? (session.customer_details?.email ?? null) : null,
    });
  } catch (e) {
    const detail =
      e instanceof Error ? e.message : "Could not verify checkout.";
    console.error("[api/checkout/verify] Stripe error", e);
    return NextResponse.json({ premium: false, error: detail }, { status: 502 });
  }
}
