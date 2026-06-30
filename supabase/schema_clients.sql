-- ============================================================
-- STONE SLAB IND — Clientes (compradores) (v1.0.9 · Fatia 1)
-- Rode no SQL Editor do Supabase.
--
-- A indústria cadastra seus clientes (nome + email).
-- O acesso/login do comprador vem na Fatia 2.
-- ============================================================

create type client_status as enum ('convidado', 'ativo', 'inativo');

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references auth.users(id) on delete cascade,  -- a indústria dona
  name text not null,
  email text not null,
  company_name text,                  -- nome da empresa do comprador (opcional)
  country text,                       -- país do comprador (opcional)
  status client_status not null default 'convidado',
  -- buyer_user_id: preenchido na Fatia 2, quando o comprador criar/vincular o login
  buyer_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (company_id, email)
);

create index if not exists clients_company_idx on public.clients (company_id);
create index if not exists clients_buyer_idx on public.clients (buyer_user_id);

-- RLS: a indústria gerencia seus clientes
alter table public.clients enable row level security;

drop policy if exists "clients own" on public.clients;
create policy "clients own" on public.clients
  for all to authenticated
  using (auth.uid() = company_id)
  with check (auth.uid() = company_id);

-- (na Fatia 2 adicionaremos uma policy para o próprio comprador ver seu vínculo)
