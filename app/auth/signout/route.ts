import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Signs the user out (clearing the auth cookies) and returns them to the page
// they logged out from. Invoked by the "Log out" form button.
export async function POST(req: Request) {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ??
    new URL(req.url).origin;

  const redirectTo = req.headers.get("referer") ?? `${origin}/ask`;
  return NextResponse.redirect(redirectTo, { status: 303 });
}
