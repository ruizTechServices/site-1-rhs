import "server-only";

import { redirect } from "next/navigation";
import { getLoginRedirectPath } from "@/lib/auth/redirects";
import { maskUserId } from "@/lib/logging/auth";
import { logEvent, normalizeError } from "@/lib/logging/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentAuth() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  if (error || !userId) {
    if (error) {
      logEvent({
        context: normalizeError(error),
        event: "auth.session.claims_failed",
        level: "warn",
        message: "Supabase claims lookup failed while resolving current auth.",
      });
    }

    return null;
  }

  logEvent({
    context: {
      userId: maskUserId(userId),
    },
    event: "auth.session.resolved",
    level: "info",
    message: "Current Supabase auth session resolved.",
  });

  return {
    claims: data.claims,
    userId,
  };
}

export async function requireCurrentAuth(redirectTo = "/") {
  const auth = await getCurrentAuth();

  if (!auth) {
    logEvent({
      context: { redirectTo },
      event: "auth.session.required_redirect",
      level: "warn",
      message: "Required auth session was missing.",
    });
    redirect(redirectTo);
  }

  return auth;
}

export async function requireCurrentAuthForPath(currentPath: string) {
  return requireCurrentAuth(getLoginRedirectPath(currentPath));
}
