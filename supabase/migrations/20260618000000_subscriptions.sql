-- Run via Supabase CLI (`supabase db push`) or paste into the SQL Editor.
-- Tracks each user's Ask Wholara paid subscription. Keyed by the Supabase auth
-- user id. The Stripe webhook writes here with the service role key (which
-- bypasses RLS); end users may only read their own row.

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id);
create index if not exists subscriptions_stripe_subscription_id_idx
  on public.subscriptions (stripe_subscription_id);

comment on table public.subscriptions is 'Ask Wholara paid subscriptions, keyed by auth user id';

alter table public.subscriptions enable row level security;

-- A logged-in user can read ONLY their own subscription row.
drop policy if exists "Users can read their own subscription" on public.subscriptions;
create policy "Users can read their own subscription"
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies are defined on purpose: only the service
-- role (used by the Stripe webhook) writes to this table, and the service role
-- bypasses RLS entirely.

-- Help PostgREST pick up the new table (avoids "schema cache" errors).
notify pgrst, 'reload schema';
