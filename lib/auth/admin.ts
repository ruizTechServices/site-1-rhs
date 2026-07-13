import "server-only";

import { redirect } from "next/navigation";
import { getForbiddenRedirectPath, getLoginRedirectPath } from "@/lib/auth/redirects";
import { getCurrentAuth } from "@/lib/auth/session";
import { maskUserId } from "@/lib/logging/auth";
import { logEvent } from "@/lib/logging/logger";

const ADMIN_USER_IDS_ENV = "RHS_ADMIN_USER_IDS";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseConfiguredAdminUserIds(): readonly string[] {
  const rawValue = process.env[ADMIN_USER_IDS_ENV];

  if (!rawValue) {
    return [];
  }

  const entries = rawValue
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  const validUserIds = entries.filter((entry) => UUID_PATTERN.test(entry));
  const invalidCount = entries.length - validUserIds.length;

  if (invalidCount > 0) {
    logEvent({
      context: {
        envName: ADMIN_USER_IDS_ENV,
        invalidCount,
        validCount: validUserIds.length,
      },
      event: "auth.admin_config.invalid_user_ids",
      level: "error",
      message: "Admin UUID allowlist contains invalid entries.",
    });
  }

  return [...new Set(validUserIds)];
}

export function getConfiguredAdminUserIds(): readonly string[] {
  return parseConfiguredAdminUserIds();
}

export function isConfiguredAdminUser(userId: string): boolean {
  return getConfiguredAdminUserIds().includes(userId.toLowerCase());
}

export async function requireConfiguredAdminForPath(currentPath: string) {
  const auth = await getCurrentAuth();

  if (!auth) {
    logEvent({
      context: { currentPath },
      event: "auth.admin.path_required_redirect",
      level: "warn",
      message: "Admin-protected path had no authenticated user.",
    });
    redirect(getLoginRedirectPath(currentPath));
  }

  if (!isConfiguredAdminUser(auth.userId)) {
    logEvent({
      context: {
        currentPath,
        userId: maskUserId(auth.userId),
      },
      event: "auth.admin.path_denied",
      level: "warn",
      message: "Authenticated user is not in the configured admin UUID allowlist.",
    });
    redirect(getForbiddenRedirectPath("admin"));
  }

  logEvent({
    context: {
      currentPath,
      userId: maskUserId(auth.userId),
    },
    event: "auth.admin.path_allowed",
    level: "info",
    message: "Configured admin UUID allowlist granted access.",
  });

  return auth;
}
