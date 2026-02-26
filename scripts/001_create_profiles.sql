-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'operador' check (role in ('admin', 'operador', 'lectura')),
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies: everyone authenticated can read all profiles (needed for user listings)
create policy "profiles_select_authenticated" on public.profiles
  for select using (auth.role() = 'authenticated');

-- Users can update their own profile (name only, not role)
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Users can insert their own profile
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Admin can update any profile (for role changes)
create policy "profiles_admin_update" on public.profiles
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger: auto-create profile when a new user signs up
-- First user gets 'admin' role, rest get 'operador'
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_count int;
  new_role text;
begin
  select count(*) into user_count from public.profiles;
  
  if user_count = 0 then
    new_role := 'admin';
  else
    new_role := 'operador';
  end if;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
