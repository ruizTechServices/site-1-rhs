import type { Enums, Tables } from "@/lib/supabase/database.types";

export type AppRole = Enums<"app_role">;
export type Profile = Tables<"profiles">;

export const APP_ROLES = ["customer", "handyman", "admin"] as const satisfies readonly AppRole[];
