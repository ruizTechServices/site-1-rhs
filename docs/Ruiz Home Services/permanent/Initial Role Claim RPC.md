# Initial Role Claim RPC

The initial role claim RPC is the only implemented self-service role mutation. The migration `20260710231035_phase3_claim_initial_app_role.sql` defines `public.claim_initial_app_role(requested_role public.app_role)` as a `SECURITY DEFINER` function with an empty search path. It first requires `auth.uid()`, then accepts only `customer` or `handyman`; `admin` is intentionally excluded. The function inserts a profile row for the current user if missing, locks that profile row with `for update`, counts existing role assignments for the user, and rejects the claim if any role already exists. A successful claim inserts one `role_assignments` row with `assigned_by` set to null and creates the matching `customer_profiles` or `handyman_profiles` extension row. Execute permission is revoked from public and anonymous users and granted only to authenticated users. `app/account/actions.ts` is the application caller. It validates the submitted role against `SELF_ASSIGNABLE_ROLES`, requires current auth for `/account`, blocks configured admin UUIDs from using customer or handyman self-selection, calls the RPC, revalidates affected paths, and redirects to the matching route shell. This design handles first-login convenience without allowing arbitrary client role writes. The downstream dependency is strong: `/customer` and `/handyman` trust `role_assignments`, so this function must remain narrow. The unresolved risk is deployment state. The repository contains the migration, but maintained docs still say it must be applied and browser-tested before Phase 3 is complete. Race handling depends on the profile row lock and unique role constraint; tests should cover duplicate submissions, invalid role values, anonymous calls, and configured admin attempts. Future role changes need admin workflows, not broader self-service. Operational logs should distinguish invalid input from database rejection.

***
**System Dependencies and Connections:**
- [[Supabase Profile Role RLS Foundation]]
- [[Role Protected Route Shells]]
- [[Server Only Admin UUID Gate]]

Word Count: 251
