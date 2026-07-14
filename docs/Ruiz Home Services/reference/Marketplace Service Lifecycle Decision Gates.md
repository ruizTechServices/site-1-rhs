# Marketplace Service Lifecycle Decision Gates

This reference note preserves the raw product workflow idea without treating it as implemented architecture. The current repository has no service request schema, job assignment workflow, scheduling engine, alert system, messaging, completion confirmation, or payment integration.

The preserved concept is: homeowners and apartment renters submit repair or furniture assembly requests; handymen receive alerts when work is available; a handyman may accept; then the customer accepts the handyman and scheduled time. That concept is compatible with the project direction, but it depends on unresolved marketplace, billing, trust, notification, and payment decisions.

Use this note as planning context only. When implementation starts, split the work into verified architecture nodes for request intake, assignment/acceptance, scheduling, job state transitions, pricing snapshots, and payment authorization.

## Related Notes

- [[Ruiz Home Services Architecture Map]]
- [[Role Protected Route Shells]]
- [[Supabase Profile Role RLS Foundation]]
- [[Square Payment Integration Boundary]]
