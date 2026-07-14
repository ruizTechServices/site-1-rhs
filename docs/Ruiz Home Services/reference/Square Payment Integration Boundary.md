# Square Payment Integration Boundary

This reference note records payment constraints for future implementation. It is not an architecture node because the repository currently has no Square SDK adapter, payment route handler, webhook endpoint, pricing snapshot table, internal payment record, refund workflow, payout system, or Square environment variables consumed by runtime code.

The project direction still names Square as the intended processor. Any future implementation must calculate money in integer cents on the server, preserve the confirmed 3000/2500/500-cent hourly economics, avoid browser-authoritative amounts, use idempotency for money-moving requests, verify webhook signatures, store only non-sensitive processor references, and keep sandbox testing separate from production activation.

The unresolved policy decisions remain deposit versus authorization versus prepayment versus post-service payment, final amount adjustment, materials, taxes, tips, cancellation and no-show handling, payout schedule, merchant-of-record responsibility, refunds, and disputes. Do not implement payment code until those decisions are approved.

## Related Notes

- [[Ruiz Home Services Architecture Map]]
- [[Marketplace Service Lifecycle Decision Gates]]
- [[Structured JSON Logging Boundary]]
