# Testing

## Current Test Surface

The project currently has a minimal Next.js scaffold, a Phase 3 Supabase Auth/Profile/Role backend foundation, and no dedicated test runner. Validation is limited to static checks, production build, Supabase advisor/schema inspection, HTTP smoke checks, and browser rendering checks.

## Planning Artifact Reference

Use the synchronized Figma planning node when checking that route inventory, component inventory, and implementation phase status match the maintained docs:

```text
https://www.figma.com/design/0I1Bwb1F0NpYbvXCDU2xk3/Ruiz-Home-Services---Website-Plan-and-Design-System-v0?node-id=3-2&t=BkJ1yzqvFFq3D3cQ-1
```

## Available Commands

Run from the project root:

```powershell
npm run typecheck
npm run lint
npm run build
```

Current scripts:

- `npm run typecheck`: runs `tsc --noEmit`.
- `npm run lint`: runs `eslint . --max-warnings=0`.
- `npm run build`: runs `next build`.
- `npm run dev`: starts the local development server.

Supabase backend checks used during Phase 3:

- Supabase table inventory for `public.profiles`, `public.role_assignments`, `public.customer_profiles`, and `public.handyman_profiles`.
- Supabase security advisors.
- Supabase performance advisors.
- SQL inspection of RLS policies, table grants, trigger presence, function execute grants, and migration history.

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
- Copy clearly states that backend auth foundation exists but customer requests, role dashboards, jobs, and payments are not live.
- Mobile width does not horizontally overflow.
- Unknown routes return the project not-found page with HTTP 404.

Stop the dev server with `Ctrl+C` when finished.

## Manual Supabase Auth Check

Create `.env.local` from `.env.example` and set real values:

```powershell
Copy-Item .env.example .env.local
```

Required values:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Manual checks still required before treating Phase 3 as complete:

- Configure an approved OAuth provider in Supabase Auth.
- Confirm the provider redirects to `/auth/callback`.
- Confirm a successful callback creates a Supabase session cookie.
- Confirm the `auth.users` trigger creates a matching `profiles` row.
- Confirm `/auth/sign-out` clears the session through a POST request.
- Confirm a signed-in user can read only their own `profiles`, `customer_profiles`, `handyman_profiles`, and `role_assignments` rows.
- Confirm authenticated users cannot self-insert or update `role_assignments`.
- Confirm anonymous users have no direct table access.

## Future Required Tests

Before implementing dependent product features, add automated coverage for:

- Authenticated and anonymous route access.
- Trusted role lookup.
- Customer, handyman, and admin authorization paths.
- Cross-user ownership denial.
- Supabase RLS insert, select, update, and delete behavior.
- Service-request validation.
- Job assignment authorization and state transitions.
- Integer-cent pricing calculations.
- Square idempotency and webhook signature verification.

Payment tests must use Square sandbox only until production payment activation is explicitly approved.
