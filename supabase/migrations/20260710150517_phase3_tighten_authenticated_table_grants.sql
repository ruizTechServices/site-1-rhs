revoke all privileges on table public.profiles from anon, authenticated;
revoke all privileges on table public.role_assignments from anon, authenticated;
revoke all privileges on table public.customer_profiles from anon, authenticated;
revoke all privileges on table public.handyman_profiles from anon, authenticated;

grant select, insert, update on table public.profiles to authenticated;
grant select on table public.role_assignments to authenticated;
grant select, insert, update on table public.customer_profiles to authenticated;
grant select, insert, update on table public.handyman_profiles to authenticated;
