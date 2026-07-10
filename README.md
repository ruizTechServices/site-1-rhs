# Ruiz Home Services

Ruiz Home Services is planned as a New York City home-services marketplace built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Square, and Vercel.

## Current Status

As of the 2026-07-10 Phase 3 backend foundation, this workspace has a minimal executable Next.js App Router scaffold, baseline planning documentation, and the first Supabase Auth/Profile/Role backend slice. The implemented application surface is intentionally small:

- `/`: public architecture/status shell.
- `/auth/callback`: Supabase PKCE/OAuth callback route handler.
- `/auth/sign-out`: POST-only Supabase sign-out route handler.
- `/_not-found`: framework not-found route with project-specific copy.
- Reusable UI foundation under `components/ui/`.
- Shared shell/status components under `components/shared/`.
- Static architecture phase data under `lib/project/`.
- Supabase client, server, proxy, auth, profile, and role helpers under `lib/supabase/` and `lib/auth/`.
- Forward-only Supabase migrations under `supabase/migrations/`.

The live Supabase project is `Ruiz Home Services` (`csmisxwwrcyzttvybnsn`). It now has RLS-enabled `profiles`, `role_assignments`, `customer_profiles`, and `handyman_profiles` tables. There is still no sign-in UI, protected product page, service-request workflow, Square integration, Vercel project link, or GitHub remote in this workspace.

Do not treat planned routes, dashboards, payment flows, or role-specific surfaces as implemented.

## Authoritative Instructions

Read `AGENTS.md` before making architectural, security, database, payment, authentication, or product-flow changes. It defines the confirmed business rules, unresolved decisions, implementation workflow, and documentation requirements.

## Planning Artifacts

- Figma design-system planning node: https://www.figma.com/design/0I1Bwb1F0NpYbvXCDU2xk3/Ruiz-Home-Services---Website-Plan-and-Design-System-v0?node-id=3-2&t=BkJ1yzqvFFq3D3cQ-1
- FigJam flowchart board: https://www.figma.com/board/khKj0SwtkVYeXWajCPaWjO
- Website implementation plan: `docs/WEBSITE_IMPLEMENTATION_PLAN.md`
- Architecture notes: `docs/ARCHITECTURE.md`
- Implementation log: `docs/IMPLEMENTATION_LOG.md`
- Testing guide: `docs/TESTING.md`

The Figma planning node was synchronized with the Phase 3 backend foundation state on 2026-07-10.

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
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

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
npm run lint
npm run build
```

Current known dependency caveat: `npm audit` reports a moderate transitive `postcss` advisory through `next@16.2.10`. Npm's suggested automatic fix downgrades Next to an obsolete major version, so do not apply `npm audit fix --force` without reviewing the dependency strategy.

## Phase Status

Phase 1 is complete: the app has a Next.js App Router scaffold, TypeScript, Tailwind CSS v4, editable shadcn-style primitives, a public status route, and validation scripts.

Phase 2 foundation is complete for the current scaffold: design tokens, UI primitives, shell, and common route states exist. It is not a finished product UI system.

Phase 3 is in progress: Supabase schema, RLS, auth callback/sign-out handlers, typed clients, and role/profile helpers exist. Protected product routes and manual browser OAuth verification are not complete yet.

## Next Practical Step

The next practical step is finishing Phase 3 by adding approved sign-in UI, protected route shells, browser OAuth verification, and focused RLS/authorization tests. Do not start service requests, Square payments, or role dashboards before those Phase 3 boundaries are verified.
