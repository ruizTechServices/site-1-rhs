import "server-only";

import { redirect } from "next/navigation";
import { getCurrentAuth } from "@/lib/auth/session";
import type { AppRole } from "@/lib/auth/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUserRoles(): Promise<readonly AppRole[]> {
  const auth = await getCurrentAuth();

  if (!auth) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("role_assignments")
    .select("role")
    .eq("user_id", auth.userId);

  if (error) {
    throw new Error("Unable to load current user roles.");
  }

  return data.map((assignment) => assignment.role);
}

export async function currentUserHasRole(role: AppRole): Promise<boolean> {
  const roles = await getCurrentUserRoles();

  return roles.includes(role);
}

export async function requireCurrentUserRole(role: AppRole, redirectTo = "/") {
  const hasRole = await currentUserHasRole(role);

  if (!hasRole) {
    redirect(redirectTo);
  }
}
