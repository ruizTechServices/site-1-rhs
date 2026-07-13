import type { Enums, Tables } from "@/lib/supabase/database.types";

export type AppRole = Enums<"app_role">;
export type Profile = Tables<"profiles">;
export type SelfAssignableRole = Extract<AppRole, "customer" | "handyman">;

export const APP_ROLES = ["customer", "handyman", "admin"] as const satisfies readonly AppRole[];
export const SELF_ASSIGNABLE_ROLES = [
  "customer",
  "handyman",
] as const satisfies readonly SelfAssignableRole[];

export function isSelfAssignableRole(value: unknown): value is SelfAssignableRole {
  return (
    typeof value === "string" &&
    SELF_ASSIGNABLE_ROLES.includes(value as SelfAssignableRole)
  );
}
