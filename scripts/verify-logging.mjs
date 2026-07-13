import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const checks = [
  {
    file: "lib/logging/logger.ts",
    patterns: ["logEvent", "normalizeError", "JSON.stringify", "redactLogValue"],
  },
  {
    file: "lib/logging/request.ts",
    patterns: [
      "createRequestId",
      "getRequestLogContext",
      "approximateHeaderBytes",
      "cookieHeaderBytes",
      "largestCookies",
    ],
  },
  {
    file: "lib/logging/redaction.ts",
    patterns: ["redactLogValue", "EMAIL_PATTERN", "JWT_LIKE_PATTERN"],
  },
  {
    file: "lib/supabase/proxy.ts",
    patterns: [
      "request.proxy.start",
      "request.headers.near_limit",
      "request.proxy.complete",
      "auth.proxy.claims_failed",
      "attachRequestId",
      "maskUserId(userId)",
    ],
  },
  {
    file: "app/login/actions.ts",
    patterns: [
      "auth.google.start",
      "auth.google_oauth_start_failed",
      "auth.magic_link.start",
      "auth.magic_link_start_failed",
    ],
  },
  {
    file: "app/auth/callback/route.ts",
    patterns: ["auth.callback.start", "auth.callback.exchanged", "auth.callback.exchange_failed"],
  },
  {
    file: "app/auth/sign-out/route.ts",
    patterns: ["auth.sign_out.start", "auth.sign_out.completed", "auth.sign_out.failed"],
  },
  {
    file: "app/error.tsx",
    patterns: ["client.error_boundary", "logEvent"],
  },
  {
    file: "lib/supabase/server.ts",
    patterns: ["supabase.server.config_missing", "supabase.server.cookie_write_skipped"],
  },
];

const failures = [];

for (const check of checks) {
  const contents = readFileSync(join(root, check.file), "utf8");

  for (const pattern of check.patterns) {
    if (!contents.includes(pattern)) {
      failures.push(`${check.file} is missing required logging pattern: ${pattern}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Logging verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Logging verification passed.");
