create table public.admin_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_members enable row level security;

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
grant execute on function public.is_active_admin() to anon, authenticated;

create policy "Admins can read their own membership"
  on public.admin_members
  for select
  to authenticated
  using (user_id = (select auth.uid()));
grant select on public.admin_members to authenticated;

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
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  alt_text text not null default '' check (char_length(alt_text) <= 300),
  category text not null default 'Atmosphere' check (char_length(category) <= 80),
  caption text not null default '' check (char_length(caption) <= 300),
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.promotions_events (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('promotion', 'event')),
  title text not null check (char_length(title) between 1 and 160),
  description text not null default '' check (char_length(description) <= 3000),
  image_path text,
  starts_at timestamptz,
  ends_at timestamptz,
  start_time time,
  end_time time,
  cta_label text not null default '' check (char_length(cta_label) <= 80),
  cta_url text,
  is_active boolean not null default false,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promotions_events_valid_period
    check (starts_at is null or ends_at is null or ends_at >= starts_at)
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 1 and 120),
  review text not null check (char_length(review) between 1 and 3000),
  rating smallint check (rating between 1 and 5),
  source text not null default '' check (char_length(source) <= 160),
  review_date date,
  image_path text,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.store_settings (
  id boolean primary key default true check (id),
  store_name text not null default 'Nawasena Coffee' check (char_length(store_name) <= 160),
  description text not null default '' check (char_length(description) <= 3000),
  address text not null default '' check (char_length(address) <= 1000),
  whatsapp_number text not null default '' check (char_length(whatsapp_number) <= 40),
  email text not null default '' check (char_length(email) <= 254),
  opening_hours text not null default '' check (char_length(opening_hours) <= 2000),
  map_url text not null default '' check (char_length(map_url) <= 2000),
  instagram_url text not null default '' check (char_length(instagram_url) <= 2000),
  facebook_url text not null default '' check (char_length(facebook_url) <= 2000),
  gofood_url text not null default '' check (char_length(gofood_url) <= 2000),
  grabfood_url text not null default '' check (char_length(grabfood_url) <= 2000),
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.website_settings (
  id boolean primary key default true check (id),
  hero_eyebrow text not null default '' check (char_length(hero_eyebrow) <= 160),
  hero_title text not null default '' check (char_length(hero_title) <= 240),
  hero_description text not null default '' check (char_length(hero_description) <= 1000),
  about_title text not null default '' check (char_length(about_title) <= 240),
  about_description text not null default '' check (char_length(about_description) <= 3000),
  coffee_philosophy text not null default '' check (char_length(coffee_philosophy) <= 5000),
  footer_description text not null default '' check (char_length(footer_description) <= 1000),
  seo_title text not null default '' check (char_length(seo_title) <= 160),
  seo_description text not null default '' check (char_length(seo_description) <= 320),
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.content_activity (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null check (action in ('insert', 'update', 'delete')),
  summary text not null,
  created_at timestamptz not null default now()
);

create index menu_items_public_order_idx
  on public.menu_items (display_order, created_at)
  where is_published;
create index menu_items_category_idx on public.menu_items (category);
create index gallery_items_public_order_idx
  on public.gallery_items (display_order, created_at)
  where is_published;
create index promotions_events_public_period_idx
  on public.promotions_events (starts_at, ends_at, display_order)
  where is_published and is_active;
create index testimonials_public_order_idx
  on public.testimonials (display_order, created_at)
  where is_published;
create index content_activity_created_at_idx
  on public.content_activity (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.log_content_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed_row jsonb;
  record_id uuid;
  record_label text;
begin
  changed_row := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  record_id := case
    when (changed_row ->> 'id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      then (changed_row ->> 'id')::uuid
    else null
  end;
  record_label := coalesce(
    changed_row ->> 'name',
    changed_row ->> 'title',
    changed_row ->> 'customer_name',
    changed_row ->> 'store_name',
    'Website settings'
  );

  insert into public.content_activity (actor_id, entity_type, entity_id, action, summary)
  values (
    (select auth.uid()),
    tg_table_name,
    record_id,
    lower(tg_op),
    initcap(lower(tg_op)) || ' ' || record_label
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'menu_items',
    'gallery_items',
    'promotions_events',
    'testimonials',
    'store_settings',
    'website_settings'
  ]
  loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      table_name || '_set_updated_at',
      table_name
    );
    execute format(
      'create trigger %I after insert or update or delete on public.%I for each row execute function public.log_content_activity()',
      table_name || '_activity_log',
      table_name
    );
  end loop;
end;
$$;

alter table public.menu_items enable row level security;
alter table public.gallery_items enable row level security;
alter table public.promotions_events enable row level security;
alter table public.testimonials enable row level security;
alter table public.store_settings enable row level security;
alter table public.website_settings enable row level security;
alter table public.content_activity enable row level security;

grant select on public.menu_items, public.gallery_items, public.promotions_events, public.testimonials
  to anon, authenticated;
grant select, insert, update, delete
  on public.menu_items, public.gallery_items, public.promotions_events, public.testimonials
  to authenticated;
grant select on public.store_settings, public.website_settings to anon, authenticated;
grant select, insert, update, delete on public.store_settings, public.website_settings to authenticated;
grant select on public.content_activity to authenticated;
grant usage, select on sequence public.content_activity_id_seq to authenticated;

create policy "Public can read published menu items"
  on public.menu_items for select to anon, authenticated using (is_published);
create policy "Admins can manage menu items"
  on public.menu_items for all to authenticated
  using ((select public.is_active_admin()))
  with check ((select public.is_active_admin()));

create policy "Public can read published gallery items"
  on public.gallery_items for select to anon, authenticated using (is_published);
create policy "Admins can manage gallery items"
  on public.gallery_items for all to authenticated
  using ((select public.is_active_admin()))
  with check ((select public.is_active_admin()));

create policy "Public can read published promotions and events"
  on public.promotions_events for select to anon, authenticated using (is_published and is_active);
create policy "Admins can manage promotions and events"
  on public.promotions_events for all to authenticated
  using ((select public.is_active_admin()))
  with check ((select public.is_active_admin()));

create policy "Public can read published testimonials"
  on public.testimonials for select to anon, authenticated using (is_published);
create policy "Admins can manage testimonials"
  on public.testimonials for all to authenticated
  using ((select public.is_active_admin()))
  with check ((select public.is_active_admin()));

create policy "Public can read published store settings"
  on public.store_settings for select to anon, authenticated using (is_published);
create policy "Admins can manage store settings"
  on public.store_settings for all to authenticated
  using ((select public.is_active_admin()))
  with check ((select public.is_active_admin()));

create policy "Public can read published website settings"
  on public.website_settings for select to anon, authenticated using (is_published);
create policy "Admins can manage website settings"
  on public.website_settings for all to authenticated
  using ((select public.is_active_admin()))
  with check ((select public.is_active_admin()));

create policy "Admins can read content activity"
  on public.content_activity for select to authenticated
  using ((select public.is_active_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'nawasena-content',
  'nawasena-content',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins can read content images"
  on storage.objects for select to authenticated
  using (bucket_id = 'nawasena-content' and (select public.is_active_admin()));
create policy "Public can read images linked to published content"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'nawasena-content'
    and (
      exists (select 1 from public.menu_items where image_path = name and is_published)
      or exists (select 1 from public.gallery_items where image_path = name and is_published)
      or exists (
        select 1 from public.promotions_events
        where image_path = name and is_published and is_active
      )
      or exists (select 1 from public.testimonials where image_path = name and is_published)
    )
  );
create policy "Admins can upload content images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'nawasena-content'
    and (select public.is_active_admin())
    and (storage.foldername(name))[1] in ('menu', 'gallery', 'promotions', 'testimonials')
  );
create policy "Admins can update content images"
  on storage.objects for update to authenticated
  using (bucket_id = 'nawasena-content' and (select public.is_active_admin()))
  with check (
    bucket_id = 'nawasena-content'
    and (select public.is_active_admin())
    and (storage.foldername(name))[1] in ('menu', 'gallery', 'promotions', 'testimonials')
  );
create policy "Admins can delete content images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'nawasena-content' and (select public.is_active_admin()));
