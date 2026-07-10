# AGENTS.md

> **Project:** Ruiz Home Services  
> **Purpose:** Operating instructions for AI coding agents and human contributors  
> **Primary stack:** Next.js, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Square, Vercel  
> **Primary market:** New York City  
> **Document status:** Living project contract. AI agents may update this file when the project changes, but must follow the update rules in this document.

---

## 1. Why This File Exists

This file is the authoritative operating guide for any large language model, coding agent, automation tool, or human contributor working on Ruiz Home Services.

An agent must read this entire file before making architectural, database, payment, authentication, deployment, security, or business-logic changes.

The goals of this file are to:

1. Give an agent enough context to work without repeatedly rediscovering the product.
2. Prevent accidental changes to core business rules.
3. Keep implementation decisions consistent across the repository.
4. Separate confirmed requirements from unresolved decisions.
5. Define how agents should plan, code, test, document, and report work.
6. Reduce duplicated systems, hidden coupling, insecure shortcuts, and speculative implementation.
7. Keep this document synchronized with the actual codebase.

This file is not marketing copy, a project README, a changelog, or an API reference. It is the project’s operating contract.

---

## 2. Project Summary

Ruiz Home Services is a New York City marketplace and service platform that connects:

- Homeowners and other customers who need household tasks completed.
- Handymen and service providers who can accept and complete those tasks.
- Platform administrators who manage users, jobs, payments, disputes, support, configuration, and platform operations.

The platform is intended to support the full service lifecycle:

1. A customer creates an account.
2. A customer submits a service request.
3. The platform captures job details, location, timing, images, scope, and customer preferences.
4. A handyman is assigned, invited, matched, or allowed to accept the request.
5. The customer agrees to the pricing terms.
6. A payment method, deposit, authorization, or full payment is collected through Square.
7. The handyman performs the work.
8. The job duration and final billable amount are confirmed.
9. Payment is completed or adjusted.
10. The handyman receives their contractual amount.
11. Ruiz Home Services receives the platform maintenance amount.
12. The customer and handyman may review the transaction.
13. The platform stores a complete audit trail.

The exact marketplace workflow is still evolving. Agents must not silently choose a dispatch model, bidding model, payout model, or deposit policy unless the codebase and approved documentation already define it.

---

## 3. Core Business Rules

The following rules are currently confirmed and must not be changed without explicit approval.

### 3.1 Hourly Economics

For each billable hour:

- The customer pays a minimum of **$30.00 per hour**.
- The handyman receives a minimum of **$25.00 per hour**.
- Ruiz Home Services receives **$5.00 per hour** for platform upkeep, maintenance, operations, and related platform functions.
- A customer may choose to pay more than the minimum hourly rate.
- Any amount above the minimum must have an explicitly defined allocation rule before implementation.

The base formula is:

```text
customer_hourly_rate = handyman_hourly_rate + platform_hourly_fee
```

Current minimum values:

```text
customer_hourly_rate = 30.00 USD
handyman_hourly_rate = 25.00 USD
platform_hourly_fee = 5.00 USD
```

### 3.2 Monetary Precision

Money must never be stored or calculated as a floating-point value.

Use integer minor units:

```text
$30.00 => 3000 cents
$25.00 => 2500 cents
$5.00  => 500 cents
```

Approved naming examples:

```ts
customerHourlyRateCents
handymanHourlyRateCents
platformHourlyFeeCents
subtotalCents
depositCents
tipCents
taxCents
totalCents
```

All monetary calculations must occur on the server or in trusted database logic. Client-side calculations may be displayed as estimates, but they are never authoritative.

### 3.3 Minimum Rate Enforcement

The minimum rate must be enforced in all relevant layers:

- User interface validation.
- Server-side request validation.
- Database constraints where practical.
- Payment creation logic.
- Administrative tools.
- Tests.

No client-provided hourly amount may be trusted without server validation.

### 3.4 Time and Billing

The exact billing increment is unresolved unless already implemented.

Do not assume any of the following without approval:

- Exact one-hour minimum.
- Fifteen-minute billing increments.
- Thirty-minute billing increments.
- Rounding up to the next hour.
- Travel time billing.
- Materials billing.
- Cancellation fees.
- Emergency surcharges.
- Taxes.
- Tips.
- Platform service fees beyond the confirmed $5 per hour.
- Discounts or promotional pricing.

When implementing time billing, preserve raw time data and calculated billable time separately.

Recommended conceptual fields:

```text
actual_started_at
actual_completed_at
actual_duration_minutes
billable_duration_minutes
billing_increment_minutes
minimum_billable_minutes
```

### 3.5 New York City Scope

The platform is intended for New York City.

Do not assume that every NYC-specific legal, tax, licensing, insurance, labor, contractor-classification, home-improvement, consumer-protection, or payment requirement has already been resolved.

Agents must flag legal or compliance assumptions and avoid presenting implementation choices as legal conclusions.

---

## 4. Confirmed Technology Direction

The current preferred stack is:

| Area | Preferred technology |
|---|---|
| Application framework | Next.js |
| Language | TypeScript |
| Routing | Next.js App Router |
| Styling | Tailwind CSS |
| Component library | shadcn/ui |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth or another explicitly approved provider |
| Payments | Square APIs |
| Primary hosting | Vercel |
| API hosting | Prefer Next.js server capabilities unless a separate service is justified |
| External API hosting | Heroku only if there is a concrete need |
| Source control | Git and GitHub |
| Package manager | Follow the repository lockfile; currently npm if `package-lock.json` is authoritative |

### 4.1 Current Repository Shape

As of 2026-07-10, the repository is currently understood to include:

```text
.next/
app/
  auth/
    callback/
    sign-out/
  globals.css
  layout.tsx
  page.tsx
components/
  shared/
  ui/
docs/
lib/
  auth/
  project/
  supabase/
node_modules/
supabase/
  migrations/
.env.example
.gitignore
components.json
next-env.d.ts
next.config.ts
package-lock.json
package.json
postcss.config.mjs
proxy.ts
tsconfig.json
```

Agents must inspect the actual repository before assuming this structure is still current.

Current implemented backend foundation:

- Supabase Auth is the implemented authentication foundation.
- The live Supabase project target is `Ruiz Home Services` with project ref `csmisxwwrcyzttvybnsn`.
- The Phase 3 public tables are `profiles`, `role_assignments`, `customer_profiles`, and `handyman_profiles`.
- These Phase 3 tables have RLS enabled.
- `anon` has no table grants on the Phase 3 tables.
- `authenticated` has only `select`, `insert`, and `update` on owned profile tables and only `select` on `role_assignments`.
- `role_assignments` is the trusted application role source for `customer`, `handyman`, and `admin`.
- Application clients must not self-assign roles.
- The app currently reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- No application code currently reads a Supabase service-role key.
- The auth UI, protected product route shells, browser OAuth verification, and automated RLS tests are still incomplete.

### 4.2 Next.js First

Prefer Next.js-native server capabilities before introducing a separate API service.

Use, as appropriate:

- Server Components.
- Client Components only where interactivity requires them.
- Route Handlers.
- Server Actions when they provide a clear benefit.
- Middleware for narrow cross-cutting concerns only.
- Vercel deployment primitives when compatible with the application’s needs.

A separate Heroku service is justified only when at least one of the following is true:

- A long-running process is required.
- A persistent worker cannot reasonably run within the Vercel execution model.
- A special runtime is required.
- A queue consumer or background processor requires a separate service.
- A third-party library is incompatible with the primary deployment target.
- Operational separation has a clear security or scalability benefit.
- The project already has a stable external API service that would be more costly or risky to migrate.

Do not create a second backend merely because the project uses APIs. Next.js can host server-side API logic.

---

## 5. Product Roles

At minimum, the platform should model the following roles.

### 5.1 Customer

A customer can potentially:

- Register and authenticate.
- Manage their profile.
- Add and manage service addresses.
- Create service requests.
- Upload job photos.
- View estimates and pricing terms.
- Provide a payment method.
- Pay a deposit or authorized amount.
- View job status.
- Communicate through approved platform channels.
- Confirm completion.
- Review payment history.
- Leave a review.
- Open a support request or dispute.

### 5.2 Handyman

A handyman can potentially:

- Register and authenticate.
- Complete identity and profile information.
- Submit qualifications or service categories.
- Set availability.
- View eligible jobs.
- Accept, reject, or request clarification on jobs.
- Start and complete work.
- Record work notes and evidence.
- View earnings.
- View payout status.
- Receive reviews.
- Contact support.

### 5.3 Administrator

An administrator can potentially:

- View customers, handymen, jobs, payments, payouts, disputes, and audit records.
- Suspend or restrict accounts.
- Resolve operational issues.
- Adjust approved platform configuration.
- Review job history.
- Manage service categories.
- Review payment failures.
- Issue refunds through approved workflows.
- View security and audit events.
- Configure platform content.
- Manage support cases.

Administrative access must not rely only on client-side route hiding.

### 5.4 Support or Operations Role

A separate support or operations role may be added later.

Do not give support users unrestricted administrator capabilities by default.

---

## 6. Identity, Authentication, and Authorization

### 6.1 Authentication Is Not Authorization

Authentication answers:

> Who is this user?

Authorization answers:

> Is this user allowed to perform this action on this resource?

Every protected operation must enforce both.

### 6.2 Preferred Model

Use a central user profile connected to the authentication provider’s user ID.

Recommended conceptual structure:

```text
auth.users
profiles
customer_profiles
handyman_profiles
admin_roles or role_assignments
```

Do not duplicate authentication credentials in application tables.

### 6.3 Role Storage

Do not trust a role sent by the client.

Roles must come from trusted server-side data, such as:

- Database role assignments.
- Secure authentication claims that are managed by trusted server processes.
- A server-side authorization service.

### 6.4 Ownership Checks

Every resource operation must verify ownership or role permission.

Examples:

- A customer may only view their own service requests unless explicitly shared.
- A handyman may only view jobs they are allowed to see.
- A handyman may only update jobs assigned to them.
- An administrator may access broader records only through protected server paths.
- A user may not read another user’s payment details.
- A public job identifier must not reveal private database IDs unnecessarily.

### 6.5 Supabase Row Level Security

If Supabase is used, Row Level Security must be enabled and tested for user-owned tables.

Do not rely only on application code for access control.

At minimum, test:

- Anonymous access.
- Authenticated customer access.
- Authenticated handyman access.
- Cross-customer access attempts.
- Cross-handyman access attempts.
- Administrator access.
- Service-role-only operations.
- Insert, select, update, and delete behavior separately.

### 6.6 Service Role Key

A Supabase service role key must never be exposed to:

- Browser code.
- Public environment variables.
- Client bundles.
- Logs.
- Error messages.
- Screenshots.
- Documentation examples with real values.

---

## 7. Recommended Domain Model

The exact schema may evolve. The following model is a guide, not permission to create every table automatically.

### 7.1 Core Entities

Potential core entities include:

```text
profiles
customer_profiles
handyman_profiles
role_assignments
addresses
service_categories
service_requests
service_request_images
job_assignments
jobs
job_events
job_time_entries
quotes
pricing_snapshots
payment_customers
payment_methods
payments
payment_attempts
refunds
payouts
reviews
messages
notifications
support_cases
disputes
audit_logs
platform_settings
webhook_events
```

### 7.2 Service Request Versus Job

Keep the customer’s request separate from the operational job when useful.

A service request represents demand:

- What the customer needs.
- Where it is needed.
- When it is needed.
- Photos and notes.
- Initial scope.
- Requested service category.

A job represents fulfillment:

- Assigned handyman.
- Agreed scope.
- Pricing snapshot.
- Status progression.
- Work timing.
- Completion evidence.
- Final bill.
- Payment state.

Do not overload one table with every stage unless the simpler design is intentionally chosen and documented.

### 7.3 Immutable Pricing Snapshot

When a customer accepts pricing, store a pricing snapshot.

A pricing snapshot should preserve the terms used for that transaction even if platform rates change later.

Potential fields:

```text
currency
customer_hourly_rate_cents
handyman_hourly_rate_cents
platform_hourly_fee_cents
minimum_billable_minutes
billing_increment_minutes
deposit_cents
materials_policy
cancellation_policy_version
pricing_policy_version
accepted_at
```

Historical transactions must not change because a current configuration value changed.

### 7.4 Status Design

Use explicit status values.

Potential service-request statuses:

```text
draft
submitted
under_review
awaiting_assignment
cancelled
converted_to_job
```

Potential job statuses:

```text
pending
awaiting_customer_action
awaiting_handyman_action
assigned
scheduled
en_route
in_progress
awaiting_completion_confirmation
completed
cancelled
disputed
closed
```

Potential payment statuses:

```text
created
pending
authorized
captured
completed
failed
cancelled
partially_refunded
refunded
```

Do not use one generic `status` field to represent job, payment, payout, and dispute state simultaneously.

### 7.5 State Transitions

State transitions must be validated server-side.

Examples:

```text
scheduled -> in_progress
in_progress -> awaiting_completion_confirmation
awaiting_completion_confirmation -> completed
```

Invalid transitions must be rejected.

Do not allow arbitrary status updates from the client.

---

## 8. Payment Architecture

Payments are a high-risk subsystem. Agents must prioritize correctness, idempotency, auditability, and recovery over speed.

### 8.1 Square Responsibility

Square is the payment processor.

The application remains responsible for:

- Creating valid payment requests.
- Mapping internal records to Square records.
- Validating expected amounts.
- Handling retries safely.
- Processing webhook events.
- Recording failures.
- Preventing duplicate charges.
- Managing refund workflows.
- Protecting sensitive credentials.
- Reconciling internal payment state with processor state.

### 8.2 Payment Data Rules

Never store raw card data.

Never log:

- Full payment tokens.
- Access tokens.
- Card numbers.
- CVV values.
- Sensitive customer payment payloads.
- Webhook signature secrets.
- Production credentials.

Store only necessary processor references and non-sensitive metadata.

### 8.3 Idempotency

Every create-payment or money-moving request must use idempotency.

The same business action retried twice must not create two charges.

Recommended concept:

```text
internal_payment_id
idempotency_key
square_payment_id
attempt_number
request_hash
status
```

Idempotency keys should be stable for the same intended operation and different for a genuinely new operation.

### 8.4 Server Authority

The server must determine the charge amount from trusted data.

Never accept a final charge amount directly from the browser.

The client may send:

- A job identifier.
- A selected approved option.
- A payment method token.
- A confirmation action.

The server must load the authoritative pricing record and calculate the amount.

### 8.5 Payment Workflow

A safe conceptual flow is:

1. Customer requests checkout.
2. Server authenticates the customer.
3. Server verifies the customer owns the job.
4. Server verifies the job is payable.
5. Server loads the immutable pricing snapshot.
6. Server calculates the amount.
7. Server creates or reuses an internal payment record.
8. Server creates the Square payment with idempotency.
9. Server stores the Square response.
10. Webhooks update asynchronous payment state.
11. The application reconciles inconsistencies.
12. The job advances only after the required payment state is confirmed.

### 8.6 Deposit, Authorization, or Full Payment

The project has not yet confirmed whether it uses:

- A deposit.
- A card authorization.
- Full prepayment.
- Payment after completion.
- A combination of these.

Do not invent this policy.

Before implementing, define:

- When the customer is charged.
- What amount is charged.
- Whether the amount can change.
- How additional time is approved.
- How materials are approved.
- What happens if the final amount exceeds the original amount.
- What happens if the job is cancelled.
- What happens if the handyman does not appear.
- What happens if a dispute is opened.
- What happens if a payment fails after work is complete.

### 8.7 Tips

Customers may eventually be allowed to pay more than the minimum rate, but the system must distinguish:

- Increased hourly rate.
- Tip.
- Materials reimbursement.
- Emergency surcharge.
- Donation.
- Platform fee.

Do not treat all additional money as the same category.

### 8.8 Handyman Payouts

Do not assume that receiving customer payment and paying a handyman are the same API operation.

The payout architecture must define:

- Whether Ruiz Home Services is merchant of record.
- Whether handymen are paid manually or automatically.
- The payout schedule.
- Payout eligibility.
- Failed payout handling.
- Refund effects.
- Chargeback effects.
- Tax reporting responsibilities.
- Processor capabilities and account requirements.

No automated payout implementation may be added until the business and processor model is confirmed.

### 8.9 Webhooks

Webhook handling must:

- Verify the processor signature.
- Parse the raw request correctly.
- Reject invalid signatures.
- Be idempotent.
- Store the external event ID.
- Ignore already processed events safely.
- Record processing status.
- Support retries.
- Avoid leaking secrets.
- Update only permitted internal state.
- Log failures without logging sensitive payloads.
- Return appropriate responses promptly.

Recommended conceptual fields:

```text
provider
external_event_id
event_type
received_at
processed_at
processing_status
attempt_count
payload_hash
last_error_code
```

### 8.10 Refunds

Refunds must be server-authorized and auditable.

Every refund should record:

- Initiating user.
- Reason.
- Amount.
- Related payment.
- Processor refund ID.
- Status.
- Timestamps.
- Administrative notes.
- Effect on handyman payout.
- Effect on platform revenue.

---

## 9. Application Architecture

### 9.1 Separation of Concerns

Use clear layers.

A recommended structure is:

```text
app/                    # Routes, layouts, pages, route handlers
components/             # Reusable UI components
components/ui/          # shadcn/ui primitives
features/               # Domain-oriented feature modules, when introduced
lib/                    # Shared utilities and infrastructure
lib/auth/               # Authentication and authorization helpers
lib/db/                 # Database clients, queries, mappers
lib/payments/           # Square integration and payment domain logic
lib/validation/         # Shared schemas
lib/config/             # Validated configuration
lib/errors/             # Typed application errors
lib/logging/            # Structured logging
hooks/                  # Reusable client-side hooks
types/                  # Shared types only when needed
tests/                  # Tests, if not colocated
supabase/               # Migrations, seed, local configuration, tests
docs/                   # Architecture and operational documentation
```

Do not create folders merely to match this document. Add structure when the codebase needs it.

### 9.2 Domain Logic Placement

Business rules must not live primarily inside React components.

Examples of domain logic:

- Rate validation.
- Billable-time calculation.
- Job state transitions.
- Payment amount calculation.
- Refund eligibility.
- Role checks.
- Payout eligibility.

Place domain logic in testable server-side modules.

### 9.3 React Components

React components should focus on:

- Rendering.
- Interaction.
- Local UI state.
- Form state.
- Accessibility.
- Calling approved server boundaries.

Components must not directly contain processor secrets, privileged database clients, or authoritative billing calculations.

### 9.4 Server and Client Boundaries

Use Client Components only when required by:

- Browser APIs.
- Event handlers.
- Client-only state.
- Interactive UI libraries.
- Payment tokenization components.
- Real-time user interaction.

Prefer Server Components for:

- Data loading.
- Protected page rendering.
- Static and mostly static content.
- Server-only service calls.
- Initial authorization checks.

Do not mark entire route trees as client components for convenience.

### 9.5 Route Handlers

Route Handlers should:

- Validate input.
- Authenticate the caller.
- Authorize the action.
- Call domain services.
- Return stable response shapes.
- Avoid duplicating domain logic.
- Avoid exposing raw database or provider errors.
- Include correlation or request identifiers where useful.

### 9.6 Server Actions

Server Actions may be used when they simplify form workflows, but they must follow the same rules as any API endpoint:

- Authenticate.
- Authorize.
- Validate.
- Use trusted server-side data.
- Handle errors.
- Protect against duplicate operations.
- Revalidate affected data.

Do not treat a Server Action as inherently secure merely because it runs on the server.

---

## 10. TypeScript Standards

### 10.1 General Rules

- Use TypeScript for application code.
- Avoid `any`.
- Prefer explicit domain types.
- Use `unknown` for untrusted data and validate before use.
- Keep public function signatures clear.
- Prefer small, focused functions.
- Use exhaustive checks for state machines where practical.
- Avoid deeply nested conditional logic.
- Use named constants for business values.
- Avoid unexplained magic numbers.
- Use `readonly` where immutability improves safety.
- Do not duplicate provider response types manually when an official SDK type exists and is appropriate.

### 10.2 Naming

Use descriptive names.

Good:

```ts
calculateBillableMinutes()
createSquarePayment()
requireCustomerOwnership()
customerHourlyRateCents
paymentAttempt
```

Avoid:

```ts
doStuff()
data2
temp
x
handlerThing()
```

### 10.3 Error Handling

Use typed or categorized errors.

Potential categories:

```text
VALIDATION_ERROR
AUTHENTICATION_REQUIRED
FORBIDDEN
RESOURCE_NOT_FOUND
CONFLICT
INVALID_STATE_TRANSITION
PAYMENT_FAILED
PROVIDER_UNAVAILABLE
INTERNAL_ERROR
```

Do not expose internal stack traces or provider secrets to users.

### 10.4 Date and Time

Store timestamps in UTC.

Display dates and times in the user’s expected timezone.

The business operates in New York City, so user-facing scheduling will commonly use:

```text
America/New_York
```

Do not perform critical date arithmetic with ambiguous local-time strings.

Be careful with:

- Daylight Saving Time.
- Overnight jobs.
- Scheduling boundaries.
- Webhook timestamps.
- Payment settlement dates.
- Database timezone conversion.

---

## 11. Validation Standards

All untrusted input must be validated.

Untrusted input includes:

- Form submissions.
- Search parameters.
- Route parameters.
- Cookies.
- Headers.
- Webhook payloads.
- Provider responses.
- Database JSON fields.
- Uploaded file metadata.
- AI-generated content.
- Administrative inputs.

Prefer a shared schema-validation library already used by the repository.

Validation should cover:

- Type.
- Required fields.
- Length.
- Allowed values.
- Numeric bounds.
- Money bounds.
- Date validity.
- State compatibility.
- Role compatibility.
- Ownership.
- File type and size.
- Cross-field rules.

Client-side validation improves usability. Server-side validation provides security and correctness. Both may be required.

---

## 12. Database Standards

### 12.1 Migrations

All schema changes must use migrations.

Do not manually alter production tables without recording the change.

Each migration should:

- Have a clear name.
- Be narrowly scoped.
- Be reviewable.
- Preserve data or document destructive behavior.
- Include indexes when needed.
- Include constraints when practical.
- Include RLS changes when relevant.
- Be tested locally before deployment.

### 12.2 Constraints

Use database constraints for durable rules where appropriate.

Examples:

- Nonnegative money values.
- Valid currency code.
- Unique external payment IDs.
- Unique webhook event IDs.
- Foreign key integrity.
- Required ownership.
- Valid status values.
- Minimum rate relationships.

Do not rely exclusively on UI validation.

### 12.3 Indexing

Indexes should support real query patterns.

Common candidates:

- User ownership.
- Job status.
- Assigned handyman.
- Scheduled date.
- Payment status.
- External processor IDs.
- Webhook event IDs.
- Created date.
- Geographic search fields, if introduced.

Do not add indexes blindly. Document the query they support.

### 12.4 Soft Delete

Use soft deletion only when the business requires recovery, legal retention, audit history, or relationship preservation.

Do not automatically add `deleted_at` to every table.

Payment, job, payout, and audit records generally require historical retention and must not be casually deleted.

### 12.5 Audit Logs

Sensitive actions should create audit records.

Potential audited actions:

- Role changes.
- Account suspension.
- Payment creation.
- Refund initiation.
- Payout approval.
- Job reassignment.
- Manual price adjustment.
- Dispute resolution.
- Administrative data access.
- Configuration changes.

An audit log should capture:

```text
actor_id
actor_role
action
resource_type
resource_id
timestamp
request_id
metadata
before_snapshot or change summary
after_snapshot or change summary
```

Avoid storing secrets or unnecessary personal data in audit metadata.

---

## 13. Security Requirements

### 13.1 Secrets

All secrets must be stored in approved environment-variable systems.

Never commit:

- Square access tokens.
- Square webhook signature keys.
- Supabase service role keys.
- Database passwords.
- OAuth client secrets.
- Session secrets.
- Production URLs containing credentials.
- Private keys.

Provide `.env.example` with placeholder names only.

### 13.2 Environment Separation

Maintain separate configuration for:

- Local development.
- Test.
- Preview or staging.
- Production.

Do not use production credentials for local development.

### 13.3 Logging

Logs must be structured and minimal.

Include useful context such as:

```text
request_id
user_id
job_id
payment_id
event_type
status
error_code
```

Do not log:

- Passwords.
- Full access tokens.
- Raw card data.
- Sensitive authentication cookies.
- Full webhook secrets.
- Private user messages unless operationally required and approved.
- Full provider payloads by default.

### 13.4 Rate Limiting

Consider rate limiting for:

- Authentication endpoints.
- Registration.
- Password reset.
- Contact forms.
- Service request creation.
- Payment creation.
- Webhook endpoints.
- Search endpoints.
- Image upload endpoints.
- Administrative actions.

Rate limiting is not a substitute for authorization.

### 13.5 File Uploads

If job images are supported:

- Restrict file types.
- Restrict file size.
- Generate server-side filenames.
- Avoid trusting file extensions.
- Store metadata.
- Use signed access when images are private.
- Scan or process files when the risk requires it.
- Remove embedded metadata when appropriate.
- Do not expose another customer’s images.

### 13.6 Personally Identifiable Information

Collect only the personal information required to deliver the service.

Potential sensitive fields include:

- Home address.
- Phone number.
- Exact service location.
- Entry instructions.
- Photos of private spaces.
- Identity documents.
- Payment metadata.

Access must be restricted by role and job relationship.

### 13.7 Administrative Security

Administrator functionality should include stronger protections where practical:

- Separate protected routes.
- Explicit role checks.
- Reauthentication for highly sensitive actions.
- Audit logs.
- Reduced client exposure.
- Clear confirmation for destructive actions.
- Optional multi-factor authentication when supported.

---

## 14. UI and UX Standards

### 14.1 Design Goals

The product should feel:

- Legitimate.
- Safe.
- Clear.
- Local.
- Professional.
- Accessible.
- Practical.
- Easy to use on mobile devices.

Avoid designs that feel like an unverified classified ad, informal cash arrangement, or generic template.

### 14.2 Mobile First

Customers and handymen may use the platform from phones.

Every core workflow must work on a narrow viewport:

- Registration.
- Login.
- Service request creation.
- Image upload.
- Job acceptance.
- Job status updates.
- Payment.
- Review.
- Support.

### 14.3 Accessibility

Follow accessible interaction patterns.

At minimum:

- Semantic HTML.
- Keyboard navigation.
- Visible focus states.
- Proper labels.
- Accessible form errors.
- Sufficient contrast.
- Meaningful button text.
- Appropriate heading hierarchy.
- Alt text for meaningful images.
- Reduced-motion respect where relevant.
- Dialog focus management.
- No color-only status indicators.

### 14.4 shadcn/ui

Use shadcn/ui as editable source components, not as a black-box dependency.

Agents may modify generated components when needed, but should preserve:

- Accessibility behavior.
- Consistent variants.
- Design-token usage.
- Clear composition.

### 14.5 Images and Video

When creating marketing or landing-page components, add developer comments where visual assets are recommended.

Example:

```tsx
{/* Suggested visual:
    NYC apartment handyman repairing a cabinet.
    Use a licensed image from Envato Elements.
    Recommended aspect ratio: 16:10.
    Provide descriptive alt text.
*/}
```

Do not add random placeholder images from untrusted external domains.

Do not embed assets that the project does not have the right to use.

### 14.6 Loading, Empty, and Error States

Every data-dependent interface should account for:

- Loading.
- Empty state.
- Recoverable error.
- Unauthorized state.
- Not found.
- Payment processing.
- Payment failure.
- Duplicate submission.
- Offline or connection failure where relevant.

Do not leave blank screens or raw error objects.

---

## 15. Content and Marketing Standards

Ruiz Home Services will require marketing copy.

Copy should emphasize:

- Clear service requests.
- Reliable local help.
- Transparent minimum pricing.
- Secure payment handling.
- Job tracking.
- Customer and handyman accountability.
- New York City relevance.

Do not make unsupported claims such as:

- “All handymen are licensed” unless verified and required.
- “Fully insured” unless the business and every relevant provider are covered.
- “Background checked” unless the platform actually performs and maintains background checks.
- “Guaranteed” unless the guarantee terms are defined.
- “Instant service” unless operations support it.
- “Lowest price” without evidence.
- “Available across all five boroughs” unless operations support it.

Marketing claims must match operational reality.

---

## 16. Testing Requirements

Testing is required for business-critical work.

### 16.1 Test Pyramid

Use a practical mix of:

- Unit tests for pure domain logic.
- Integration tests for database and server behavior.
- Route or action tests for authorization and validation.
- End-to-end tests for critical user workflows.
- Manual testing for payment sandbox behavior and visual quality.

### 16.2 Required Payment Tests

At minimum, test:

- Correct minimum amount.
- Higher approved customer rate.
- Invalid amount rejection.
- Duplicate request handling.
- Idempotent retry.
- Provider failure.
- Timeout.
- Webhook retry.
- Duplicate webhook event.
- Invalid webhook signature.
- Refund.
- Partial refund, if supported.
- Payment status reconciliation.
- Unauthorized payment attempt.
- Customer attempting to pay for another customer’s job.
- Job state that is not payable.

### 16.3 Required Authorization Tests

At minimum, test:

- Anonymous user blocked.
- Customer can access own records.
- Customer cannot access another customer’s records.
- Handyman can access assigned work.
- Handyman cannot update unassigned work.
- Admin access works.
- Non-admin cannot access admin actions.
- Service-role actions are never exposed to the browser.

### 16.4 Required Billing Tests

At minimum, test:

- Zero minutes.
- Less than minimum duration.
- Exactly minimum duration.
- More than minimum duration.
- Partial billing increment.
- Multiple hours.
- Daylight Saving Time boundary if timestamp arithmetic is used.
- Manual adjustment permission.
- Negative input rejection.
- Very large input rejection.
- Currency consistency.

### 16.5 Test Before Proceeding

After implementing a material feature, agents must tell the developer exactly what to test before moving to dependent work.

A testing report should include:

```text
Automated tests run:
- command
- result

Manual tests required:
1. step
2. expected result
3. failure indicators

Known untested areas:
- area
- reason
```

Do not claim a feature works unless it was actually tested or the lack of testing is clearly stated.

---

## 17. Deployment and Infrastructure

### 17.1 Vercel

Vercel is the preferred primary deployment target.

Before deployment, verify:

- Build succeeds.
- Environment variables exist in the correct environment.
- Preview and production use separate credentials where required.
- Server-only variables are not exposed publicly.
- Database migrations are applied safely.
- Webhook URLs match the deployed environment.
- OAuth redirect URLs match the deployed environment.
- Payment sandbox and production modes are not mixed.

### 17.2 Heroku

Do not use Heroku by default.

Before introducing Heroku, document:

- The concrete capability Vercel cannot provide.
- The service boundary.
- Authentication between services.
- Network and secret management.
- Deployment process.
- Monitoring.
- Cost.
- Failure behavior.
- Local development workflow.

### 17.3 Background Work

Potential future background work includes:

- Email delivery.
- Notification processing.
- Webhook retries.
- Payment reconciliation.
- Payout processing.
- Image processing.
- Scheduled reminders.
- Abandoned-request cleanup.

Do not perform slow or retry-heavy work synchronously inside a user request if it creates reliability problems.

Use an approved queue, scheduled job, workflow system, or separate worker when needed.

### 17.4 Observability

Production systems should eventually support:

- Structured logs.
- Error monitoring.
- Request correlation.
- Payment reconciliation reports.
- Webhook failure visibility.
- Database performance monitoring.
- Deployment status.
- Uptime checks.

Do not add multiple overlapping observability vendors without a clear need.

---

## 18. Environment Variables

The exact names must follow the codebase, but likely categories include:

```text
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY (not currently read by app code)

SQUARE_ENVIRONMENT
SQUARE_ACCESS_TOKEN
SQUARE_LOCATION_ID
SQUARE_WEBHOOK_SIGNATURE_KEY
SQUARE_WEBHOOK_NOTIFICATION_URL

EMAIL_PROVIDER_API_KEY
EMAIL_FROM_ADDRESS

APP_ENCRYPTION_KEY
LOG_LEVEL
```

Rules:

- Only variables intentionally safe for the browser may use `NEXT_PUBLIC_`.
- Prefer modern Supabase publishable keys for browser and SSR clients.
- Do not use legacy anon key names in new code unless compatibility requires it and the decision is documented.
- Validate environment variables at startup.
- Fail clearly when required configuration is missing.
- Do not silently fall back from production to sandbox.
- Do not place real secret values in documentation.
- Keep `.env.example` current.
- Do not add `SUPABASE_SERVICE_ROLE_KEY` to runtime code until a narrowly scoped server-only service-role boundary is implemented and documented.

---

## 19. API and Service Integration Standards

Wrap external providers behind internal modules.

Example:

```text
lib/payments/square/
  client.ts
  create-payment.ts
  refund-payment.ts
  verify-webhook.ts
  map-status.ts
```

Application code should call internal domain functions, not scatter provider SDK calls across pages and route handlers.

Benefits:

- Easier tests.
- Easier provider changes.
- Centralized logging.
- Centralized error mapping.
- Less credential exposure.
- Consistent idempotency.
- Better control of retries.

When a provider changes its SDK or API, update the adapter rather than rewriting the application.

---

## 20. Email and Notifications

Transactional messages may include:

- Registration confirmation.
- Service-request confirmation.
- Assignment notification.
- Appointment reminder.
- Handyman arrival update.
- Payment confirmation.
- Payment failure.
- Refund confirmation.
- Job completion.
- Review request.
- Support update.

Email content must not expose unnecessary private information.

Every notification should have:

- A clear event source.
- A recipient.
- A stable template or content generator.
- A send status.
- Retry behavior.
- A link back to an authenticated application page where appropriate.

Do not send duplicate notifications on webhook retries or repeated server requests.

---

## 21. AI Features

AI may be added for:

- Summarizing customer requests.
- Categorizing tasks.
- Suggesting missing information.
- Drafting customer-facing descriptions.
- Assisting support staff.
- Detecting potentially unsafe or prohibited requests.

AI output must not be treated as authoritative for:

- Final pricing.
- Legal classification.
- Payment amount.
- Worker eligibility.
- Safety guarantees.
- Identity verification.
- Dispute resolution.
- Access control.
- Database permissions.

AI-generated content must be validated, reviewable, and auditable when it affects operations.

Do not send private customer data to an AI provider without an approved privacy and data-handling decision.

---

## 22. Coding Agent Operating Procedure

Every coding agent must follow this sequence.

### Step 1: Read Context

Read:

1. This `AGENTS.md`.
2. `README.md`.
3. `package.json`.
4. Relevant route files.
5. Relevant domain modules.
6. Relevant database migrations.
7. Relevant tests.
8. Relevant architecture documentation.
9. Current Git status and recent commits when available.

### Step 2: Restate the Task Internally

Determine:

- The user’s requested outcome.
- Which business rules apply.
- Which files are likely affected.
- Which assumptions are safe.
- Which assumptions are unresolved.
- Whether payments, authentication, authorization, or migrations are involved.
- Whether a destructive change is possible.

### Step 3: Inspect Before Editing

Do not generate a replacement architecture before understanding the current implementation.

Search for:

- Existing utilities.
- Existing types.
- Existing validation schemas.
- Existing database helpers.
- Existing payment adapters.
- Existing authorization checks.
- Existing UI components.
- Existing tests.
- Existing documentation.

Reuse or improve existing code rather than duplicating it.

### Step 4: Plan

For nontrivial work, produce a concise implementation plan.

The plan should include:

- Files to modify.
- New files to create.
- Schema changes.
- Security checks.
- Tests.
- Documentation updates.
- Risks.
- Unresolved decisions.

### Step 5: Implement Narrowly

Make the smallest coherent change that completes the task.

Avoid:

- Unrelated refactors.
- Framework migration.
- New state-management libraries without need.
- New backend services without need.
- Broad formatting changes.
- Renaming large areas without reason.
- Silent changes to business rules.

### Step 6: Validate

Run relevant checks.

Typical commands may include:

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

Use only scripts that actually exist in `package.json`.

For database work, run the repository’s approved Supabase migration and database-test workflow.

### Step 7: Manual Test Instructions

Tell the developer exactly what to test.

Payment features must use Square’s sandbox environment until production approval.

### Step 8: Report

The completion report must include:

```text
Summary:
- What changed.

Files:
- File path and purpose.

Business rules:
- Rules enforced or affected.

Security:
- Authentication, authorization, validation, and secret handling.

Tests:
- Commands run and results.

Manual verification:
- Exact steps.

Known limitations:
- Anything incomplete or unverified.

Documentation:
- Files updated.
```

### Step 9: Update Documentation

Update this file only when the project contract has changed.

Update other documentation when implementation details change.

---

## 23. Rules for Editing AGENTS.md

AI agents may update this file.

An agent must update this file when one of the following changes:

- Core business rules.
- Supported roles.
- Payment flow.
- Authentication provider.
- Database architecture.
- Hosting architecture.
- Required testing workflow.
- Security requirements.
- Approved service boundaries.
- Repository-wide conventions.
- Operational responsibilities.

An agent should not update this file for:

- A small component.
- A one-off bug fix.
- A temporary implementation detail.
- A minor copy edit.
- A local variable rename.
- An experiment not accepted into the project.

### 23.1 Update Requirements

When editing this file:

1. Preserve confirmed business rules.
2. Do not convert an unresolved decision into a confirmed fact.
3. Add a dated entry to the document history.
4. Keep terminology consistent.
5. Update related sections, not only one isolated sentence.
6. Remove obsolete instructions only when the code and approved decision support removal.
7. Explain the reason in the commit or completion report.
8. Do not add secrets, private credentials, or personal data.
9. Do not rewrite the entire file without need.
10. Keep this file aligned with the repository.

### 23.2 Conflict Handling

If this file conflicts with:

- The user’s explicit latest instruction: follow the user’s latest instruction and update this file.
- Confirmed code behavior: investigate. Do not assume the code is correct merely because it exists.
- Database constraints: treat the production data model as high risk and reconcile intentionally.
- Older documentation: prefer the newest approved source and update stale documents.
- Marketing copy: business logic and verified operations take precedence over marketing claims.

---

## 24. Git and Change Management

### 24.1 Before Editing

Inspect:

```bash
git status
git branch --show-current
git log -n 5 --oneline
```

Do not overwrite uncommitted user work.

### 24.2 Commit Scope

Commits should be focused.

Good examples:

```text
feat(payments): add idempotent Square payment creation
fix(auth): enforce customer ownership on service requests
test(billing): cover minimum hourly rate calculations
docs(agents): document webhook processing rules
```

### 24.3 Destructive Commands

Do not run destructive commands without explicit authorization.

Examples:

```bash
git reset --hard
git clean -fd
git checkout -- .
rm -rf
drop database
truncate table
supabase db reset
```

A local database reset may be appropriate in an approved test workflow, but the agent must state that it destroys local data.

### 24.4 Dependency Changes

Before adding a dependency:

- Confirm an existing dependency cannot solve the problem.
- Check maintenance and compatibility.
- Explain why it is needed.
- Avoid overlapping libraries.
- Update lockfiles.
- Run tests and build.
- Review client bundle impact if browser-side.

---

## 25. Documentation Standards

Potential documentation files:

```text
README.md
AGENTS.md
docs/ARCHITECTURE.md
docs/PAYMENTS.md
docs/AUTHORIZATION.md
docs/DATABASE.md
docs/DEPLOYMENT.md
docs/TESTING.md
docs/DECISIONS/
docs/RUNBOOKS/
```

Use Architecture Decision Records for important choices.

Example ADR topics:

- Supabase Auth versus Clerk.
- Deposit versus authorization.
- Marketplace assignment model.
- Handyman payout method.
- Vercel-only backend versus separate worker.
- Billing increment.
- Materials reimbursement.
- Cancellation policy.

Documentation must describe the current system, not an imaginary future system, unless clearly marked as proposed.

---

## 26. Prohibited Agent Behavior

An agent must not:

- Change the $30, $25, or $5 hourly rules without explicit approval.
- Use floating-point values for money.
- Trust payment amounts from the browser.
- Expose service-role or processor secrets.
- Skip authorization checks.
- Disable RLS to make development easier.
- Create duplicate charges during retries.
- Process unverified webhooks.
- Store raw card data.
- Add Heroku merely because an API is needed.
- Treat client-side route hiding as security.
- Add unsupported marketing claims.
- Invent legal compliance.
- Invent insurance, licensing, vetting, or background-check claims.
- Hide failing tests.
- Claim work is complete without stating untested areas.
- Run destructive commands without approval.
- Replace existing architecture without inspecting it.
- Duplicate business logic in multiple layers.
- Commit generated build output such as `.next/`.
- Commit `node_modules/`.
- Put real secrets in examples.
- silently broaden the task.

---

## 27. Open Decisions

The following items require explicit product or business decisions unless already resolved elsewhere in the repository.

### Marketplace Operations

- How are handymen matched to service requests?
- Can multiple handymen bid?
- Can customers select a handyman?
- Does an administrator assign jobs?
- Can handymen set custom rates above $25 per hour?
- Can customers voluntarily increase the hourly rate?
- How is the additional amount allocated?
- Which service categories are allowed?
- Are emergency jobs supported?
- Which NYC boroughs are supported at launch?

### Billing

- What is the minimum billable duration?
- What is the billing increment?
- Is travel time billable?
- How are materials handled?
- Are taxes added?
- Are tips supported?
- Are cancellations charged?
- Are no-shows charged?
- Are overtime or emergency surcharges supported?
- Who confirms start and end time?

### Payments

- Deposit, authorization, prepayment, or post-service payment?
- Can the final total exceed the authorized amount?
- How are adjustments approved?
- How are handymen paid?
- What is the payout schedule?
- Who absorbs refunds, disputes, and chargebacks?
- Is Ruiz Home Services the merchant of record?
- Is the $5 platform share a fee, retained revenue, or separate line item?

### Trust and Safety

- Are handymen identity verified?
- Are background checks performed?
- Are licenses required for certain categories?
- Is insurance required?
- Which tasks are prohibited?
- How are dangerous or regulated tasks handled?
- How are customer complaints handled?
- How are emergency situations handled?

### Authentication

- Supabase Auth or Clerk?
- Google OAuth at launch?
- Email and password at launch?
- Phone verification?
- Multi-factor authentication for administrators?
- Account recovery process?

### Communication

- In-app messaging?
- Email only?
- SMS?
- Masked phone numbers?
- Which communications must be retained?

Agents must not settle these questions implicitly.

---

## 28. Recommended Initial Delivery Order

Unless the repository is already further along, a practical implementation order is:

1. Project configuration and environment validation.
2. Authentication.
3. User profiles and roles.
4. Authorization helpers and RLS.
5. Customer service-request intake.
6. Administrative request review.
7. Handyman onboarding.
8. Job assignment.
9. Immutable pricing snapshots.
10. Square sandbox payment flow.
11. Webhook processing.
12. Job lifecycle.
13. Completion confirmation.
14. Refund and dispute foundations.
15. Handyman earnings and payout records.
16. Notifications.
17. Reviews.
18. Operational dashboards.
19. Production monitoring.
20. Production payment activation.

Do not implement production payment before authorization, pricing, idempotency, and webhook handling are reliable.

Current delivery status as of 2026-07-10:

- Items 1 through 4 have foundations implemented, but Phase 3 is not complete until sign-in UI, protected route shells, browser OAuth verification, and RLS/authorization tests are finished.
- Item 5 and later must not proceed as final product workflows until Phase 3 is complete.

---

## 29. Suggested Repository Evolution

The project may gradually evolve toward:

```text
app/
  (marketing)/
  (auth)/
  (customer)/
  (handyman)/
  (admin)/
  api/
components/
  ui/
  shared/
features/
  auth/
  customers/
  handymen/
  service-requests/
  jobs/
  payments/
  reviews/
lib/
  auth/
  config/
  db/
  errors/
  logging/
  payments/
  validation/
supabase/
  migrations/
  seed.sql
  tests/
docs/
tests/
```

This is a direction, not a mandatory one-time reorganization.

Avoid a large folder migration unless it solves a current problem and tests prove the application still works.

---

## 30. Definition of Done

A task is done only when all applicable items are true.

### Code

- The requested behavior exists.
- The code is modular.
- Business rules are centralized.
- Types are clear.
- No obvious duplicate logic was introduced.
- No secrets are exposed.

### Security

- Authentication is enforced.
- Authorization is enforced.
- Input is validated.
- Ownership is checked.
- Sensitive operations are server-side.
- Logs avoid protected data.

### Data

- Migrations are included.
- Constraints are appropriate.
- RLS is included and tested where relevant.
- Historical pricing remains stable.
- Audit requirements are addressed.

### Payments

- Amount is server-calculated.
- Idempotency is implemented.
- Payment state is persisted.
- Webhooks are verified and idempotent.
- Failure behavior is handled.
- Sandbox testing is completed.

### UI

- Mobile behavior is usable.
- Accessibility is considered.
- Loading, empty, and error states exist.
- Copy does not overpromise.

### Testing

- Relevant automated tests pass.
- Build passes.
- Manual testing instructions are provided.
- Untested areas are disclosed.

### Documentation

- Relevant docs are updated.
- `AGENTS.md` is updated only when the project contract changed.
- Environment examples are current.
- Important decisions are recorded.

---

## 31. Agent Response Style for This Repository

When reporting work to the developer:

- Be direct.
- Explain important reasoning.
- State assumptions.
- Correct flawed technical assumptions.
- Do not hide uncertainty.
- Use exact file paths.
- Use exact terminal commands.
- Distinguish completed work from proposed work.
- Distinguish automated tests from manual tests.
- State risks before high-risk changes.
- Give the developer a specific test checklist before dependent work proceeds.

For coding tasks, begin the proposed solution with pseudocode before presenting implementation code.

---

## 32. Document History

### 2026-07-10

- Documented the implemented Phase 3 Supabase Auth/Profile/Role backend foundation.
- Recorded the live Supabase project target `csmisxwwrcyzttvybnsn`.
- Recorded the Phase 3 database tables and RLS/grant boundaries.
- Updated environment-variable guidance to use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Clarified that sign-in UI, protected product route shells, browser OAuth verification, and automated RLS tests remain incomplete.

### 2026-07-08

- Created the initial comprehensive `AGENTS.md`.
- Documented the Ruiz Home Services product purpose.
- Recorded the confirmed hourly business model:
  - Customer minimum: $30 per hour.
  - Handyman minimum: $25 per hour.
  - Ruiz Home Services platform amount: $5 per hour.
- Established Next.js-first architecture.
- Established Square payment safety rules.
- Established Supabase, authorization, RLS, testing, deployment, and documentation standards.
- Recorded unresolved product, billing, payment, trust, and operations decisions.

---

## 33. Final Instruction to Every Agent

Before changing this repository, answer these questions internally:

1. What exact user outcome am I implementing?
2. Which confirmed business rules apply?
3. Is there already code that solves part of this?
4. What is the trusted source of truth?
5. Is this operation authenticated?
6. Is it authorized?
7. Is all input validated?
8. Could this create or move money?
9. Could a retry duplicate the action?
10. Could this expose another user’s data?
11. Does this require a migration?
12. Does this require RLS?
13. What automated tests prove it?
14. What must the developer test manually?
15. Does the documentation now need to change?

If the agent cannot answer these questions, it should not make a high-risk change until it has inspected the relevant code and identified the missing decision.
