-- ==========================================================================
-- OBSIDIANA — Configuración de Supabase
-- Copia TODO este archivo y pégalo en:  Supabase -> SQL Editor -> New query -> Run
-- Crea la tabla de productos, el bucket de fotos y los permisos.
-- ==========================================================================

-- 1) Tabla de productos --------------------------------------------------------
create table if not exists public.products (
  id          text primary key,
  name        text not null,
  price       integer not null default 0,
  category    text default 'ropa',
  collection  text default '',
  is_new      boolean default false,
  accent      text default 'none',          -- 'none' | 'red' | 'purple'
  sizes       text[] default '{}',
  description text default '',
  image       text default '',
  created_at  timestamptz default now()
);

alter table public.products enable row level security;

-- Cualquiera puede VER los productos (la tienda pública)
drop policy if exists "public read products" on public.products;
create policy "public read products"
  on public.products for select
  using (true);

-- Solo usuarios con sesión (la dueña) pueden crear / editar / borrar
drop policy if exists "auth manage products" on public.products;
create policy "auth manage products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);


-- 2) Almacenamiento de fotos ---------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Cualquiera puede VER las fotos
drop policy if exists "public read images" on storage.objects;
create policy "public read images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Solo la dueña (con sesión) puede SUBIR / EDITAR / BORRAR fotos
drop policy if exists "auth upload images" on storage.objects;
create policy "auth upload images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "auth update images" on storage.objects;
create policy "auth update images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "auth delete images" on storage.objects;
create policy "auth delete images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');


-- 3) (Opcional) Cargar el catálogo de ejemplo ---------------------------------
-- Puedes borrar estas filas después desde el panel. Descomenta si lo quieres.
-- insert into public.products (id, name, price, category, collection, is_new, accent, sizes, description) values
--   ('vestido-lunar','Vestido Lunar',45000,'ropa','Eternal',false,'none','{XS,S,M,L}','Vestido largo de líneas fluidas en negro absoluto.'),
--   ('corset-eclipse','Corset Eclipse',55000,'ropa','Eclipse',true,'red','{XS,S,M,L,XL}','Corset estructurado con cordón trasero, detalle vino.'),
--   ('botas-umbra','Botas Umbra',72000,'calzado','Umbra',true,'purple','{36,37,38,39,40}','Botas altas de cuero mate con hebillas laterales.')
-- on conflict (id) do nothing;

-- ¡Listo! Ahora crea el usuario de la dueña en:
-- Supabase -> Authentication -> Users -> Add user (correo + contraseña, "Auto confirm").
