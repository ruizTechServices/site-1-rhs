import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentAuth } from "@/lib/auth/session";
import type { Profile } from "@/lib/auth/types";

export async function getCurrentProfile(): Promise<Profile | null> {
  const auth = await getCurrentAuth();

  if (!auth) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.userId)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load the current profile.");
  }

  return data;
}
