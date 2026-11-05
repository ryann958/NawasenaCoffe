create table public.admin_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  is_active boolean not null default true
);

alter table public.admin_members enable row level security;

create policy "Admins can read their own membership"
  on public.admin_members
  for select
  to authenticated
  using (user_id = (select auth.uid()));

grant select on public.admin_members to authenticated;

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_members
    where user_id = (select auth.uid())
      and is_active
  );
$$;

revoke all on function public.is_active_admin() from public;
grant execute on function public.is_active_admin() to authenticated;

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  category text not null check (
    category in ('Espresso Based', 'Manual Brew', 'Non-Coffee', 'Pastry', 'Main Course')
  ),
  description text not null default '' check (char_length(description) <= 2000),
  price numeric(12, 2) not null check (price >= 0),
  image_path text,
  is_available boolean not null default true,
  is_published boolean not null default false,
  display_order integer not null default 0
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  alt_text text not null default '' check (char_length(alt_text) <= 300),
  category text not null default 'Atmosphere' check (char_length(category) <= 80),
  caption text not null default '' check (char_length(caption) <= 300),
  is_published boolean not null default false,
  display_order integer not null default 0
);

create index menu_items_public_order_idx
  on public.menu_items (display_order, name)
  where is_published;
create index gallery_items_public_order_idx
  on public.gallery_items (display_order, id)
  where is_published;

alter table public.menu_items enable row level security;
alter table public.gallery_items enable row level security;

grant select on public.menu_items, public.gallery_items to anon, authenticated;
grant insert, update, delete on public.menu_items, public.gallery_items to authenticated;

create policy "Public can read published menu"
  on public.menu_items
  for select
  to anon, authenticated
  using (is_published);
create policy "Admins can manage menu"
  on public.menu_items
  for all
  to authenticated
  using ((select public.is_active_admin()))
  with check ((select public.is_active_admin()));

create policy "Public can read published gallery"
  on public.gallery_items
  for select
  to anon, authenticated
  using (is_published);
create policy "Admins can manage gallery"
  on public.gallery_items
  for all
  to authenticated
  using ((select public.is_active_admin()))
  with check ((select public.is_active_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'nawasena-content',
  'nawasena-content',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins can upload website images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'nawasena-content'
    and (select public.is_active_admin())
    and (storage.foldername(name))[1] in ('menu', 'gallery')
  );

create policy "Admins can update website images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'nawasena-content' and (select public.is_active_admin()))
  with check (
    bucket_id = 'nawasena-content'
    and (select public.is_active_admin())
    and (storage.foldername(name))[1] in ('menu', 'gallery')
  );

create policy "Admins can delete website images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'nawasena-content' and (select public.is_active_admin()));
