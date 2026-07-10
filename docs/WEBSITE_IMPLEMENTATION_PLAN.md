# Website Implementation Plan

## 1. Evidence and Scope

Date: 2026-07-08 baseline, updated by Phase 3 backend foundation on 2026-07-10

Workspace inspected:

```text
C:\Users\giost\CascadeProjects\websites\ruizhomeservices\site-1-rhs
```

Verified current state before documentation additions:

- `AGENTS.md` existed.
- No `.git` directory was present in this workspace or the checked parent tree.
- No `package.json` existed.
- No `app/`, `components/`, `features/`, `lib/`, `tests/`, `supabase/`, or pre-existing `docs/` implementation files existed.
- No route files or UI components existed.

Primary approved requirement source:

- `AGENTS.md`.

Figma artifacts for this plan:

- Design-system and planning node: https://www.figma.com/design/0I1Bwb1F0NpYbvXCDU2xk3/Ruiz-Home-Services---Website-Plan-and-Design-System-v0?node-id=3-2&t=BkJ1yzqvFFq3D3cQ-1
- FigJam flowchart board: https://www.figma.com/board/khKj0SwtkVYeXWajCPaWjO

The design-system planning node was synchronized with the Phase 1 scaffold state on 2026-07-10. The local maintained docs now also reflect the Phase 3 backend foundation.

Important restriction:

This plan treats only verified code and applied migrations as implemented. Customer dashboards, service requests, jobs, payment flows, and final role-specific product workflows remain planned or blocked.

## 2. Current-State Website and Route Inventory

| Area | Current status | Evidence |
|---|---:|---|
| Application scaffold | Implemented baseline | `package.json`, `app/`, Next.js config |
| Routes/pages | 1 public page and 2 auth route handlers implemented | `app/page.tsx`, `app/auth/*/route.ts` |
| Components | 12 reusable components implemented | `components/ui/*`, `components/shared/*` |
| Feature modules | 0 implemented | No `features/` directory |
| Auth | Backend foundation implemented, UI incomplete | `lib/auth/*`, `lib/supabase/*`, `app/auth/*/route.ts` |
| Database | Phase 3 profile/role schema implemented | `supabase/migrations/*`, live Supabase project `csmisxwwrcyzttvybnsn` |
| Payments | Not implemented | No Square adapter or webhook route |
| Tests | Static validation only | typecheck, lint, build scripts |
| Docs | Baseline plus testing guide | `README.md`, `docs/*` |
| Git | Not initialized here | `git status` failed with "not a git repository" |

Existing implemented pages:

```text
/
/auth/callback
/auth/sign-out
/_not-found
```

Existing implemented user flows:

```text
Supabase OAuth/PKCE callback can exchange an auth code for a cookie-backed session.
POST /auth/sign-out signs out the current Supabase session.
```

Existing implemented reusable UI components:

```text
components/ui/badge.tsx
components/ui/button.tsx
components/ui/card.tsx
components/ui/checkbox.tsx
components/ui/empty-state.tsx
components/ui/input.tsx
components/ui/label.tsx
components/ui/select.tsx
components/ui/textarea.tsx
components/shared/phase-grid.tsx
components/shared/site-shell.tsx
components/shared/status-panel.tsx
```

## 3. Approved But Incomplete Work

These items are approved as project direction in `AGENTS.md`, but they are not fully implemented beyond the public scaffold, design foundation, and Phase 3 backend foundation:
- Sign-in/register UI.
- Protected route shells for customer, handyman, and admin surfaces.
- Browser-verified OAuth flow.
- Automated RLS and IDOR/BOLA tests.
- Square payment integration.
- Vercel-first deployment.
- Customer, handyman, and administrator surfaces.
- Server-authoritative rate and money calculations.
- Integer-cent monetary storage and calculation.
- Customer minimum rate of 3000 cents per hour.
- Handyman minimum amount of 2500 cents per hour.
- Platform amount of 500 cents per hour.
- Auditability for sensitive actions.

## 4. Recommended Future Work

These items are reasonable later, but they are not approved for immediate implementation unless the relevant decisions are made:

- Support or operations role.
- In-app messaging.
- SMS notifications.
- AI-assisted categorization or support tooling.
- Background queue or worker service.
- Automated handyman payouts.
- Reviews, disputes, and refund operations.
- Production payment activation.
- External API service outside Vercel.

## 5. Unresolved Product Decisions

Do not implement final flows that depend on these decisions until Gio approves them.

Marketplace operations:

- Dispatch, bidding, customer selection, or administrator assignment.
- Whether customers can select a handyman.
- Whether handymen can set custom rates.
- Whether customers can voluntarily increase hourly rate.
- Supported service categories.
- Emergency job support.
- NYC launch boroughs.

Billing:

- Minimum billable duration.
- Billing increment.
- Travel time.
- Materials.
- Taxes.
- Tips.
- Cancellations.
- No-shows.
- Surcharges.
- Who confirms start and end time.

Payments:

- Deposit, authorization, full prepayment, post-service payment, or mixed model.
- Whether final total can exceed the authorized amount.
- Adjustment approval.
- Handyman payout method and schedule.
- Refund, dispute, and chargeback responsibility.
- Merchant-of-record model.

Trust and safety:

- Identity verification.
- Background checks.
- Licensing requirements.
- Insurance requirements.
- Prohibited tasks.
- Complaint and emergency handling.

Authentication and communication:

- Supabase Auth versus another provider.
- OAuth methods.
- Email/password launch support.
- Phone verification.
- Admin MFA.
- Email, SMS, or in-app messaging.
- Communication retention.

## 6. Figma Flowcharts

FigJam board:

```text
https://www.figma.com/board/khKj0SwtkVYeXWajCPaWjO
```

Diagrams created:

- `RHS Current State Route Inventory`: originally captured the pre-scaffold state; the current implementation now has one public route.
- `RHS Approved Lifecycle With Decision Gates`: maps the approved high-level service lifecycle while marking assignment, payment, and payout as unresolved.
- `RHS Role And Authorization Boundaries`: maps authentication, trusted role lookup, ownership checks, RLS, and blocked support-role expansion.
- `RHS Approved Target Architecture Boundaries`: maps the approved Next.js, Supabase, Square, and Vercel target architecture as a planning diagram.

## 7. Atomic Design System Plan

Design file:

```text
https://www.figma.com/design/0I1Bwb1F0NpYbvXCDU2xk3/Ruiz-Home-Services---Website-Plan-and-Design-System-v0?node-id=3-2&t=BkJ1yzqvFFq3D3cQ-1
```

The Figma design-system artifact intentionally documents taxonomy and mapping, not final product screens. Final brand color values, typography, icon set, and route-level pages are blocked because no implementation or approved design source exists yet.

### Atoms

Planned atoms:

- Button.
- Input.
- Label.
- Textarea.
- Select.
- Checkbox.
- Status badge.
- Price display.
- Typography roles.
- Semantic color token names.
- Spacing token names.
- Radius token names.
- Icon slots.

Current code mapping:

```text
components/ui/button.tsx
components/ui/input.tsx
components/ui/label.tsx
components/ui/textarea.tsx
components/ui/select.tsx
components/ui/checkbox.tsx
components/ui/card.tsx
app/globals.css
```

### Molecules

Planned molecules:

- Form field.
- Address field group.
- Service category card.
- Photo upload control.
- Navigation item.
- Rate summary.
- Auth prompt.
- Empty state.
- Error message.

Current code mapping:

```text
components/ui/empty-state.tsx
components/shared/status-panel.tsx
components/shared/phase-grid.tsx
lib/auth/redirects.ts
```

Likely planned files:

```text
components/shared/form-field.tsx
components/shared/rate-summary.tsx
features/service-requests/components/*
```

### Organisms

Planned organisms:

- App shell navigation.
- Registration form.
- Service-request intake section.
- Role gate.
- Customer request list.
- Handyman job list.
- Admin review queue.
- Payment summary panel.

Current code mapping:

```text
components/shared/site-shell.tsx
app/page.tsx
app/auth/callback/route.ts
app/auth/sign-out/route.ts
proxy.ts
```

Payment organisms are blocked until the payment model is decided.

### Templates

No templates currently exist.

Proposed future templates:

- Public shell.
- Auth form shell.
- Role-protected app shell.
- Service-request workflow shell.
- Admin operations shell.

These are not final page designs. They should be created only after routes are scaffolded or explicitly approved.

### Pages

Complete implemented pages:

```text
/
```

Reason:

The only implemented page is the public scaffold/status shell. Customer, handyman, admin, service-request, auth, and payment pages remain unimplemented.

## 8. Component and Page Hierarchy

Current hierarchy:

```text
AGENTS.md
README.md
package.json
package-lock.json
next.config.ts
tsconfig.json
eslint.config.mjs
postcss.config.mjs
components.json
.gitignore
app/
  auth/
    callback/
      route.ts
    sign-out/
      route.ts
  globals.css
  layout.tsx
  page.tsx
  loading.tsx
  error.tsx
  not-found.tsx
components/
  shared/
  ui/
lib/
  auth/
  project/
  supabase/
  utils.ts
supabase/
  migrations/
docs/
  ARCHITECTURE.md
  IMPLEMENTATION_LOG.md
  TESTING.md
  WEBSITE_IMPLEMENTATION_PLAN.md
.env.example
```

Planned implementation hierarchy:

```text
app/
  layout.tsx
  globals.css
  page.tsx
components/
  ui/
  shared/
features/
  auth/
  service-requests/
  jobs/
  payments/
  admin/
lib/
  auth/
  db/
  payments/
  validation/
  errors/
  logging/
supabase/
  migrations/
  tests/
tests/
```

Do not create all folders at once unless the corresponding implementation exists. Empty structure creates false confidence and weak boundaries.

## 9. Phased Implementation Plan

### Phase 0 - Baseline Planning and Documentation

Status: completed by this task.

Outcome:

- Establish baseline documentation.
- Create Figma and FigJam planning artifacts.
- Record current empty implementation state.

Files:

- `README.md`.
- `docs/ARCHITECTURE.md`.
- `docs/IMPLEMENTATION_LOG.md`.
- `docs/WEBSITE_IMPLEMENTATION_PLAN.md`.
- `.env.example`.

Validation:

- Filesystem inspection.
- Figma metadata inspection.
- Figma screenshot render.

Risk:

- No runtime validation exists yet because there is no application.

### Phase 1 - Application Scaffold

Status: completed.

Dependencies:

- Gio approved implementation of the scaffold plan.

Outcome:

- Created Next.js App Router application using TypeScript.
- Added Tailwind CSS v4 and shadcn-ready configuration.
- Added minimal public app shell.
- Added scripts for lint, type check, build, dev, and start.

Implemented initial route scope:

- `/`: minimal public scaffold/status shell with conservative copy.
- `/_not-found`: framework not-found route.

Do not add role dashboards in this phase.

Validation:

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- Local HTTP and Chrome render checks passed.

Risks:

- `npm audit` reports a moderate transitive `postcss` advisory through `next@16.2.10`; npm's suggested fix is an unsafe Next downgrade.

### Phase 2 - Design Foundations and Public Shell

Status: baseline implemented; future expansion will happen as product routes are added.

Dependencies:

- Phase 1 complete.

Outcome:

- Implemented design tokens in Tailwind and CSS variables.
- Added initial shadcn-style primitives.
- Added accessible app shell, footer, and navigation.
- Added loading, empty, error, and not-found patterns.
- Keep marketing claims conservative.

Validation:

- Lint, type check, build.
- Desktop screenshot through Chrome headless.
- Mobile screenshot through Chrome DevTools Protocol at 390px.
- Confirmed no horizontal overflow at 390px.

Risks:

- Final brand direction is unresolved.

### Phase 3 - Authentication, Profiles, Roles, and Authorization

Priority: high before protected product workflows.

Status: current, partially implemented.

Dependencies:

- Supabase Auth is now the implemented provider foundation.
- Supabase project `Ruiz Home Services` (`csmisxwwrcyzttvybnsn`) is now the target backend.

Implemented outcome:

- Supabase Auth SSR client setup with request-scoped server client.
- Auth callback and sign-out route handlers.
- Generated database types.
- `profiles`, `role_assignments`, `customer_profiles`, and `handyman_profiles` tables.
- Owner-scoped RLS policies on user-owned tables.
- Authenticated read-only access to own role assignments.
- No anonymous table grants.
- Trusted server-side role/profile helper modules.
- Security advisor warnings cleared.

Remaining Phase 3 work:

- Sign-in/register UI.
- Protected customer, handyman, and admin route shells.
- Manual browser OAuth verification.
- Automated RLS and cross-user authorization tests.
- Admin service-role boundary for role assignment, if approved.

Validation:

- TypeScript type check.
- ESLint.
- Next production build.
- Supabase table inventory.
- Supabase security advisors.
- Supabase policy and grant SQL inspection.
- Manual browser OAuth and cross-user RLS tests remain required.

Risks:

- Admin MFA policy is unresolved.
- Admin role-assignment workflow is unresolved.
- Product route shells are not complete.
- No dedicated test runner exists yet.

### Phase 4 - Customer Service Request Intake

Priority: high after auth.

Dependencies:

- Phase 3 complete.
- Service category and supported area decisions.
- File upload policy if photos are included.

Outcome:

- Customer service request creation.
- Server-side validation.
- Request status model.
- Address handling.
- Optional image upload after storage policy.
- Customer ownership enforcement.

Validation:

- Form validation tests.
- Route/action authorization tests.
- RLS ownership tests.
- Mobile browser workflow check.

Risks:

- NYC compliance and service category policy are unresolved.
- Image upload privacy/security policy is unresolved.

### Phase 5 - Operations and Handyman Workflow

Priority: medium, blocked by marketplace model.

Dependencies:

- Dispatch, bidding, customer selection, or admin assignment decision.
- Handyman onboarding requirements.

Outcome:

- Admin review workflow.
- Handyman profile/onboarding.
- Assignment or acceptance workflow.
- Job status boundaries.

Validation:

- Role authorization tests.
- State transition tests.
- Cross-role access tests.

Risks:

- Assignment model is unresolved.
- Handyman verification/licensing/background-check policy is unresolved.

### Phase 6 - Pricing Snapshots and Square Sandbox Payments

Priority: high once payment policy is approved.

Dependencies:

- Deposit/authorization/full-payment/post-service decision.
- Square sandbox credentials.
- Pricing snapshot schema.
- Idempotency strategy.

Outcome:

- Server-calculated payment amount.
- Immutable pricing snapshot.
- Internal payment records.
- Square adapter.
- Idempotent payment creation.
- Verified webhook route.
- Payment state reconciliation foundation.

Validation:

- Minimum amount test.
- Invalid amount rejection test.
- Duplicate request idempotency test.
- Provider failure test.
- Timeout test.
- Invalid webhook signature test.
- Duplicate webhook event test.
- Unauthorized payment attempt test.
- Customer attempting to pay for another customer's job test.

Risks:

- Payment policy is unresolved.
- Payout model is unresolved.
- Production payment activation must remain blocked.

### Phase 7 - Job Lifecycle, Completion, Disputes, Reviews, and Payout Records

Priority: medium after phases 4-6.

Dependencies:

- Billing increment.
- Time confirmation.
- Dispute policy.
- Payout model.
- Notification model.

Outcome:

- Job state machine.
- Time entries.
- Completion confirmation.
- Dispute and support foundations.
- Review flow.
- Payout records.

Validation:

- State transition tests.
- Authorization tests.
- Audit log tests.
- Payment state integration tests.

Risks:

- Multiple business policies remain unresolved.

## 10. Data Flow Plan

Planned request flow:

```text
Browser form
  -> client-side validation for usability
  -> server route/action validation for authority
  -> trusted auth lookup
  -> role and ownership check
  -> domain service
  -> Supabase query/mutation with RLS
  -> structured response
```

Planned payment flow:

```text
Browser payment confirmation
  -> server authenticates customer
  -> server verifies job ownership and payable state
  -> server loads immutable pricing snapshot
  -> server calculates amount in cents
  -> server creates/reuses internal payment record
  -> server calls Square with idempotency
  -> webhook verifies Square signature
  -> webhook updates payment state idempotently
```

Payment flow is blocked until payment policy is approved.

## 11. Security Considerations

Security requirements that must be treated as implementation blockers:

- Never trust roles from the client.
- Never calculate authoritative payment amounts in the browser.
- Never store money as floating-point values.
- Never expose Supabase service-role keys to browser code.
- Never log secrets or raw payment data.
- Enforce ownership server-side.
- Use RLS for Supabase-exposed user tables.
- Verify Square webhook signatures.
- Use payment idempotency.
- Add audit records for sensitive operations.

## 12. Testing Strategy

No dedicated unit or integration test runner exists yet. The current scaffold supports static validation and production build checks through `package.json` scripts.

Current validation commands:

```text
npm run typecheck
npm run lint
npm run build
```

Expected validation as implementation matures:

- Formatting.
- Linting.
- Type checking.
- Unit tests for domain logic.
- Route/action tests for validation and authorization.
- Supabase RLS tests.
- Payment adapter tests.
- Webhook tests.
- Build checks.
- Browser checks across mobile and desktop.

## 13. Documentation Updates

Documentation must stay synchronized as implementation proceeds.

Update:

- `README.md` when setup, commands, or current status changes.
- `docs/ARCHITECTURE.md` when architecture, data flow, auth, payment, or deployment boundaries change.
- `docs/IMPLEMENTATION_LOG.md` for each meaningful implementation change.
- `docs/WEBSITE_IMPLEMENTATION_PLAN.md` when phases, scope, route inventory, or blocked decisions change.
- `AGENTS.md` only when the project contract changes.

## 14. Definition of Done for the Next Phase

Phase 3 is done only when:

- Supabase Auth setup exists. Completed for backend foundation.
- Profile and role-assignment schema exists through forward-only migrations. Completed.
- RLS policies protect user-owned tables. Completed for Phase 3 tables.
- Server-side auth and authorization helpers exist. Completed for current-role/profile lookup.
- Customer, handyman, and admin protected shells enforce trusted role lookup.
- Anonymous, cross-user, and non-admin access tests pass.
- Documentation and implementation log are updated.
