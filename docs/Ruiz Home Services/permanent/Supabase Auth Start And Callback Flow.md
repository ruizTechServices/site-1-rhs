# Supabase Auth Start And Callback Flow

The Supabase auth start and callback flow is the implemented sign-in verification path for Phase 3. `/login` renders two server-action backed choices: Google OAuth and an email magic link. `app/login/actions.ts` treats form input as untrusted, normalizes the requested `next` path through `getSafeRedirectPath()`, validates email length and shape for magic links, and derives a callback origin from `NEXT_PUBLIC_APP_URL` or trusted request host headers. Both flows construct `/auth/callback?next=...` and ask Supabase Auth to create the external redirect. Google uses `signInWithOAuth()` with provider `google`; magic link uses `signInWithOtp()` with `shouldCreateUser: true`. Errors redirect back to `/login` with stable status keys rather than provider internals. `app/auth/callback/route.ts` receives the Supabase auth code, logs the attempt, exchanges the code for a cookie-backed session through the server client, and redirects to the sanitized next path with HTTP 303. Missing codes or exchange failures redirect to `/` with an auth error marker. `app/auth/sign-out/route.ts` is POST-only, checks same-origin when an Origin header exists, signs out through Supabase, and redirects to a sanitized next path. The important security property is that browser parameters choose navigation only, not identity or role. Identity comes from Supabase claims after callback. The main operational failure points are provider misconfiguration, invalid app origin, redirect allowlist gaps, missing Supabase config, or cookies rejected before callback/session refresh can complete. Manual verification still matters because app code can be correct while Supabase Dashboard, Google Cloud redirect URIs, and environment-specific callback allowlists are wrong. Automated checks only verify source patterns, not provider reachability. Provider configuration is outside the repository.

***
**System Dependencies & Connections:**
- [[Supabase Server Client Boundary]]
- [[Supabase Request Proxy Boundary]]
- [[Structured JSON Logging Boundary]]

Word Count: 250
