/** Public project URL (browser + server). */
export function getSupabaseProjectUrl(): string | undefined {
  const fromPublic = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (fromPublic) return fromPublic;
  return process.env.SUPABASE_URL?.trim();
}

/**
 * Server-only elevated key (bypasses RLS). Accepts legacy and common aliases.
 * Supabase dashboard: Settings → API Keys → secret key, or Legacy service_role JWT.
 */
export function getSupabaseServiceRoleKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SECRET_API_KEY?.trim()
  );
}
