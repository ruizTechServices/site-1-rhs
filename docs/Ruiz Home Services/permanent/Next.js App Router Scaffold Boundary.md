# Next.js App Router Scaffold Boundary

The Next.js App Router scaffold is the current runtime frame for Ruiz Home Services. It is intentionally a status and verification surface, not the finished marketplace. `app/layout.tsx` owns metadata and global styling, `app/page.tsx` renders the public current-state page, and `app/loading.tsx`, `app/error.tsx`, and `app/not-found.tsx` provide baseline route states. The scaffold exposes six page routes and two auth handlers: `/`, `/login`, `/account`, `/customer`, `/handyman`, `/admin`, `/auth/callback`, and `/auth/sign-out`. The shared UI is split between editable shadcn-style primitives in `components/ui` and cross-route shells in `components/shared`. Domain-sensitive behavior is kept outside React presentation where possible: auth resolution sits in `lib/auth`, Supabase clients sit in `lib/supabase`, and operational events go through `lib/logging`. The main architectural constraint is that these pages are phase gates. `/customer` and `/handyman` are role verification shells, not live dashboards. `/admin` is an allowlist check, not a complete operations console. Future service request, job, and payment workflows should extend this scaffold through server-side route handlers, Server Actions, and domain modules rather than broad client components. Failure states should remain explicit: missing Supabase config downgrades public rendering but blocks protected access, auth failure redirects through `/login`, and product work remains blocked until Phase 3 verification completes. This boundary protects the project from shipping aspirational UI as real operational capability while keeping the route inventory easy to verify. Any new route should declare whether it is public, authenticated, role-gated, or admin-only, because that classification determines proxy behavior, server helper usage, RLS expectations, and manual verification steps. Documentation should update route counts whenever this scaffold grows.

***
**System Dependencies and Connections:**
- [[Supabase Request Proxy Boundary]]
- [[Role Protected Route Shells]]
- [[Structured JSON Logging Boundary]]

Word Count: 251
