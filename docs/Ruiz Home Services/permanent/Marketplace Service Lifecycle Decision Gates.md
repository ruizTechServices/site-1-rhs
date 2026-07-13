# Marketplace Service Lifecycle Decision Gates

The marketplace service lifecycle is the product workflow direction, not yet an implemented data flow. The useful inbox note says homeowners and apartment renters submit special repair or furniture assembly requests, handymen receive alerts when jobs are available, a handyman can accept, and the homeowner then accepts the handyman and scheduled time. That is consistent with the project contract's high-level marketplace intent, but it leaves major decisions unresolved. The current code has no service request table, no alert system, no job assignment workflow, no scheduling engine, no messaging, no completion confirmation, and no payment integration. Therefore the architecture must treat this lifecycle as a gated future flow. A safe future path is: authenticated customer creates a validated service request; the server stores owner-scoped request data under RLS; an approved matching or assignment policy exposes eligible work to handymen; a handyman expresses acceptance through a server-validated transition; the customer confirms the worker and time; the system converts demand into an operational job with immutable pricing terms. Each transition needs an explicit state model, authorization checks, audit events where sensitive, and failure handling for rejection, timeout, cancellation, duplicate acceptance, or cross-user access. The customer-to-handyman acceptance handshake is especially risky because it defines who can see private address details, when price terms become binding, and when Square payment should happen. Until Gio approves dispatch, bidding, customer selection, supported categories, borough scope, notifications, and billing policies, product UI should continue to describe this as planned work rather than a live service. This node should drive future schema design, not substitute for it.

***
**System Dependencies & Connections:**
- [[Role Protected Route Shells]]
- [[Supabase Profile Role RLS Foundation]]
- [[Square Payment Integration Boundary]]

Word Count: 258
