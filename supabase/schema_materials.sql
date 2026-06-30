-- ============================================================
-- STONE SLAB IND — Materiais e Acabamentos (v1.0.4)
-- Rode no SQL Editor do Supabase (banco do Stone Slab IND).
--
-- Estrutura: Material (nome + espessura + acabamento + preço) → (chapas virão depois)
-- Preço padrão fica no material; pode ser sobrescrito na chapa.
-- Acabamentos: lista por empresa, cadastrável.
-- ============================================================

-- ============================================================
-- ACABAMENTOS — lista cadastrável por empresa
-- ============================================================
create table if not exists public.finishes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references auth.users(id) on delete cascade,
  name text not null,                 -- ex.: Polido, Escovado, Flameado
  created_at timestamptz not null default now(),
  unique (company_id, name)
);

create index if not exists finishes_company_idx on public.finishes (company_id);

-- ============================================================
-- MATERIAIS
-- ============================================================
create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references auth.users(id) on delete cascade,
  name text not null,                 -- ex.: Ocean Fantasy
  thickness text,                     -- ex.: 2cm
  finish text,                        -- ex.: Polido (texto, copiado da lista)
  cover_path text,                    -- foto de capa
  price_sqm numeric(12,2),            -- preço padrão por m² (USD)
  price_sqft numeric(12,2),           -- preço padrão por pé² (USD)
  created_at timestamptz not null default now()
);

create index if not exists materials_company_idx on public.materials (company_id);

-- ============================================================
-- RLS — cada empresa só enxerga e gerencia o que é seu
-- ============================================================
alter table public.finishes enable row level security;
alter table public.materials enable row level security;

drop policy if exists "finishes own" on public.finishes;
create policy "finishes own" on public.finishes
  for all to authenticated
  using (auth.uid() = company_id)
  with check (auth.uid() = company_id);

drop policy if exists "materials own" on public.materials;
create policy "materials own" on public.materials
  for all to authenticated
  using (auth.uid() = company_id)
  with check (auth.uid() = company_id);

-- ============================================================
-- STORAGE — bucket para fotos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('materials-media', 'materials-media', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='materials media read') then
    create policy "materials media read" on storage.objects
      for select using (bucket_id = 'materials-media');
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='materials media write') then
    create policy "materials media write" on storage.objects
      for insert to authenticated with check (bucket_id = 'materials-media');
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='materials media update') then
    create policy "materials media update" on storage.objects
      for update to authenticated using (bucket_id = 'materials-media');
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='materials media delete') then
    create policy "materials media delete" on storage.objects
      for delete to authenticated using (bucket_id = 'materials-media');
  end if;
end $$;
