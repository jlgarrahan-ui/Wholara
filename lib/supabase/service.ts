import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseProjectUrl,
  getSupabaseServiceRoleKey,
} from "@/lib/supabase/env";

let cached: SupabaseClient | null = null;

/**
 * Server-only Supabase client with the service role key (bypasses RLS).
 * Use only in Route Handlers, Server Actions, or other trusted server code.
 */
export function getServiceSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = getSupabaseProjectUrl();
  const key = getSupabaseServiceRoleKey();

  if (!url || !key) {
    throw new Error(
      "Add NEXT_PUBLIC_SUPABASE_URL and a server secret (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY) to .env.local, then restart npm run dev.",
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
