import {
  getSupabaseProjectUrl,
  getSupabaseServiceRoleKey,
} from "@/lib/supabase/env";

/**
 * Whether the Ask API can run its default path (Supabase tables + Claude).
 * Proxy-only setups only need SUPABASE_CHAT_FUNCTION_URL.
 */
export function isAskBackendConfigured(): boolean {
  if (process.env.SUPABASE_CHAT_FUNCTION_URL?.trim()) return true;

  const url = getSupabaseProjectUrl();
  const serviceRole = getSupabaseServiceRoleKey();
  return Boolean(url && serviceRole);
}

/** Human-readable setup hint when chat cannot run. */
export function getAskSetupMessage(): string | null {
  if (isAskBackendConfigured()) return null;

  const urlOk = Boolean(getSupabaseProjectUrl());
  const keyOk = Boolean(getSupabaseServiceRoleKey());

  const lines: string[] = [
    "The server still does not see your Supabase URL + server secret. Fix one of these:",
  ];

  if (!urlOk) {
    lines.push(
      "• Add NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co (no quotes).",
    );
  }
  if (!keyOk) {
    lines.push(
      "• Add your Supabase secret key on a line exactly like: SUPABASE_SERVICE_ROLE_KEY=your_key_here",
    );
    lines.push(
      "  (You can also use the name SUPABASE_SECRET_KEY=… for the new “secret” key from API Keys.)",
    );
    lines.push("  No spaces around =. Do not use the NEXT_PUBLIC_ prefix for the secret.");
  }

  lines.push("• Save .env.local, then fully stop and restart “npm run dev” (env is read at startup).");
  lines.push(
    "Or set SUPABASE_CHAT_FUNCTION_URL to proxy all chat to your Supabase Edge Function.",
  );

  return lines.join("\n");
}
