# Role Protected Route Shells

The role protected route shells are server-rendered verification pages for customer, handyman, admin, and account boundaries. `/account` requires an authenticated Supabase claims subject, loads the current user's profile and role assignments through RLS-backed helpers, displays effective roles, and shows the first-login customer or handyman choice when no non-admin role exists. `/customer` calls `requireCurrentUserRoleForPath("customer", "/customer")` before rendering. `/handyman` does the same for `handyman`. `/admin` uses `requireConfiguredAdminForPath("/admin")` instead of trusting a database role. The shared `ProtectedRouteShell` component renders consistent security-boundary copy, role badges, navigation back to account, and child cards that explain what is intentionally blocked. The key architectural choice is that route pages call server-side authorization helpers before presentation. The shared shell does not perform security; it only communicates the result after checks complete. The data flow is claims to user ID, user ID to profile and role rows, role decision to page render or redirect. Missing auth routes to `/login`; missing role routes to `/account` with a structured authorization marker. These pages should not accumulate business logic as the product grows. Future customer request intake, handyman job acceptance, and admin operations should move into domain modules, Server Actions, route handlers, and feature-specific components. The shells exist to prove boundaries before sensitive workflows are built. Their main failure risk is false confidence: rendering a protected shell does not prove ownership checks, RLS tests, payment safety, or final product readiness. Static verification scripts should keep these guard calls from disappearing during future UI iteration. Browser checks should verify redirects and rendered copy.

***
**System Dependencies and Connections:**
- [[Supabase Request Proxy Boundary]]
- [[Supabase Profile Role RLS Foundation]]
- [[Server Only Admin UUID Gate]]

Word Count: 250
