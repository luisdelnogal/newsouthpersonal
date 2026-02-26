-- Create categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('ingreso', 'egreso')),
  color text not null default '#6b7280',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.categories enable row level security;

-- All authenticated users can read categories
create policy "categories_select_authenticated" on public.categories
  for select using (auth.role() = 'authenticated');

-- Only admins can insert categories
create policy "categories_insert_admin" on public.categories
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only admins can update categories
create policy "categories_update_admin" on public.categories
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only admins can delete categories
create policy "categories_delete_admin" on public.categories
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Seed initial categories
insert into public.categories (name, type, color) values
  ('Ventas minoristas', 'ingreso', '#22c55e'),
  ('Ventas mayoristas', 'ingreso', '#16a34a'),
  ('Otros ingresos', 'ingreso', '#84cc16'),
  ('Materia prima', 'egreso', '#ef4444'),
  ('Sueldos', 'egreso', '#f97316'),
  ('Servicios', 'egreso', '#eab308'),
  ('Impuestos', 'egreso', '#a855f7'),
  ('Logistica', 'egreso', '#3b82f6'),
  ('Packaging', 'egreso', '#06b6d4'),
  ('Otros egresos', 'egreso', '#6b7280')
on conflict do nothing;
