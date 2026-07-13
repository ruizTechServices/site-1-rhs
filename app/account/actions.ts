"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isConfiguredAdminUser } from "@/lib/auth/admin";
import { requireCurrentAuthForPath } from "@/lib/auth/session";
import {
  isSelfAssignableRole,
  type SelfAssignableRole,
} from "@/lib/auth/types";
import { maskUserId } from "@/lib/logging/auth";
import { logEvent, normalizeError } from "@/lib/logging/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ROLE_DESTINATIONS: Record<SelfAssignableRole, string> = {
  customer: "/customer",
  handyman: "/handyman",
};

function parseRequestedRole(value: FormDataEntryValue | null): SelfAssignableRole | null {
  return isSelfAssignableRole(value) ? value : null;
}

export async function chooseInitialRole(formData: FormData) {
  const requestedRole = parseRequestedRole(formData.get("role"));

  if (!requestedRole) {
    logEvent({
      event: "auth.initial_role.invalid_request",
      level: "warn",
      message: "Initial role selection received an invalid role value.",
    });
    redirect("/account?role-selection=invalid");
  }

  const auth = await requireCurrentAuthForPath("/account");

  if (isConfiguredAdminUser(auth.userId)) {
    logEvent({
      context: {
        requestedRole,
        userId: maskUserId(auth.userId),
      },
      event: "auth.initial_role.admin_blocked",
      level: "warn",
      message: "Configured admin attempted to self-assign a customer or handyman role.",
    });
    redirect("/account?role-selection=admin-managed");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("claim_initial_app_role", {
    requested_role: requestedRole,
  });

  if (error) {
    logEvent({
      context: {
        ...normalizeError(error),
        requestedRole,
        userId: maskUserId(auth.userId),
      },
      event: "auth.initial_role.claim_failed",
      level: "warn",
      message: "Initial role claim failed.",
    });
    redirect("/account?role-selection=failed");
  }

  logEvent({
    context: {
      requestedRole,
      userId: maskUserId(auth.userId),
    },
    event: "auth.initial_role.claimed",
    level: "info",
    message: "Initial customer or handyman role was claimed.",
  });

  revalidatePath("/account");
  revalidatePath(ROLE_DESTINATIONS[requestedRole]);
  redirect(ROLE_DESTINATIONS[requestedRole]);
}
