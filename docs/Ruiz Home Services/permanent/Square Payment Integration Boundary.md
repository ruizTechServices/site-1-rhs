# Square Payment Integration Boundary

The Square payment integration boundary is approved direction but has no runtime implementation yet. The repository contains no Square SDK adapter, payment route handler, webhook endpoint, pricing snapshot table, internal payment record, refund workflow, payout system, or Square environment variables consumed by application code. The authoritative architecture requires Square for payment processing while keeping the application responsible for server-calculated amounts, idempotency, event reconciliation, auditability, and secret protection. Money must use integer minor units, with the confirmed minimum economics represented as 3000 cents paid by the customer, 2500 cents owed to the handyman, and 500 cents retained for platform upkeep per billable hour. The browser must never provide an authoritative final amount. A future flow should load a trusted job or pricing snapshot, calculate the payable amount on the server, create or reuse an internal payment record, call Square with a stable idempotency key, store non-sensitive processor references, and advance job state only after the required payment state is confirmed. Webhooks must verify Square signatures, process raw bodies correctly, deduplicate external event IDs, avoid logging sensitive payloads, and update only allowed internal state. The unresolved decisions are substantial: deposit, authorization, full prepayment, post-service payment, final adjustment approval, materials, taxes, tips, cancellation fees, no-shows, payout schedule, merchant-of-record responsibility, refunds, and disputes. Any implementation before those decisions risks encoding business policy accidentally. This boundary should remain a blocked architecture node until payment policy and tests are approved. Future notes should split checkout, webhooks, refunds, and payouts into separate nodes once code exists. Sandbox testing must precede production activation.

***
**System Dependencies & Connections:**
- [[Marketplace Service Lifecycle Decision Gates]]
- [[Structured JSON Logging Boundary]]
- [[Supabase Profile Role RLS Foundation]]

Word Count: 255
