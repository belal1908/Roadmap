create extension if not exists "pgcrypto";

create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  search_query text not null,
  generated_at timestamptz not null default now(),
  is_public boolean not null default false,
  slug text not null unique,
  data jsonb not null,
  view_count integer not null default 0,
  category text not null default 'Skill'
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  roadmap_id uuid not null references public.roadmaps(id) on delete cascade,
  milestone_id text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, roadmap_id, milestone_id)
);

create index if not exists roadmaps_user_id_idx on public.roadmaps (user_id);
create index if not exists roadmaps_public_idx on public.roadmaps (is_public, view_count desc);
create index if not exists progress_lookup_idx on public.progress (user_id, roadmap_id);

alter table public.roadmaps enable row level security;
alter table public.progress enable row level security;

drop policy if exists "Users can read own roadmaps" on public.roadmaps;
create policy "Users can read own roadmaps"
  on public.roadmaps
  for select
  using (auth.uid() = user_id or is_public = true);

drop policy if exists "Users can insert own roadmaps" on public.roadmaps;
create policy "Users can insert own roadmaps"
  on public.roadmaps
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own roadmaps" on public.roadmaps;
create policy "Users can update own roadmaps"
  on public.roadmaps
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own roadmaps" on public.roadmaps;
create policy "Users can delete own roadmaps"
  on public.roadmaps
  for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can read own progress" on public.progress;
create policy "Users can read own progress"
  on public.progress
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own progress" on public.progress;
create policy "Users can insert own progress"
  on public.progress
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own progress" on public.progress;
create policy "Users can update own progress"
  on public.progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own progress" on public.progress;
create policy "Users can delete own progress"
  on public.progress
  for delete
  using (auth.uid() = user_id);
