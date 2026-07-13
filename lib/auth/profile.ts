import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentAuth } from "@/lib/auth/session";
import type { Profile } from "@/lib/auth/types";
import { maskUserId } from "@/lib/logging/auth";
import { logEvent, normalizeError } from "@/lib/logging/logger";

export async function getProfileForUser(userId: string): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    logEvent({
      context: {
        ...normalizeError(error),
        userId: maskUserId(userId),
      },
      event: "auth.profile.load_failed",
      level: "error",
      message: "Unable to load profile for authenticated user.",
    });
    throw new Error("Unable to load the requested profile.");
  }

  logEvent({
    context: {
      found: Boolean(data),
      userId: maskUserId(userId),
    },
    event: "auth.profile.loaded",
    level: "info",
    message: "Profile lookup completed.",
  });

  return data;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const auth = await getCurrentAuth();

  if (!auth) {
    return null;
  }

  return getProfileForUser(auth.userId);
}
