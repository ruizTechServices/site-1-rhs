# Structured JSON Logging Boundary

The structured JSON logging boundary is a dependency-free observability layer under `lib/logging`. `logger.ts` defines level-gated `logEvent()` output controlled by optional `LOG_LEVEL`, normalizes unknown errors, detects runtime context, redacts payloads, serializes JSON, and writes to the matching console method. `redaction.ts` removes emails, JWT-like values, long token-like secrets, sensitive keys, authorization headers, raw cookies, and set-cookie headers. `request.ts` creates or preserves request IDs, estimates aggregate header bytes, counts cookie bytes, lists the largest cookie names by size, and attaches `x-request-id` to responses. `auth.ts` masks user IDs and wraps auth failure or error logging. The layer is used by the request proxy, Supabase server client, login actions, auth callback, sign-out route, session/profile/role helpers, admin gate, initial role action, and client error boundary. Its purpose is practical diagnosis without leaking credentials or private user data. Current high-value events include protected-route redirects, claims lookup failures, cookie refreshes, invalid OAuth origins, callback exchange failures, role denials, admin denials, and request header sizes near HTTP 431 limits. This is application logging, not a durable audit log. It does not persist records, prove compliance, or replace future audit tables for sensitive admin, payment, deletion, role-management, or refund operations. The main failure mode is accidental context expansion by future callers. Any new log context must preserve the redaction contract and avoid raw request bodies, payment payloads, secrets, cookies, tokens, and unnecessary personally identifiable information. The `test:logging` verifier is intentionally static, so runtime behavior still needs manual inspection when diagnosing production-like failures. Payment logging will need stricter event design. Keep payloads small.

***
**System Dependencies and Connections:**
- [[Supabase Request Proxy Boundary]]
- [[Supabase Auth Start And Callback Flow]]
- [[Server Only Admin UUID Gate]]

Word Count: 252
