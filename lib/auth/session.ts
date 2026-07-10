import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentAuth() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  if (error || !userId) {
    return null;
  }

  return {
    claims: data.claims,
    userId,
  };
}

export async function requireCurrentAuth(redirectTo = "/") {
  const auth = await getCurrentAuth();

  if (!auth) {
    redirect(redirectTo);
  }

  return auth;
}
