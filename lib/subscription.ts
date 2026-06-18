import { getServiceSupabase } from "@/lib/supabase/service";

// A subscription grants unlimited access while Stripe reports it active or in a
// trial AND the paid period has not yet lapsed.
const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export type SubscriptionRow = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string | null;
  current_period_end: string | null;
  updated_at: string | null;
};

/** True when this row currently entitles the user to unlimited questions. */
export function isSubscriptionActive(
  row: Pick<SubscriptionRow, "status" | "current_period_end"> | null,
): boolean {
  if (!row || !row.status || !ACTIVE_STATUSES.has(row.status)) return false;
  if (!row.current_period_end) return false;
  return new Date(row.current_period_end).getTime() > Date.now();
}

/**
 * Fetch a user's subscription row using the service-role client (bypasses RLS).
 * Returns null when there is no row or Supabase is unreachable — callers treat
 * a null/failed lookup as "not subscribed" so a DB hiccup can never hand out
 * paid access for free.
 */
export async function getSubscriptionRow(
  userId: string,
): Promise<SubscriptionRow | null> {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("subscriptions")
      .select(
        "user_id, stripe_customer_id, stripe_subscription_id, status, current_period_end, updated_at",
      )
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      console.warn("[subscription] lookup failed", error.message);
      return null;
    }
    return (data as SubscriptionRow | null) ?? null;
  } catch (e) {
    console.warn(
      "[subscription] lookup threw",
      e instanceof Error ? e.message : e,
    );
    return null;
  }
}

/** Convenience: is this user currently entitled to unlimited questions? */
export async function userHasActiveSubscription(
  userId: string,
): Promise<boolean> {
  return isSubscriptionActive(await getSubscriptionRow(userId));
}
