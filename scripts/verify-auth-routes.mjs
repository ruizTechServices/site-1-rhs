import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const checks = [
  {
    file: "app/login/actions.ts",
    patterns: [
      "signInWithOtp",
      "emailRedirectTo",
      "shouldCreateUser: true",
      "signInWithOAuth",
      'provider: "google"',
      "redirectTo: callbackUrl.toString()",
      "auth.google_oauth_start_failed",
      "getSafeRedirectPath",
    ],
  },
  {
    file: "components/shared/site-shell.tsx",
    patterns: [
      "getSupabasePublicConfig() ? await getCurrentAuth() : null",
      "isSignedIn",
      'action="/auth/sign-out?next=/"',
    ],
  },
  {
    file: "app/account/page.tsx",
    patterns: [
      "requireCurrentAuthForPath(\"/account\")",
      "getProfileForUser",
      "getRolesForUser",
      "chooseInitialRole",
      "Are you a Homeowner, or a Handyman?",
      "isConfiguredAdminUser(auth.userId)",
    ],
  },
  {
    file: "app/account/actions.ts",
    patterns: [
      "\"use server\"",
      "isSelfAssignableRole",
      "claim_initial_app_role",
      "isConfiguredAdminUser(auth.userId)",
      "revalidatePath(\"/account\")",
    ],
  },
  {
    file: "app/customer/page.tsx",
    patterns: ["requireCurrentUserRoleForPath(\"customer\", \"/customer\")"],
  },
  {
    file: "app/handyman/page.tsx",
    patterns: ["requireCurrentUserRoleForPath(\"handyman\", \"/handyman\")"],
  },
  {
    file: "app/admin/page.tsx",
    patterns: [
      "requireConfiguredAdminForPath(\"/admin\")",
      "server-only Supabase user UUID allowlist",
    ],
    absentPatterns: ["requireCurrentUserRoleForPath(\"admin\", \"/admin\")"],
  },
  {
    file: "lib/auth/admin.ts",
    patterns: [
      "RHS_ADMIN_USER_IDS",
      "UUID_PATTERN",
      "isConfiguredAdminUser",
      "requireConfiguredAdminForPath",
      "auth.admin.path_denied",
    ],
    absentPatterns: ["email"],
  },
  {
    file: "lib/auth/types.ts",
    patterns: ["SELF_ASSIGNABLE_ROLES", "isSelfAssignableRole"],
  },
  {
    file: "supabase/migrations/20260710231035_phase3_claim_initial_app_role.sql",
    patterns: [
      "create or replace function public.claim_initial_app_role",
      "security definer",
      "requested_role not in",
      "'customer'::public.app_role",
      "'handyman'::public.app_role",
      "Admin is intentionally excluded.",
      "grant execute on function public.claim_initial_app_role(public.app_role) to authenticated",
    ],
  },
  {
    file: "app/auth/sign-out/route.ts",
    patterns: ["export async function POST", "origin && origin !== requestUrl.origin"],
    absentPatterns: ["export async function GET"],
  },
  {
    file: "lib/auth/session.ts",
    patterns: ["supabase.auth.getClaims()"],
    absentPatterns: ["getSession("],
  },
  {
    file: "lib/auth/roles.ts",
    patterns: ["role_assignments", "getForbiddenRedirectPath", "getLoginRedirectPath"],
    absentPatterns: ["getSession("],
  },
  {
    file: "lib/supabase/proxy.ts",
    patterns: [
      "PROTECTED_ROUTE_PREFIXES",
      '"/account", "/customer", "/handyman", "/admin"',
      "NextResponse.redirect",
      "supabase.auth.getClaims()",
    ],
    absentPatterns: ["getSession("],
  },
];

const failures = [];

for (const check of checks) {
  const contents = readFileSync(join(root, check.file), "utf8");

  for (const pattern of check.patterns ?? []) {
    if (!contents.includes(pattern)) {
      failures.push(`${check.file} is missing required pattern: ${pattern}`);
    }
  }

  for (const pattern of check.absentPatterns ?? []) {
    if (contents.includes(pattern)) {
      failures.push(`${check.file} contains forbidden pattern: ${pattern}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Auth route verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Auth route verification passed.");
