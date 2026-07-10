create extension if not exists pgcrypto with schema extensions;

create schema if not exists app_private;
revoke all on schema app_private from public;
revoke all on schema app_private from anon;
revoke all on schema app_private from authenticated;

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end
$$;

alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

create type public.app_role as enum ('customer', 'handyman', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_length check (email is null or char_length(email) <= 320),
  constraint profiles_display_name_length check (
    display_name is null
    or char_length(trim(display_name)) between 1 and 120
  )
);

create table public.role_assignments (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  assigned_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint role_assignments_user_role_unique unique (user_id, role)
);

create table public.customer_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.handyman_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'User-owned profile rows linked one-to-one with Supabase Auth users.';
comment on table public.role_assignments is 'Trusted role assignments. Application clients may read their own roles but may not self-assign roles.';
comment on table public.customer_profiles is 'Customer-specific profile extension. This table is not an authorization source.';
comment on table public.handyman_profiles is 'Handyman-specific profile extension. This table is not an authorization source.';

create index role_assignments_user_id_idx on public.role_assignments (user_id);
create index role_assignments_role_idx on public.role_assignments (role);

create function app_private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function app_private.set_updated_at() from public, anon, authenticated;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function app_private.set_updated_at();

create trigger customer_profiles_set_updated_at
before update on public.customer_profiles
for each row
execute function app_private.set_updated_at();

create trigger handyman_profiles_set_updated_at
before update on public.handyman_profiles
for each row
execute function app_private.set_updated_at();

create function app_private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth, app_private
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')), '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    updated_at = now()
  where public.profiles.email is distinct from excluded.email;

  return new;
end;
$$;

revoke all on function app_private.handle_new_auth_user() from public, anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
      and tgrelid = 'auth.users'::regclass
  ) then
    execute 'create trigger on_auth_user_created after insert on auth.users for each row execute function app_private.handle_new_auth_user()';
  end if;
end
$$;

alter table public.profiles enable row level security;
alter table public.role_assignments enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.handyman_profiles enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "role_assignments_select_own"
on public.role_assignments
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "customer_profiles_select_own"
on public.customer_profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "customer_profiles_insert_own"
on public.customer_profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "customer_profiles_update_own"
on public.customer_profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "handyman_profiles_select_own"
on public.handyman_profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "handyman_profiles_insert_own"
on public.handyman_profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "handyman_profiles_update_own"
on public.handyman_profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke all on table public.profiles from anon;
revoke all on table public.role_assignments from anon;
revoke all on table public.customer_profiles from anon;
revoke all on table public.handyman_profiles from anon;

grant select, insert, update on table public.profiles to authenticated;
grant select on table public.role_assignments to authenticated;
grant select, insert, update on table public.customer_profiles to authenticated;
grant select, insert, update on table public.handyman_profiles to authenticated;

grant all on table public.profiles to service_role;
grant all on table public.role_assignments to service_role;
grant all on table public.customer_profiles to service_role;
grant all on table public.handyman_profiles to service_role;
