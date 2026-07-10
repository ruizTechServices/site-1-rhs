create or replace function app_private.set_updated_at()
returns trigger
language plpgsql
set search_path = app_private, public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function app_private.set_updated_at() from public, anon, authenticated;
