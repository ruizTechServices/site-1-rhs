# Supabase Request Proxy Boundary

The Supabase request proxy is the first application-owned boundary for every non-static request. The root `proxy.ts` delegates directly to `updateSupabaseSession()` in `lib/supabase/proxy.ts`, and the matcher excludes static Next assets and common image files. Inside the proxy, the request receives or preserves an `x-request-id`, builds structured request context, and marks whether the path is protected. The protected prefixes are `/account`, `/customer`, `/handyman`, and `/admin`. Public requests may continue without a Supabase session, but protected requests must produce a verified Supabase claims subject. The proxy creates a typed `@supabase/ssr` server client using the public Supabase URL and publishable key, then allows Supabase to refresh cookies through the response. Cookie values are never logged; only names and aggregate sizes are recorded. If public Supabase config is missing, public routes continue while protected routes redirect to `/login?next=...`. If claims lookup fails or no user is present on a protected path, the proxy redirects before page rendering. Successful authenticated requests continue with a refreshed response and request ID attached. This proxy is not the only authorization layer. It proves the request has a session before protected route rendering, but role and admin checks still happen inside server modules and route pages. The failure mode to watch is a request rejected before proxy execution, such as HTTP 431 from oversized browser cookies. In that case, the application cannot emit logs for the rejected request. Future protected prefixes must be added here and in static verification scripts together, otherwise pages may rely only on later render-time checks.

***
**System Dependencies and Connections:**
- [[Supabase Server Client Boundary]]
- [[Structured JSON Logging Boundary]]
- [[Role Protected Route Shells]]

Word Count: 250
