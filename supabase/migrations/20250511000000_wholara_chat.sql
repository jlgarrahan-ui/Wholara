-- Run via Supabase CLI (`supabase db push`) or paste into SQL Editor.
-- Stores Ask Wholara threads and messages for the Next.js app.

create table if not exists public.wholara_conversations (
  id uuid primary key default gen_random_uuid (),
  created_at timestamptz not null default now()
);

create table if not exists public.wholara_messages (
  id uuid primary key default gen_random_uuid (),
  conversation_id uuid not null references public.wholara_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists wholara_messages_conversation_created_at on public.wholara_messages (conversation_id, created_at asc);

comment on table public.wholara_conversations is 'Ask Wholara chat sessions';
comment on table public.wholara_messages is 'Ask Wholara chat messages';

alter table public.wholara_conversations enable row level security;
alter table public.wholara_messages enable row level security;

-- Intentionally no policies for anon/authenticated users: only the service role
-- (used by Next.js server routes) should access these tables.

-- Help PostgREST pick up new tables (fixes "schema cache" errors right after creation)
notify pgrst, 'reload schema';
