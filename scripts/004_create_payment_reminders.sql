-- Create payment_reminders table
create table if not exists public.payment_reminders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric(12,2),
  due_date date not null,
  is_recurring boolean not null default false,
  recurrence_interval text check (recurrence_interval in ('weekly', 'monthly', 'yearly')),
  is_completed boolean not null default false,
  category_id uuid references public.categories(id),
  user_id uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.payment_reminders enable row level security;

-- All authenticated users can read reminders
create policy "reminders_select_authenticated" on public.payment_reminders
  for select using (auth.role() = 'authenticated');

-- Admin and operador can insert reminders
create policy "reminders_insert_admin_operador" on public.payment_reminders
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'operador')
    )
  );

-- Admin and operador can update reminders
create policy "reminders_update_admin_operador" on public.payment_reminders
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'operador')
    )
  );

-- Only admin can delete reminders
create policy "reminders_delete_admin" on public.payment_reminders
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Index for common queries
create index if not exists idx_reminders_due_date on public.payment_reminders(due_date);
create index if not exists idx_reminders_completed on public.payment_reminders(is_completed);
