-- ============================================================
-- STONE SLAB IND — Chapas (v1.0.5)
-- Rode no SQL Editor DEPOIS do schema_materials.sql.
--
-- Material → Chapas. Cada chapa: código, foto, medidas (m),
-- preço (herda do material, editável), status.
-- Sistema calcula m²/pé²/valor na aplicação.
-- ============================================================

create type slab_status as enum ('disponivel', 'reservada', 'vendida');

create table if not exists public.slabs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references auth.users(id) on delete cascade,
  material_id uuid not null references public.materials(id) on delete cascade,
  code text not null,                 -- código da indústria
  photo_path text,                    -- foto individual
  length_m numeric(8,3),              -- comprimento em metros
  height_m numeric(8,3),              -- altura em metros
  -- preço próprio da chapa (se nulo, usa o do material)
  price_sqm numeric(12,2),
  price_sqft numeric(12,2),
  status slab_status not null default 'disponivel',
  created_at timestamptz not null default now()
);

create index if not exists slabs_material_idx on public.slabs (material_id);
create index if not exists slabs_company_idx on public.slabs (company_id, status);

-- RLS
alter table public.slabs enable row level security;

drop policy if exists "slabs own" on public.slabs;
create policy "slabs own" on public.slabs
  for all to authenticated
  using (auth.uid() = company_id)
  with check (auth.uid() = company_id);

-- Reaproveita o bucket materials-media (já criado no schema anterior)
