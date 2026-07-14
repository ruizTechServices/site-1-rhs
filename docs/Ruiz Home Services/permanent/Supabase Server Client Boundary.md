# Supabase Server Client Boundary

The Supabase server client boundary centralizes authenticated database and auth access for Server Components, route handlers, and Server Actions. `lib/supabase/server.ts` imports `server-only`, validates public configuration through `requireSupabasePublicConfig()`, reads the Next.js cookie store, and creates a typed `@supabase/ssr` server client using `Database` types from `lib/supabase/database.types.ts`. This client uses the browser-safe Supabase URL and publishable key, not a service-role key. That is deliberate: current application code relies on the authenticated user's cookies and Supabase RLS rather than privileged backend bypass. Cookie writes are attempted when Supabase needs to refresh session state. If a Server Component cannot write cookies, the helper logs a debug event and lets the request proxy own session refresh. `lib/supabase/client.ts` provides the separate browser client for client-only surfaces, but the current architecture keeps authoritative reads and checks on the server. `lib/supabase/config.ts` defines the accepted public environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Missing config causes a clear thrown error for required client creation, while the proxy has a softer public-route fallback. The critical downstream dependency is that auth helpers, role lookups, profile queries, auth start actions, and callback handlers all use this single boundary. Future service-role usage must not be smuggled into this helper. It needs a separate, documented server-only module with narrow operations, audited callers, and tests that prove it never enters browser bundles or logs. Callers should avoid constructing ad hoc Supabase clients elsewhere, because duplicated clients usually create inconsistent cookie behavior, weaker typing, and hidden authorization assumptions. Environment examples must stay synchronized with this boundary. Typed responses reduce mapper drift.

***
**System Dependencies and Connections:**
- [[Supabase Request Proxy Boundary]]
- [[Supabase Profile Role RLS Foundation]]
- [[Structured JSON Logging Boundary]]

Word Count: 252
