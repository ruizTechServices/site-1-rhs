# Architecture

## Current Runtime Architecture

The current runtime is a minimal Next.js App Router scaffold with the first Supabase Auth/Profile/Role backend foundation. It still exposes only one public page, but it now includes auth route handlers, Supabase client helpers, migrations, and generated database types.

Implemented runtime pieces:

- `app/layout.tsx`: root metadata, Geist fonts, and global stylesheet import.
- `app/page.tsx`: static public architecture/status page.
- `app/auth/callback/route.ts`: Supabase PKCE/OAuth callback that exchanges an auth code for a cookie-backed session.
- `app/auth/sign-out/route.ts`: POST-only Supabase sign-out route.
- `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`: baseline route states.
- `proxy.ts`: request boundary for Supabase session refresh when public Supabase env vars are configured.
- `app/globals.css`: Tailwind v4 theme tokens, semantic colors, radius scale, and global focus behavior.
- `components/ui/*`: shadcn-style editable primitives for buttons, cards, badges, form controls, and empty states.
- `components/shared/*`: public shell, current-state status panel, and implementation phase grid.
- `lib/supabase/*`: typed Supabase browser/server clients, request proxy helper, env config, and generated database types.
- `lib/auth/*`: current auth lookup, profile lookup, trusted role lookup, and same-origin redirect sanitation.
- `lib/project/architecture-plan.ts`: static current-state and roadmap data.
- `lib/utils.ts`: `cn()` class composition helper.
- `supabase/migrations/*`: forward-only Phase 3 migrations applied to the live Supabase project.

There are still no protected product pages, sign-in UI, service-request workflow, Square integration, dedicated test runner, Vercel project link, or GitHub remote.

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
app/                    public route, auth route handlers, route states
components/ui/          initial editable UI primitives
components/shared/      public shell and status display
lib/auth/               auth state, profile, role, and redirect helpers
lib/supabase/           Supabase clients, proxy, config, generated DB types
lib/project/            static architecture-phase data
lib/utils.ts            shared class-name utility
supabase/migrations/    applied Phase 3 database migrations
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
| `role_assignments` | Trusted role source for `customer`, `handyman`, `admin` | Enabled | `select` only |
| `customer_profiles` | Customer profile extension, not an authorization source | Enabled | `select`, `insert`, `update` |
| `handyman_profiles` | Handyman profile extension, not an authorization source | Enabled | `select`, `insert`, `update` |

Important database boundaries:

- `anon` has no table grants on the Phase 3 tables.
- Authenticated users can only access their own rows through RLS policies using `auth.uid()`.
- Authenticated users cannot self-insert, update, or delete `role_assignments`.
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

Supabase Auth is now the implemented provider foundation. The code supports cookie-backed SSR clients, OAuth/PKCE callback exchange, sign-out, and trusted role lookup from `role_assignments`.

Current implemented auth files:

```text
proxy.ts
app/auth/callback/route.ts
app/auth/sign-out/route.ts
lib/supabase/config.ts
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/proxy.ts
lib/supabase/database.types.ts
lib/auth/session.ts
lib/auth/profile.ts
lib/auth/roles.ts
lib/auth/redirects.ts
lib/auth/types.ts
```

The architecture requires:

- A central profile linked to the authentication provider user ID.
- Trusted server-side role lookup.
- Separate customer, handyman, and administrator authorization paths.
- Ownership checks for user-owned resources.
- RLS for Supabase-exposed user tables.

Support or operations roles are possible later but are not approved for broad admin access.

Still missing:

- Sign-in/register UI.
- Protected customer, handyman, and admin route shells.
- Browser OAuth verification.
- Automated RLS and IDOR/BOLA tests.
- Admin service-role boundary for operational role assignment.

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

No application logging layer exists yet. Structured logging should be introduced with the first server-side workflow that performs auth, data writes, payment operations, or sensitive state transitions.

## Figma Architecture Artifacts

- Planning/design-system node: https://www.figma.com/design/0I1Bwb1F0NpYbvXCDU2xk3/Ruiz-Home-Services---Website-Plan-and-Design-System-v0?node-id=3-2&t=BkJ1yzqvFFq3D3cQ-1
- Flowchart board: https://www.figma.com/board/khKj0SwtkVYeXWajCPaWjO

The Figma planning node was synchronized with the Phase 3 backend foundation state on 2026-07-10. It documents current state, approved target direction, and blocked decisions. It does not represent completed customer, handyman, admin, service-request, or payment screens.
