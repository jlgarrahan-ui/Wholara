import Stripe from "stripe";
import { getServiceSupabase } from "@/lib/supabase/service";

// App Router route handlers do not parse the body automatically — we read the
// raw text with `req.text()` so the Stripe signature verifies against the exact
// bytes Stripe signed. Force the Node runtime for the Stripe SDK + crypto.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StripeSubscriptionLike = Stripe.Subscription & {
  current_period_end?: number;
};

// `current_period_end` lives at the top level on older API versions and on the
// subscription item on newer ones — check both.
function periodEndISO(sub: Stripe.Subscription): string | null {
  const top = (sub as StripeSubscriptionLike).current_period_end;
  if (typeof top === "number") return new Date(top * 1000).toISOString();
  const item = sub.items?.data?.[0] as
    | { current_period_end?: number }
    | undefined;
  if (item && typeof item.current_period_end === "number") {
    return new Date(item.current_period_end * 1000).toISOString();
  }
  return null;
}

function customerId(sub: Stripe.Subscription): string | null {
  return typeof sub.customer === "string" ? sub.customer : sub.customer.id;
}

/**
 * Resolve the Supabase user id for a subscription: prefer the metadata we set
 * at checkout, then fall back to matching an existing row by Stripe ids.
 */
async function resolveUserId(
  supabase: ReturnType<typeof getServiceSupabase>,
  opts: {
    metadataUserId?: string | null;
    subscriptionId?: string | null;
    stripeCustomerId?: string | null;
  },
): Promise<string | null> {
  if (opts.metadataUserId) return opts.metadataUserId;

  if (opts.subscriptionId) {
    const { data } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", opts.subscriptionId)
      .maybeSingle();
    if (data?.user_id) return data.user_id as string;
  }
  if (opts.stripeCustomerId) {
    const { data } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_customer_id", opts.stripeCustomerId)
      .maybeSingle();
    if (data?.user_id) return data.user_id as string;
  }
  return null;
}

async function upsertFromSubscription(
  supabase: ReturnType<typeof getServiceSupabase>,
  userId: string,
  sub: Stripe.Subscription,
) {
  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId(sub),
      stripe_subscription_id: sub.id,
      status: sub.status,
      current_period_end: periodEndISO(sub),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) {
    console.error("[api/webhook] subscriptions upsert failed", error.message);
    throw new Error(error.message);
  }
}

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secretKey || !webhookSecret) {
    return new Response("Stripe webhook is not configured.", { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header.", { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (e) {
    const detail = e instanceof Error ? e.message : "invalid signature";
    console.error("[api/webhook] signature verification failed", detail);
    return new Response(`Webhook signature verification failed: ${detail}`, {
      status: 400,
    });
  }

  let supabase: ReturnType<typeof getServiceSupabase>;
  try {
    supabase = getServiceSupabase();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Supabase misconfigured";
    return new Response(msg, { status: 503 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Only subscription checkouts concern us here.
        if (session.mode !== "subscription") break;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : (session.subscription?.id ?? null);
        const stripeCustomerId =
          typeof session.customer === "string"
            ? session.customer
            : (session.customer?.id ?? null);

        const userId = await resolveUserId(supabase, {
          metadataUserId:
            session.client_reference_id ??
            session.metadata?.supabase_user_id ??
            null,
          subscriptionId,
          stripeCustomerId,
        });
        if (!userId || !subscriptionId) {
          console.warn(
            "[api/webhook] checkout.session.completed without user/subscription id",
            { userId, subscriptionId },
          );
          break;
        }
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        await upsertFromSubscription(supabase, userId, sub);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(supabase, {
          metadataUserId: sub.metadata?.supabase_user_id ?? null,
          subscriptionId: sub.id,
          stripeCustomerId: customerId(sub),
        });
        if (!userId) {
          console.warn("[api/webhook] could not resolve user for", event.type);
          break;
        }
        await upsertFromSubscription(supabase, userId, sub);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & {
          subscription?: string | Stripe.Subscription | null;
        };
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : (invoice.subscription?.id ?? null);
        if (!subscriptionId) break;

        // Re-fetch the subscription for its canonical status (past_due/unpaid)
        // and period end rather than trusting the invoice alone.
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const stripeCustomerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : (invoice.customer?.id ?? null);
        const userId = await resolveUserId(supabase, {
          metadataUserId: sub.metadata?.supabase_user_id ?? null,
          subscriptionId,
          stripeCustomerId,
        });
        if (!userId) {
          console.warn(
            "[api/webhook] could not resolve user for invoice.payment_failed",
          );
          break;
        }
        await upsertFromSubscription(supabase, userId, sub);
        break;
      }

      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
  } catch (e) {
    // Return 500 so Stripe retries; the upsert errors are already logged.
    console.error("[api/webhook] handler error", e);
    return new Response("Webhook handler error", { status: 500 });
  }

  return Response.json({ received: true });
}
