-- Create transactions table
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('ingreso', 'egreso')),
  amount numeric(12,2) not null check (amount > 0),
  description text not null,
  category_id uuid not null references public.categories(id),
  date date not null default current_date,
  payment_method text not null default 'efectivo' check (payment_method in ('efectivo', 'transferencia', 'cheque', 'tarjeta', 'otro')),
  user_id uuid not null references auth.users(id),
  notes text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.transactions enable row level security;

-- All authenticated users can read transactions
create policy "transactions_select_authenticated" on public.transactions
  for select using (auth.role() = 'authenticated');

-- Admin and operador can insert transactions
create policy "transactions_insert_admin_operador" on public.transactions
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'operador')
    )
  );

-- Admin and operador can update their own transactions
create policy "transactions_update_own" on public.transactions
  for update using (
    user_id = auth.uid() and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'operador')
    )
  );

-- Only admin can delete transactions
create policy "transactions_delete_admin" on public.transactions
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Indices for common queries
create index if not exists idx_transactions_date on public.transactions(date);
create index if not exists idx_transactions_type on public.transactions(type);
create index if not exists idx_transactions_category on public.transactions(category_id);
create index if not exists idx_transactions_user on public.transactions(user_id);
create index if not exists idx_transactions_date_type on public.transactions(date, type);
