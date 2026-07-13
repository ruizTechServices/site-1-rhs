# Ruiz Home Services

Ruiz Home Services is planned as a New York City home-services marketplace built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Square, and Vercel.

## Current Status

As of the 2026-07-10 Phase 3 auth-boundary slice, this workspace has a minimal executable Next.js App Router scaffold, baseline planning documentation, and the first Supabase Auth/Profile/Role implementation. The implemented application surface is intentionally small:

- `/`: public architecture/status shell.
- `/login`: Supabase Google OAuth and magic-link verification UI.
- `/account`: authenticated account shell using server-verified Supabase claims, with first-login customer/handyman role selection for users without roles.
- `/customer`: customer-role protected route shell.
- `/handyman`: handyman-role protected route shell.
- `/admin`: admin protected route shell gated by a server-only Supabase user UUID allowlist.
- `/auth/callback`: Supabase PKCE/OAuth callback route handler.
- `/auth/sign-out`: POST-only Supabase sign-out route handler.
- `/_not-found`: framework not-found route with project-specific copy.
- Reusable UI foundation under `components/ui/`.
- Shared shell/status components under `components/shared/`.
- Static architecture phase data under `lib/project/`.
- Supabase client, server, proxy, auth, admin, profile, and role helpers under `lib/supabase/` and `lib/auth/`.
- Session-aware public navigation and static auth-route verifier under `scripts/verify-auth-routes.mjs`.
- Forward-only Supabase migrations under `supabase/migrations/`.

The live Supabase project is `Ruiz Home Services` (`csmisxwwrcyzttvybnsn`). It now has RLS-enabled `profiles`, `role_assignments`, `customer_profiles`, and `handyman_profiles` tables. Git is initialized on `main` with GitHub remote `https://github.com/ruizTechServices/site-1-rhs.git`.

There is still no completed browser-verified auth run, service-request workflow, Square integration, Vercel project link, or final role dashboard in this workspace.

Google OAuth now has an app-side start action, but it still depends on Supabase and Google provider configuration before it can complete end to end.

Admin authorization does not use Google email. The admin dashboard checks `RHS_ADMIN_USER_IDS`, a server-only comma-separated allowlist of Supabase Auth UUIDs. The local `.env` has been updated for Gio's current Supabase UUID; keep production and preview values configured separately.

Do not treat the protected route shells as product dashboards. They exist only to verify authentication and trusted role boundaries.

## Authoritative Instructions

Read `AGENTS.md` before making architectural, security, database, payment, authentication, or product-flow changes. It defines the confirmed business rules, unresolved decisions, implementation workflow, and documentation requirements.

## Planning Artifacts

- Figma design-system planning node: https://www.figma.com/design/0I1Bwb1F0NpYbvXCDU2xk3/Ruiz-Home-Services---Website-Plan-and-Design-System-v0?node-id=3-2&t=BkJ1yzqvFFq3D3cQ-1
- FigJam flowchart board: https://www.figma.com/board/khKj0SwtkVYeXWajCPaWjO
- Website implementation plan: `docs/WEBSITE_IMPLEMENTATION_PLAN.md`
- Architecture notes: `docs/ARCHITECTURE.md`
- Implementation log: `docs/IMPLEMENTATION_LOG.md`
- Testing guide: `docs/TESTING.md`

The Figma planning node was synchronized with the Phase 3 first-login role selection and UUID-admin state on 2026-07-10.

## Local Development

PowerShell:

```powershell
Get-ChildItem -Force
Get-ChildItem -Recurse -Force
npm install
npm run dev
```

Create `.env.local` before testing Supabase Auth flows:

```powershell
Copy-Item .env.example .env.local
```

Then set real values for:

```text
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
LOG_LEVEL
RHS_ADMIN_USER_IDS
```

`LOG_LEVEL` is optional and supports `debug`, `info`, `warn`, or `error`. Use `debug` temporarily when diagnosing local auth/cookie issues.
`RHS_ADMIN_USER_IDS` is optional for non-admin local runs, but `/admin` denies every signed-in user when it is missing or invalid. It must never be prefixed with `NEXT_PUBLIC_`.

For Google OAuth, also configure the provider outside this repo:

- Supabase Auth Google provider enabled with the Google OAuth client ID and secret.
- Google OAuth authorized redirect URI set to `https://csmisxwwrcyzttvybnsn.supabase.co/auth/v1/callback`.
- Supabase Auth redirect URL allowlist includes `http://localhost:3000/auth/callback` and the future production callback URL.

Do not add a Supabase service-role key unless server-side service-role code is explicitly implemented and documented.

The local dev server defaults to:

```text
http://localhost:3000
```

Stop the dev server with `Ctrl+C` when finished.

## Validation

Run:

```powershell
npm run typecheck
npm run test:auth-routes
npm run test:logging
npm run lint
npm run build
```

Current known dependency caveat: `npm audit` reports a moderate transitive `postcss` advisory through `next@16.2.10`. Npm's suggested automatic fix downgrades Next to an obsolete major version, so do not apply `npm audit fix --force` without reviewing the dependency strategy.

## Phase Status

Phase 1 is complete: the app has a Next.js App Router scaffold, TypeScript, Tailwind CSS v4, editable shadcn-style primitives, a public status route, and validation scripts.

Phase 2 foundation is complete for the current scaffold: design tokens, UI primitives, shell, and common route states exist. It is not a finished product UI system.

Phase 3 is in progress: Supabase schema, RLS, auth callback/sign-out handlers, Google OAuth and magic-link login UI, typed clients, profile/role helpers, first-login customer/handyman role selection, server-only admin UUID gating, account shell, session-aware navigation, and role-protected route shells exist. Manual browser auth verification and automated RLS/IDOR tests are not complete yet.

## Next Practical Step

The next practical step is applying the `claim_initial_app_role` migration, restarting the dev server so `RHS_ADMIN_USER_IDS` is loaded, then completing manual browser auth verification and focused RLS/authorization tests. Do not start service requests, Square payments, or role dashboards before those Phase 3 boundaries are verified.
