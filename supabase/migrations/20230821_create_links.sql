create table public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  note text,
  category text,
  tags text[] default '{}',
  pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger to update `updated_at`
create or replace function public.update_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;$$;

create or replace trigger trg_update_timestamp before update on public.links
for each row execute function public.update_timestamp();

-- Enable Row Level Security and policies
alter table public.links enable row level security;

create policy select_links on public.links
  for select using (auth.uid() = user_id);

create policy insert_links on public.links
  for insert with check (auth.uid() = user_id);

create policy update_links on public.links
  for update using (auth.uid() = user_id);

create policy delete_links on public.links
  for delete using (auth.uid() = user_id);
