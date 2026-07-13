# Supabase Profile Role RLS Foundation

The Supabase profile and role RLS foundation is the current trusted identity data model. The migration `20260710145632_phase3_auth_profiles_roles.sql` creates `profiles`, `role_assignments`, `customer_profiles`, and `handyman_profiles`, plus the `app_role` enum with `customer`, `handyman`, and `admin`. `profiles` is one row per Supabase Auth user and is populated by the private trigger function `app_private.handle_new_auth_user()` after `auth.users` inserts. `role_assignments` is the trusted role source for route authorization. The customer and handyman profile tables are extensions, not authorization sources. RLS is enabled on all four public tables. Authenticated users can select, insert, and update only their own profile extension rows, can select only their own role assignments, and cannot directly insert, update, or delete `role_assignments`. Anonymous users have no grants on these tables. Later migrations tighten grants, set private trigger search paths, and add a partial index for `assigned_by`. The application reads this model through `lib/auth/profile.ts` and `lib/auth/roles.ts`, using the current Supabase claims subject as the lookup key. This creates two defensive layers: application helpers perform server-side checks, and database policies restrict direct data access. The main missing proof is automated RLS and IDOR testing for anonymous, same-user, cross-user, customer, handyman, admin, and service-role cases. Until those tests exist and pass, the model should be treated as a strong foundation, not a fully verified authorization system. Future service request, job, payment, review, and support tables should copy this ownership-first posture: database policy must back server checks, not merely mirror navigation state. Migration history is part of the security evidence. Policy names should remain descriptive for future audits.

***
**System Dependencies & Connections:**
- [[Supabase Server Client Boundary]]
- [[Initial Role Claim RPC]]
- [[Role Protected Route Shells]]

Word Count: 250
