import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";
import { logEvent } from "@/lib/logging/logger";
import {
  requireSupabasePublicConfig,
  type SupabasePublicConfig,
} from "@/lib/supabase/config";

export async function createSupabaseServerClient() {
  let config: SupabasePublicConfig;

  try {
    config = requireSupabasePublicConfig();
  } catch (error) {
    logEvent({
      context: {
        error,
      },
      event: "supabase.server.config_missing",
      level: "error",
      message: "Supabase server client could not be created because public config is missing.",
    });
    throw error;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          logEvent({
            context: {
              cookieCount: cookiesToSet.length,
              cookieNames: cookiesToSet.map(({ name }) => name),
            },
            event: "supabase.server.cookie_write_skipped",
            level: "debug",
            message: "Server Component cookie write skipped; proxy owns session refresh.",
          });
        }
      },
    },
  });
}
