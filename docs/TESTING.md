# Testing

## Current Test Surface

The project currently has a minimal Next.js scaffold, a Phase 3 Supabase Auth/Profile/Role foundation, Google OAuth and magic-link login UI, first-login customer/handyman role selection, server-only admin UUID gating, protected route shells, and no dedicated test runner. Validation is limited to static checks, the auth-route verifier, production build, Supabase advisor/schema inspection, HTTP smoke checks, and browser rendering checks.

## Planning Artifact Reference

Use the synchronized Figma planning node when checking that route inventory, component inventory, and implementation phase status match the maintained docs:

```text
https://www.figma.com/design/0I1Bwb1F0NpYbvXCDU2xk3/Ruiz-Home-Services---Website-Plan-and-Design-System-v0?node-id=3-2&t=BkJ1yzqvFFq3D3cQ-1
```

## Available Commands

Run from the project root:

```powershell
npm run typecheck
npm run test:auth-routes
npm run test:logging
npm run lint
npm run build
```

Current scripts:

- `npm run typecheck`: runs `tsc --noEmit`.
- `npm run test:auth-routes`: verifies the Phase 3 auth route files still contain the expected server-side guards.
- `npm run test:logging`: verifies the structured logging layer and key request/auth/error surfaces are instrumented.
- `npm run lint`: runs `eslint . --max-warnings=0`.
- `npm run build`: runs `next build`.
- `npm run dev`: starts the local development server.

Supabase backend checks used during Phase 3:

- Supabase table inventory for `public.profiles`, `public.role_assignments`, `public.customer_profiles`, and `public.handyman_profiles`.
- Supabase security advisors.
- Supabase performance advisors.
- SQL inspection of RLS policies, table grants, trigger presence, function execute grants, and migration history.
- SQL inspection of `public.claim_initial_app_role()` before applying the first-login role claim migration.

## Manual Runtime Check

PowerShell:

```powershell
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Then open:

```text
http://127.0.0.1:3000
```

Expected result:

- Homepage renders the scaffold/status page.
- `/login` renders Google OAuth and magic-link verification controls.
- `/account`, `/customer`, `/handyman`, and `/admin` return request-boundary redirects to `/login?next=...` for unauthenticated users.
- Copy clearly states that auth verification shells exist but customer requests, role dashboards, jobs, and payments are not live.
- Mobile width does not horizontally overflow.
- Unknown routes return the project not-found page with HTTP 404.

Stop the dev server with `Ctrl+C` when finished.

## Logging and HTTP 431 Diagnostics

The app emits structured JSON logs to the server console. Set `LOG_LEVEL=debug` in local env only when a detailed trace is needed.

Current logged surfaces:

- Proxy request start and completion.
- Request IDs propagated through `x-request-id`.
- Aggregate request header bytes.
- Aggregate cookie header bytes.
- Cookie count and largest cookie names by byte length.
- Supabase claims lookup failures.
- Protected-route login redirects.
- Google OAuth and magic-link start/success/failure events.
- OAuth callback exchange success/failure.
- Sign-out success/failure and same-origin rejection.
- Profile and role lookup failures.
- Client error-boundary render events.

HTTP 431 usually means the browser sent request headers that were too large. In local auth testing, the most likely cause is accumulated or oversized `localhost:3000` cookies. If `/account` shows `HTTP ERROR 431` before the app logs `request.proxy.start`, the request was rejected before application code could run.

Local recovery steps:

```powershell
# Browser-side manual step:
# Chrome DevTools -> Application -> Storage -> Cookies -> http://localhost:3000 -> delete local cookies.

# Then restart or reload the existing dev server page and inspect terminal logs:
# Look for event=request.headers.near_limit or large cookie summaries.
```

Do not paste raw cookie values into issues, docs, screenshots, or logs. The app logs only aggregate cookie sizes and cookie names for diagnosis.

## Manual Supabase Auth Check

Create `.env.local` from `.env.example` and set real values:

```powershell
Copy-Item .env.example .env.local
```

Required values:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL
RHS_ADMIN_USER_IDS
```

Manual checks still required before treating Phase 3 as complete:

- Apply `supabase/migrations/20260710231035_phase3_claim_initial_app_role.sql` to the linked project after reviewing the SQL.
- Restart `npm run dev` after setting `RHS_ADMIN_USER_IDS`; Next.js must reload server-only env before `/admin` can use it.
- Confirm Supabase Auth has the Google provider enabled with the correct Google OAuth client ID and secret.
- Confirm the Google OAuth client allows `https://csmisxwwrcyzttvybnsn.supabase.co/auth/v1/callback`.
- Confirm Supabase Auth URL configuration allows `http://localhost:3000/auth/callback` and the future production callback URL.
- Confirm `/login` can start a Google OAuth redirect and return through `/auth/callback`.
- Confirm `/login` can request a Supabase magic link.
- Confirm the magic link redirects to `/auth/callback`.
- Confirm a successful callback creates a Supabase session cookie and redirects to `/account`.
- Confirm the `auth.users` trigger creates a matching `profiles` row.
- Confirm a signed-in user with no role sees the exact prompt `Are you a Homeowner, or a Handyman?`.
- Confirm selecting Homeowner creates a `customer` role assignment and a `customer_profiles` row for that user only.
- Confirm selecting Handyman creates a `handyman` role assignment and a `handyman_profiles` row for that user only.
- Confirm selecting a role twice fails without creating a second role.
- Confirm `/auth/sign-out` clears the session through a POST request.
- Confirm `/customer` and `/handyman` deny a signed-in user without the matching trusted role assignment.
- Confirm `/admin` allows only a user whose Supabase Auth UUID is listed in server-only `RHS_ADMIN_USER_IDS`.
- Confirm `/admin` does not depend on Google email and does not allow access from a database `admin` role alone.
- Confirm a signed-in user can read only their own `profiles`, `customer_profiles`, `handyman_profiles`, and `role_assignments` rows.
- Confirm authenticated users cannot directly self-insert or update `role_assignments`.
- Confirm anonymous users have no direct table access.

## Future Required Tests

Before implementing dependent product features, add automated coverage for:

- Authenticated and anonymous route access.
- Trusted role lookup.
- Customer, handyman, and admin authorization paths.
- First-login role claim success, duplicate-claim denial, and admin-exclusion behavior.
- Cross-user ownership denial.
- Supabase RLS insert, select, update, and delete behavior.
- Service-request validation.
- Job assignment authorization and state transitions.
- Integer-cent pricing calculations.
- Square idempotency and webhook signature verification.

Payment tests must use Square sandbox only until production payment activation is explicitly approved.
