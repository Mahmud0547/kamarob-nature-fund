-- Kamarob platform schema. Every table has Row Level Security; roles are checked by the helper functions below.
--
-- Roles:  member      confirmed account: member news, documents and chat
--         editor      + writes news and documents
--         admin       + manages members, reads the contact inbox, manages channels
--         demo_admin  shared public login: sees the admin panel, cannot change anything,
--                     and sees only sample people and messages (never real visitors' data)

create type public.member_role as enum ('member', 'editor', 'admin', 'demo_admin');
create type public.member_status as enum ('pending', 'active', 'blocked');
create type public.visibility as enum ('public', 'members');
create type public.post_status as enum ('draft', 'published');
create type public.post_kind as enum ('news', 'announcement');

-- Organisation settings (one row).
create table public.settings (
  id boolean primary key default true check (id),
  auto_approve boolean not null default true -- the public demo activates accounts as soon as the email is confirmed
);
insert into public.settings default values;
alter table public.settings enable row level security;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 100),
  role public.member_role not null default 'member',
  status public.member_status not null default 'pending',
  locale text not null default 'en' check (locale in ('en', 'ru', 'tj')),
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- ---------------------------------------------------------------------------
-- Helpers. SECURITY DEFINER so policies on profiles can call them without recursion.

create function public.my_role() returns public.member_role
language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = auth.uid() and status = 'active'
$$;

create function public.is_member() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
$$;

create function public.can_edit() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.my_role() in ('editor', 'admin'), false)
$$;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.my_role() = 'admin', false)
$$;

create function public.can_view_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.my_role() in ('editor', 'admin', 'demo_admin'), false)
$$;

create function public.is_demo_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.my_role() = 'demo_admin', false)
$$;

-- ---------------------------------------------------------------------------
-- Accounts

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, locale)
  values (
    new.id,
    coalesce(left(new.raw_user_meta_data ->> 'full_name', 100), ''),
    case when new.raw_user_meta_data ->> 'locale' in ('en', 'ru', 'tj') then new.raw_user_meta_data ->> 'locale' else 'en' end
  );
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- When an email is confirmed and the organisation auto-approves, the account becomes active.
create function public.handle_user_confirmed() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if old.email_confirmed_at is null and new.email_confirmed_at is not null
     and (select auto_approve from public.settings) then
    update public.profiles set status = 'active' where id = new.id and status = 'pending';
  end if;
  return new;
end $$;

create trigger on_auth_user_confirmed after update of email_confirmed_at on auth.users
  for each row execute function public.handle_user_confirmed();

create policy "profiles: own row" on public.profiles for select using (id = auth.uid());
create policy "profiles: members see each other" on public.profiles for select
  using (public.is_member() and not public.is_demo_admin() and status = 'active');
create policy "profiles: staff see everyone" on public.profiles for select using (public.can_edit());
create policy "profiles: demo admin sees samples" on public.profiles for select using (public.is_demo_admin() and is_sample);
create policy "profiles: update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- People may change only their name and language; role and status change through set_member().
revoke update on public.profiles from authenticated, anon;
grant update (full_name, locale) on public.profiles to authenticated;

create function public.set_member(target uuid, new_role public.member_role, new_status public.member_status) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Only admins can change members' using errcode = '42501'; end if;
  if target = auth.uid() then raise exception 'Admins cannot change their own role' using errcode = '42501'; end if;
  if new_role = 'demo_admin' then raise exception 'The demo role is assigned by the owner only' using errcode = '42501'; end if;
  update public.profiles set role = new_role, status = new_status where id = target;
end $$;
revoke execute on function public.set_member from anon;

-- ---------------------------------------------------------------------------
-- News and announcements. Texts are stored per language: {"en": "...", "ru": "...", "tj": "..."}.

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 80),
  kind public.post_kind not null default 'news',
  title jsonb not null check (jsonb_typeof(title) = 'object' and title ? 'en'),
  summary jsonb not null default '{}' check (jsonb_typeof(summary) = 'object'),
  body jsonb not null default '{}' check (jsonb_typeof(body) = 'object'),
  cover_path text,
  tags text[] not null default '{}',
  visibility public.visibility not null default 'public',
  status public.post_status not null default 'draft',
  is_sample boolean not null default false,
  published_at timestamptz,
  author_id uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_published on public.posts (status, published_at desc);
alter table public.posts enable row level security;

create policy "posts: published for their audience" on public.posts for select
  using (status = 'published' and (visibility = 'public' or public.is_member()));
create policy "posts: staff see all" on public.posts for select using (public.can_view_admin());
create policy "posts: editors write" on public.posts for insert with check (public.can_edit());
create policy "posts: editors update" on public.posts for update using (public.can_edit()) with check (public.can_edit());
create policy "posts: editors delete" on public.posts for delete using (public.can_edit());

create function public.touch_post() returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  if new.status = 'published' and new.published_at is null then new.published_at := now(); end if;
  return new;
end $$;
create trigger posts_touch before insert or update on public.posts for each row execute function public.touch_post();

-- ---------------------------------------------------------------------------
-- Documents. Files live in the private "documents" bucket; the row decides who may download.

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null check (jsonb_typeof(title) = 'object' and title ? 'en'),
  description jsonb not null default '{}' check (jsonb_typeof(description) = 'object'),
  file_path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes integer not null check (size_bytes between 1 and 20971520),
  visibility public.visibility not null default 'members',
  is_sample boolean not null default false,
  uploaded_by uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);
alter table public.documents enable row level security;

create policy "documents: for their audience" on public.documents for select
  using (visibility = 'public' or public.is_member());
create policy "documents: editors write" on public.documents for insert with check (public.can_edit());
create policy "documents: editors update" on public.documents for update using (public.can_edit());
create policy "documents: editors delete" on public.documents for delete using (public.can_edit());

-- ---------------------------------------------------------------------------
-- Contact form. Anyone can write; only admins read real messages, the demo admin reads samples.

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) <= 200 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text not null check (char_length(message) between 20 and 4000),
  handled boolean not null default false,
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;

create policy "contact: anyone can send" on public.contact_messages for insert to anon, authenticated
  with check (not is_sample and not handled);
create policy "contact: admins read" on public.contact_messages for select using (public.is_admin());
create policy "contact: demo admin reads samples" on public.contact_messages for select using (public.is_demo_admin() and is_sample);
create policy "contact: admins update" on public.contact_messages for update using (public.is_admin());

-- Simple flood protection: at most 20 messages from everyone in 10 minutes.
create function public.limit_contact() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.contact_messages where created_at > now() - interval '10 minutes') >= 20 then
    raise exception 'Too many messages, try again later' using errcode = '54000';
  end if;
  return new;
end $$;
create trigger contact_limit before insert on public.contact_messages for each row execute function public.limit_contact();

-- ---------------------------------------------------------------------------
-- Chat

create table public.channels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,40}$'),
  name jsonb not null check (jsonb_typeof(name) = 'object' and name ? 'en'),
  description jsonb not null default '{}',
  position integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.channels enable row level security;
create policy "channels: members and staff" on public.channels for select using (public.is_member());
create policy "channels: admins manage" on public.channels for all using (public.is_admin()) with check (public.is_admin());

create table public.messages (
  id bigint generated always as identity primary key,
  channel_id uuid not null references public.channels (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade default auth.uid(),
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);
create index messages_channel_time on public.messages (channel_id, created_at desc);
alter table public.messages enable row level security;

create policy "messages: read" on public.messages for select
  using (public.is_member() and (not public.is_demo_admin() or is_sample));
create policy "messages: members write as themselves" on public.messages for insert
  with check (public.is_member() and not public.is_demo_admin() and author_id = auth.uid() and not is_sample);
create policy "messages: delete own or admin" on public.messages for delete using (author_id = auth.uid() or public.is_admin());

alter publication supabase_realtime add table public.messages;

-- ---------------------------------------------------------------------------
-- Storage: "media" is public (cover images), "documents" is private (downloaded through signed URLs).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 20971520, array['application/pdf', 'image/jpeg', 'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
on conflict (id) do nothing;

create policy "media: editors upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.can_edit());
create policy "media: editors delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.can_edit());
create policy "documents: download if the document is visible" on storage.objects for select
  using (bucket_id = 'documents' and exists (
    select 1 from public.documents d where d.file_path = storage.objects.name
      and (d.visibility = 'public' or public.is_member())));
create policy "documents: editors upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and public.can_edit());
create policy "documents: editors delete" on storage.objects for delete to authenticated
  using (bucket_id = 'documents' and public.can_edit());

-- ---------------------------------------------------------------------------
-- Admin overview numbers in one call (respects the caller's visibility).

create function public.admin_overview() returns json
language plpgsql stable security invoker set search_path = '' as $$
begin
  if not public.can_view_admin() then raise exception 'Not allowed' using errcode = '42501'; end if;
  return json_build_object(
    'posts_published', (select count(*) from public.posts where status = 'published'),
    'posts_draft', (select count(*) from public.posts where status = 'draft'),
    'members_active', (select count(*) from public.profiles where status = 'active'),
    'members_pending', (select count(*) from public.profiles where status = 'pending'),
    'documents', (select count(*) from public.documents),
    'documents_members', (select count(*) from public.documents where visibility = 'members'),
    'messages_new', (select count(*) from public.contact_messages where not handled)
  );
end $$;
