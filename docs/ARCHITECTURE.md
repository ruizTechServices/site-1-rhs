# Architecture

## Current Runtime Architecture

The current runtime is a minimal Next.js App Router scaffold with the first Supabase Auth/Profile/Role foundation. It exposes one public status page, one auth verification page, protected account and role shells, auth route handlers, Supabase client helpers, migrations, and generated database types.

Implemented runtime pieces:

- `app/layout.tsx`: root metadata, Geist fonts, and global stylesheet import.
- `app/page.tsx`: static public architecture/status page.
- `app/login/page.tsx`: Supabase Google OAuth and magic-link verification UI.
- `app/login/actions.ts`: server actions that validate same-origin redirect targets before starting Google OAuth or requesting a Supabase magic link; auth-start failures are logged with sanitized structured details.
- `app/account/page.tsx`: authenticated account shell loaded through verified Supabase claims and RLS-backed profile/role queries, with first-login customer/handyman role selection when no role exists.
- `app/account/actions.ts`: server action that calls the constrained Supabase role-claim RPC for `customer` or `handyman` only.
- `app/customer/page.tsx`: customer-role protected route shell.
- `app/handyman/page.tsx`: handyman-role protected route shell.
- `app/admin/page.tsx`: admin protected route shell gated by server-only Supabase Auth UUID allowlist.
- `app/auth/callback/route.ts`: Supabase PKCE/OAuth callback that exchanges an auth code for a cookie-backed session.
- `app/auth/sign-out/route.ts`: POST-only Supabase sign-out route with same-origin POST guard when an Origin header is present.
- `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`: baseline route states.
- `proxy.ts`: request boundary for Supabase session refresh and unauthenticated redirects on protected route prefixes.
- `app/globals.css`: Tailwind v4 theme tokens, semantic colors, radius scale, and global focus behavior.
- `components/ui/*`: shadcn-style editable primitives for buttons, cards, badges, form controls, and empty states.
- `components/shared/*`: session-aware public shell, current-state status panel, protected-route shell, and implementation phase grid.
- `lib/logging/*`: structured JSON logging, redaction, request/cookie/header summaries, auth log helpers, and request ID helpers.
- `lib/supabase/*`: typed Supabase browser/server clients, request proxy helper, env config, and generated database types.
- `lib/auth/*`: current auth lookup, profile lookup, trusted role lookup, server-only admin UUID allowlist, and same-origin redirect sanitation.
- `lib/supabase/proxy.ts`: Supabase session refresh plus request-boundary auth guard for `/account`, `/customer`, `/handyman`, and `/admin`.
- `lib/project/architecture-plan.ts`: static current-state and roadmap data.
- `lib/utils.ts`: `cn()` class composition helper.
- `scripts/verify-auth-routes.mjs`: static Phase 3 auth-route guard verifier.
- `supabase/migrations/*`: forward-only Phase 3 migrations; the first-login role-claim RPC migration is present in the repository but still pending application to the linked project.

There are still no real product dashboards, service-request workflow, Square integration, dedicated test runner, or Vercel project link. Git is initialized on `main` with GitHub remote `https://github.com/ruizTechServices/site-1-rhs.git`.

## Approved Target Direction

The project contract in `AGENTS.md` approves the following direction:

- Application framework: Next.js with App Router.
- Language: TypeScript.
- Styling: Tailwind CSS.
- Component system: shadcn/ui editable source components.
- Database and auth direction: Supabase PostgreSQL and Supabase Auth unless a different provider is explicitly approved.
- Payments: Square APIs.
- Hosting: Vercel first; separate services only when justified.
- Market: New York City.

The scaffold implements only the Next.js, TypeScript, Tailwind, and shadcn-style design-foundation portion of this direction.

## Planned Application Boundaries

The implementation should continue evolving toward these boundaries only when the code needs them:

```text
app/                    Next.js routes, layouts, route handlers
components/ui/          shadcn/ui primitives
components/shared/      cross-feature presentation components
features/auth/          authentication UI and flows
features/service-requests/
features/jobs/
features/payments/
features/admin/
lib/auth/               trusted auth and authorization helpers
lib/db/                 database clients, queries, mappers
lib/payments/           Square adapter and payment domain logic
lib/validation/         shared validation schemas
lib/errors/             typed application errors
lib/logging/            structured logging utilities
supabase/               migrations, seed, local config, tests
docs/                   maintained documentation
tests/                  tests when not colocated
```

Do not perform a large folder migration for its own sake. Add these boundaries as implementation requires them.

Current implemented boundaries:

```text
app/                    public route, auth UI, protected route shells, auth route handlers, route states
components/ui/          initial editable UI primitives
components/shared/      session-aware public shell, protected-route shell, and status display
lib/auth/               auth state, profile, role, and redirect helpers
lib/logging/            structured logging, redaction, request IDs, request-size diagnostics
lib/supabase/           Supabase clients, proxy, config, generated DB types
lib/project/            static architecture-phase data
lib/utils.ts            shared class-name utility
supabase/migrations/    forward-only Phase 3 migrations, including one pending role-claim RPC migration
docs/                   maintained documentation
```

## Supabase Database Foundation

Target project:

```text
Ruiz Home Services
Project ref: csmisxwwrcyzttvybnsn
Region: us-east-1
Project URL: https://csmisxwwrcyzttvybnsn.supabase.co
```

Implemented public tables:

| Table | Purpose | RLS status | Authenticated grants |
|---|---|---|---|
| `profiles` | One row per Supabase Auth user | Enabled | `select`, `insert`, `update` |
| `role_assignments` | Trusted role source for customer/handyman route shells and future role history | Enabled | `select` only |
| `customer_profiles` | Customer profile extension, not an authorization source | Enabled | `select`, `insert`, `update` |
| `handyman_profiles` | Handyman profile extension, not an authorization source | Enabled | `select`, `insert`, `update` |

Important database boundaries:

- `anon` has no table grants on the Phase 3 tables.
- Authenticated users can only access their own rows through RLS policies using `auth.uid()`.
- Authenticated users cannot directly insert, update, or delete `role_assignments`.
- Authenticated users with no existing role can claim exactly one initial `customer` or `handyman` role through `public.claim_initial_app_role()` after the migration is applied.
- The role-claim RPC excludes `admin`, creates the matching customer or handyman profile extension, and is the only approved self-service role mutation.
- `/admin` does not trust Google email and does not trust a database `admin` role alone. It requires the authenticated Supabase user UUID to appear in server-only `RHS_ADMIN_USER_IDS`.
- `app_private.handle_new_auth_user()` creates profile rows from `auth.users` inserts.
- `app_private` is not an exposed API schema.
- The previous `public.rls_auto_enable()` advisor warning was resolved by revoking external execute grants.
- No service-role application code exists yet.

## Data Flow Principles

- Browser input is untrusted.
- Server-side validation is authoritative.
- Payment amounts must be calculated from trusted server or database records.
- Money must use integer minor units.
- Ownership checks must happen server-side and, when Supabase is used, be backed by RLS.
- Client-side route hiding is not authorization.

## Authentication and Authorization

Supabase Auth is now the implemented provider foundation. The code supports cookie-backed SSR clients, Google OAuth start, magic-link request UI, OAuth/PKCE callback exchange, sign-out, authenticated account rendering, session-aware navigation, trusted customer/handyman role lookup from `role_assignments`, first-login role selection, and server-only admin UUID gating.

Current implemented auth files:

```text
proxy.ts
app/auth/callback/route.ts
app/auth/sign-out/route.ts
app/login/actions.ts
app/login/page.tsx
app/account/page.tsx
app/account/actions.ts
app/customer/page.tsx
app/handyman/page.tsx
app/admin/page.tsx
lib/supabase/config.ts
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/proxy.ts
lib/supabase/database.types.ts
lib/auth/session.ts
lib/auth/profile.ts
lib/auth/roles.ts
lib/auth/admin.ts
lib/auth/redirects.ts
lib/auth/types.ts
```

The architecture requires:

- A central profile linked to the authentication provider user ID.
- Trusted server-side role lookup.
- Server-only admin UUID allowlist through `RHS_ADMIN_USER_IDS`.
- Separate customer, handyman, and administrator authorization paths.
- Ownership checks for user-owned resources.
- RLS for Supabase-exposed user tables.

Support or operations roles are possible later but are not approved for broad admin access.

Still missing:

- Applying the `claim_initial_app_role` migration to the linked Supabase project.
- Supabase Dashboard Google provider configuration verification.
- Browser magic-link/OAuth and role-selection verification.
- Automated RLS and IDOR/BOLA tests.
- Admin service-role boundary for operational role assignment, if future role management is approved.
- Final customer, handyman, and admin product workflows.

## Payment Architecture

No payment code currently exists.

Square is the approved payment processor direction, but these product decisions are unresolved:

- Deposit, authorization, full prepayment, post-service payment, or a combination.
- Final amount adjustment policy.
- Materials, taxes, tips, cancellation, and no-show policy.
- Handyman payout model and schedule.
- Merchant-of-record responsibility.

No payment UI, Square route handler, webhook handler, or payout system should be implemented as final until those decisions are settled.

## Deployment Architecture

The app builds locally with Next.js 16.2.10, but it is not linked to a Vercel project. Deployment remains blocked until the Vercel project target and environment-variable strategy are confirmed.

## Observability and Logging

The app now has a dependency-free structured JSON logging layer under `lib/logging/`.

Implemented logging surfaces:

- `lib/logging/logger.ts`: level-gated JSON event logger controlled by optional `LOG_LEVEL`.
- `lib/logging/redaction.ts`: recursive redaction for emails, tokens, JWT-like values, secrets, raw cookie headers, and authorization headers.
- `lib/logging/request.ts`: request ID generation, `x-request-id` response propagation, request path/method metadata, aggregate header byte counts, cookie byte counts, cookie counts, and largest cookie-name/size summaries.
- `lib/logging/auth.ts`: auth-specific helpers for masked user IDs and sanitized provider/session errors.
- `lib/supabase/proxy.ts`: request start/complete logs, protected-route redirect logs, Supabase claims failures, cookie refresh logs, and large-header/large-cookie warnings for HTTP 431 diagnosis.
- `app/login/actions.ts`: Google OAuth and magic-link start/success/failure logs.
- `app/auth/callback/route.ts`: OAuth callback start, missing-code, exchange-success, and exchange-failure logs.
- `app/auth/sign-out/route.ts`: sign-out start, same-origin rejection, success, and failure logs.
- `lib/auth/session.ts`, `lib/auth/profile.ts`, and `lib/auth/roles.ts`: session resolution, required-auth redirects, profile lookups, role lookups, and role-denial logs.
- `app/error.tsx`: browser error-boundary log with digest and path.

Sensitive values must not be logged. Raw cookies, authorization headers, OAuth codes, email addresses, tokens, service-role keys, API keys, and secrets are redacted or excluded. Cookie values are never logged; only aggregate sizes and cookie names are used for diagnosing oversized request headers.

HTTP 431 note: if the browser or Next.js rejects a request before the proxy executes, no app log can be emitted for that request. In that case, clear localhost cookies for `localhost:3000` and retry, then inspect the next proxy logs for `request.headers.near_limit`.

## Figma Architecture Artifacts

- Planning/design-system node: https://www.figma.com/design/0I1Bwb1F0NpYbvXCDU2xk3/Ruiz-Home-Services---Website-Plan-and-Design-System-v0?node-id=3-2&t=BkJ1yzqvFFq3D3cQ-1
- Flowchart board: https://www.figma.com/board/khKj0SwtkVYeXWajCPaWjO

The Figma planning node was synchronized with the Phase 3 first-login role selection and UUID-admin state on 2026-07-10. It documents current state, approved target direction, and blocked decisions. It does not represent completed customer, handyman, admin, service-request, or payment screens.
