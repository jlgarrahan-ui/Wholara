import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseProjectUrl } from "@/lib/supabase/env";

/**
 * Cookie-backed Supabase client for the App Router (Server Components, Route
 * Handlers, Server Actions). Reads the logged-in user's session from cookies
 * and — where allowed (Route Handlers / Server Actions) — writes refreshed auth
 * cookies back.
 *
 * Note: `cookies()` is async in this Next.js version (must be awaited), so this
 * factory is async. In a Server Component the cookie store is read-only, so the
 * `setAll` writes throw; we swallow that — token refresh there is handled by
 * `proxy.ts` instead.
 */
export async function createServerSupabase(): Promise<SupabaseClient> {
  const url = getSupabaseProjectUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) {
    throw new Error(
      "Supabase auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where the cookie store is
          // read-only. Safe to ignore — proxy.ts refreshes the session.
        }
      },
    },
  });
}

/** Convenience: the current logged-in user (or null) from the request cookies. */
export async function getCurrentUser() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
