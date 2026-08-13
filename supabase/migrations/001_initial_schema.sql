create extension if not exists "pgcrypto";

create table if not exists public.players (
  id text primary key,
  nickname text not null check (char_length(nickname) between 2 and 48),
  first_name text not null,
  branch text,
  bits_id_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completion_time timestamptz,
  completed boolean not null default false
);

create table if not exists public.puzzle_scans (
  id text primary key,
  player_id text not null references public.players(id) on delete cascade,
  piece_number int not null check (piece_number between 1 and 6),
  first_scanned_at timestamptz not null default now(),
  last_scanned_at timestamptz not null default now(),
  scan_count int not null default 1 check (scan_count >= 1),
  unique_scan boolean not null default true,
  constraint puzzle_scans_one_unique_piece_per_player unique (player_id, piece_number)
);

create table if not exists public.unlocks (
  id text primary key,
  player_id text not null references public.players(id) on delete cascade,
  piece_number int not null check (piece_number between 1 and 6),
  content_id text not null,
  unlocked_at timestamptz not null default now()
);

create table if not exists public.fun_facts (
  id text primary key,
  category text not null,
  title text not null,
  body text not null,
  source text not null,
  source_url text not null,
  source_date text,
  accent_color text not null check (accent_color in ('maroon', 'blue', 'green', 'red', 'orange', 'purple')),
  active boolean not null default true,
  kind text not null default 'fact' check (kind in ('fact', 'joke'))
);

create table if not exists public.admin_settings (
  id text primary key default 'default',
  leaderboard_enabled boolean not null default true,
  hunt_enabled boolean not null default true,
  announcement text
);

insert into public.admin_settings (id, leaderboard_enabled, hunt_enabled, announcement)
values ('default', true, true, null)
on conflict (id) do nothing;

alter table public.players enable row level security;
alter table public.puzzle_scans enable row level security;
alter table public.unlocks enable row level security;
alter table public.fun_facts enable row level security;
alter table public.admin_settings enable row level security;

drop policy if exists "public leaderboard players" on public.players;
create policy "public leaderboard players" on public.players
  for select using (true);

drop policy if exists "public leaderboard scans" on public.puzzle_scans;
create policy "public leaderboard scans" on public.puzzle_scans
  for select using (true);

drop policy if exists "public active content" on public.fun_facts;
create policy "public active content" on public.fun_facts
  for select using (active = true);

drop policy if exists "public settings" on public.admin_settings;
create policy "public settings" on public.admin_settings
  for select using (true);

alter publication supabase_realtime add table public.players;
alter publication supabase_realtime add table public.puzzle_scans;
