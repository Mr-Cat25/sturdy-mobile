-- Migration: create script_usage table for AI script quota enforcement
-- Business rules enforced server-side in the generate-script Edge Function:
--   Free users: 5 regular AI scripts per calendar month (UTC, resets on the 1st).
--   After the monthly regular limit: 1 emergency script allowed, with a 24-hour
--   cooldown between emergency uses.
--   Premium users bypass limits (enforced via Edge Function header flag).

create table if not exists public.script_usage (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  -- 'regular' = counted against the monthly free quota
  -- 'emergency' = used after the monthly quota is exhausted (24-h cooldown)
  script_type text        not null default 'regular'
                          check (script_type in ('regular', 'emergency')),
  created_at  timestamptz not null default now()
);

-- Index for fast per-user monthly quota lookups
create index script_usage_user_created_idx
  on public.script_usage (user_id, created_at);

-- Row-level security: users may only read their own rows (for client-side display)
-- Inserts are performed by the Edge Function with the service-role key, which
-- bypasses RLS, so no INSERT policy is needed here.
alter table public.script_usage enable row level security;

create policy "Users can view their own usage"
  on public.script_usage for select
  using (auth.uid() = user_id);
