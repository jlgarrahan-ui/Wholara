import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseProjectUrl } from "@/lib/supabase/env";

// Next.js 16 renamed the `middleware` convention to `proxy` (see
// node_modules/next/dist/docs — "Migrate from deprecated middleware convention
// to proxy"). This runs before routes render and refreshes the Supabase auth
// token so server-rendered pages (/account, /ask) always see a current session.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = getSupabaseProjectUrl();
  const anonKey = getSupabaseAnonKey();
  // If auth isn't configured yet, don't block the request — just pass through.
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Touching getUser() triggers a token refresh when needed; the refreshed
  // cookies are written onto `response` via setAll above.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Run on everything except static assets and the Stripe webhook (which must
  // receive its raw, untouched body and needs no Supabase session).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
