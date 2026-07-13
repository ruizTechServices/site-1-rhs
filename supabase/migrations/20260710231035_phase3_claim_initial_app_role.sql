create or replace function public.claim_initial_app_role(requested_role public.app_role)
returns public.app_role
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  existing_role_count integer;
begin
  if current_user_id is null then
    raise exception 'authentication is required to claim an initial role'
      using errcode = '28000';
  end if;

  if requested_role not in (
    'customer'::public.app_role,
    'handyman'::public.app_role
  ) then
    raise exception 'requested role is not self-assignable'
      using errcode = '22023';
  end if;

  insert into public.profiles (id)
  values (current_user_id)
  on conflict (id) do nothing;

  perform 1
  from public.profiles
  where id = current_user_id
  for update;

  select count(*)
  into existing_role_count
  from public.role_assignments
  where user_id = current_user_id;

  if existing_role_count > 0 then
    raise exception 'initial role has already been claimed'
      using errcode = 'P0001';
  end if;

  insert into public.role_assignments (user_id, role, assigned_by)
  values (current_user_id, requested_role, null);

  if requested_role = 'customer'::public.app_role then
    insert into public.customer_profiles (user_id)
    values (current_user_id)
    on conflict (user_id) do nothing;
  end if;

  if requested_role = 'handyman'::public.app_role then
    insert into public.handyman_profiles (user_id)
    values (current_user_id)
    on conflict (user_id) do nothing;
  end if;

  return requested_role;
end;
$$;

comment on function public.claim_initial_app_role(public.app_role)
is 'Allows an authenticated user with no existing role assignments to claim exactly one initial customer or handyman role. Admin is intentionally excluded.';

revoke all on function public.claim_initial_app_role(public.app_role) from public;
revoke all on function public.claim_initial_app_role(public.app_role) from anon;
grant execute on function public.claim_initial_app_role(public.app_role) to authenticated;
