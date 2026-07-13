# Server Only Admin UUID Gate

The server-only admin UUID gate is the current administrator authorization boundary. It lives in `lib/auth/admin.ts` and intentionally does not depend on Google email, browser state, client metadata, or a database `admin` role assignment. The helper reads `RHS_ADMIN_USER_IDS`, splits comma-separated values, lowercases them, validates UUID shape, logs invalid entries, deduplicates valid IDs, and checks the authenticated Supabase user ID against that allowlist. `requireConfiguredAdminForPath()` first resolves current auth through Supabase claims. If no user is present, it redirects to `/login?next=/admin`. If the authenticated user is not configured, it redirects to `/account?authorization=missing-admin`. If allowed, it logs an admin access event with a masked user ID. `app/admin/page.tsx` calls this helper before rendering the admin shell. That page is still a verification surface, not an operations dashboard. Role assignment, payment review, dispute handling, and privileged data mutation are blocked. This gate is a pragmatic temporary control for a solo project because it avoids trusting mutable profile data while admin role-management workflows are unresolved. Its main tradeoff is operational: every environment must have the correct Supabase Auth UUID values configured server-side, and changing admins requires env management and server restart or redeploy. Future admin mutations need stronger design: service-role boundaries, audit logs, possible reauthentication, and RLS-aware tests. This note should link to role foundations, but admin access remains deliberately separate from customer and handyman self-assignment. If admin pages later read broad user or payment records, this gate must be paired with server-only data access functions and durable audit events. UUID values are identifiers, not shared secrets.

***
**System Dependencies & Connections:**
- [[Supabase Auth Start And Callback Flow]]
- [[Supabase Profile Role RLS Foundation]]
- [[Role Protected Route Shells]]

Word Count: 250
