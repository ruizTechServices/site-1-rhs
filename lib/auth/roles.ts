import "server-only";

import { redirect } from "next/navigation";
import {
  getForbiddenRedirectPath,
  getLoginRedirectPath,
} from "@/lib/auth/redirects";
import { getCurrentAuth } from "@/lib/auth/session";
import type { AppRole } from "@/lib/auth/types";
import { maskUserId } from "@/lib/logging/auth";
import { logEvent, normalizeError } from "@/lib/logging/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getRolesForUser(userId: string): Promise<readonly AppRole[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("role_assignments")
    .select("role")
    .eq("user_id", userId);

  if (error) {
    logEvent({
      context: {
        ...normalizeError(error),
        userId: maskUserId(userId),
      },
      event: "auth.roles.load_failed",
      level: "error",
      message: "Unable to load roles for authenticated user.",
    });
    throw new Error("Unable to load user roles.");
  }

  const roles = data.map((assignment) => assignment.role);

  logEvent({
    context: {
      roleCount: roles.length,
      roles,
      userId: maskUserId(userId),
    },
    event: "auth.roles.loaded",
    level: "info",
    message: "Role lookup completed.",
  });

  return roles;
}

export async function getCurrentUserRoles(): Promise<readonly AppRole[]> {
  const auth = await getCurrentAuth();

  if (!auth) {
    return [];
  }

  return getRolesForUser(auth.userId);
}

export async function currentUserHasRole(role: AppRole): Promise<boolean> {
  const roles = await getCurrentUserRoles();

  return roles.includes(role);
}

export async function requireCurrentUserRole(role: AppRole, redirectTo = "/") {
  const auth = await getCurrentAuth();

  if (!auth) {
    logEvent({
      context: { redirectTo, requiredRole: role },
      event: "auth.role.required_redirect",
      level: "warn",
      message: "Role-protected request had no authenticated user.",
    });
    redirect(redirectTo);
  }

  const roles = await getRolesForUser(auth.userId);

  if (!roles.includes(role)) {
    logEvent({
      context: {
        assignedRoles: roles,
        redirectTo,
        requiredRole: role,
        userId: maskUserId(auth.userId),
      },
      event: "auth.role.denied",
      level: "warn",
      message: "Authenticated user lacked the required role.",
    });
    redirect(redirectTo);
  }

  return { auth, roles };
}

export async function requireCurrentUserRoleForPath(
  role: AppRole,
  currentPath: string,
) {
  const auth = await getCurrentAuth();

  if (!auth) {
    logEvent({
      context: { currentPath, requiredRole: role },
      event: "auth.role.path_required_redirect",
      level: "warn",
      message: "Role-protected path had no authenticated user.",
    });
    redirect(getLoginRedirectPath(currentPath));
  }

  const roles = await getRolesForUser(auth.userId);

  if (!roles.includes(role)) {
    logEvent({
      context: {
        assignedRoles: roles,
        currentPath,
        requiredRole: role,
        userId: maskUserId(auth.userId),
      },
      event: "auth.role.path_denied",
      level: "warn",
      message: "Authenticated user lacked the required role for path.",
    });
    redirect(getForbiddenRedirectPath(role));
  }

  return { auth, roles };
}
