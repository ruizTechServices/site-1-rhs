import { Hammer, Home, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { chooseInitialRole } from "@/app/account/actions";
import { ProtectedRouteShell } from "@/components/shared/protected-route-shell";
import { isConfiguredAdminUser } from "@/lib/auth/admin";
import { getProfileForUser } from "@/lib/auth/profile";
import { getRolesForUser } from "@/lib/auth/roles";
import { requireCurrentAuthForPath } from "@/lib/auth/session";
import { APP_ROLES, type AppRole } from "@/lib/auth/types";

export const dynamic = "force-dynamic";

type AccountSearchParams = Record<string, string | string[] | undefined>;

type AccountPageProps = {
  readonly searchParams?: Promise<AccountSearchParams>;
};

function getSingleSearchParam(
  params: AccountSearchParams | undefined,
  key: string,
): string | null {
  const value = params?.[key];

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function getMissingRole(params: AccountSearchParams | undefined): AppRole | null {
  const value = getSingleSearchParam(params, "authorization");
  const role = value?.replace("missing-", "");

  if (APP_ROLES.includes(role as AppRole)) {
    return role as AppRole;
  }

  return null;
}

function getRoleSelectionStatus(params: AccountSearchParams | undefined): string | null {
  return getSingleSearchParam(params, "role-selection");
}

function formatUserId(userId: string): string {
  return `${userId.slice(0, 8)}...${userId.slice(-4)}`;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const missingRole = getMissingRole(params);
  const auth = await requireCurrentAuthForPath("/account");
  const [profile, roles] = await Promise.all([
    getProfileForUser(auth.userId),
    getRolesForUser(auth.userId),
  ]);
  const isConfiguredAdmin = isConfiguredAdminUser(auth.userId);
  const effectiveRoles = isConfiguredAdmin
    ? (["admin", ...roles.filter((role) => role !== "admin")] as readonly AppRole[])
    : roles;
  const shouldShowRoleSelection = !isConfiguredAdmin && roles.length === 0;
  const roleSelectionStatus = getRoleSelectionStatus(params);
  const email =
    typeof auth.claims.email === "string"
      ? auth.claims.email
      : profile?.email ?? "Not provided";

  return (
    <ProtectedRouteShell
      badge="Authenticated account"
      title="Account boundary"
      description="This is the Phase 3 signed-in account shell. It verifies the Supabase session and displays only the current user's own profile and role context."
    >
      {missingRole && !shouldShowRoleSelection ? (
        <Card className="border-warning bg-warning/35">
          <CardHeader>
            <CardTitle>Role required</CardTitle>
            <CardDescription>
              Your account does not currently have the `{missingRole}` role assignment.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {roleSelectionStatus === "failed" ? (
        <Card className="border-destructive/40 bg-destructive/10">
          <CardHeader>
            <CardTitle>Role selection was not saved</CardTitle>
            <CardDescription>
              Confirm the `claim_initial_app_role` Supabase migration has been applied, then
              try again.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {roleSelectionStatus === "admin-managed" ? (
        <Card className="border-warning bg-warning/35">
          <CardHeader>
            <CardTitle>Admin account is managed separately</CardTitle>
            <CardDescription>
              Configured administrators are verified by server-only UUID allowlist, not by
              customer or handyman self-selection.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {shouldShowRoleSelection ? (
        <Card>
          <CardHeader>
            <CardTitle>Are you a Homeowner, or a Handyman?</CardTitle>
            <CardDescription>
              Choose the initial account type for this Supabase user. This creates a trusted
              role assignment for the current authenticated user only.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <form action={chooseInitialRole}>
              <input type="hidden" name="role" value="customer" />
              <Button type="submit" variant="outline" className="h-auto w-full justify-start gap-3 p-4">
                <Home aria-hidden="true" />
                <span className="text-left">
                  <span className="block font-semibold">Homeowner</span>
                  <span className="block text-sm font-normal text-muted-foreground">
                    Create the customer route/profile shell.
                  </span>
                </span>
              </Button>
            </form>
            <form action={chooseInitialRole}>
              <input type="hidden" name="role" value="handyman" />
              <Button type="submit" variant="outline" className="h-auto w-full justify-start gap-3 p-4">
                <Hammer aria-hidden="true" />
                <span className="text-left">
                  <span className="block font-semibold">Handyman</span>
                  <span className="block text-sm font-normal text-muted-foreground">
                    Create the handyman route/profile shell.
                  </span>
                </span>
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound aria-hidden="true" />
            Current user
          </CardTitle>
          <CardDescription>
            Profile data is loaded through Supabase RLS using the authenticated user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-md border bg-background p-4">
              <dt className="text-muted-foreground">User ID</dt>
              <dd className="mt-1 font-medium">{formatUserId(auth.userId)}</dd>
            </div>
            <div className="rounded-md border bg-background p-4">
              <dt className="text-muted-foreground">Email identity</dt>
              <dd className="mt-1 break-words font-medium">{email}</dd>
            </div>
            <div className="rounded-md border bg-background p-4">
              <dt className="text-muted-foreground">Display name</dt>
              <dd className="mt-1 font-medium">{profile?.display_name ?? "Not set"}</dd>
            </div>
            <div className="rounded-md border bg-background p-4">
              <dt className="text-muted-foreground">Effective roles</dt>
              <dd className="mt-1 font-medium">
                {effectiveRoles.length > 0 ? effectiveRoles.join(", ") : "No role assigned"}
              </dd>
            </div>
            <div className="rounded-md border bg-background p-4 sm:col-span-2">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck aria-hidden="true" className="size-4" />
                Admin verification
              </dt>
              <dd className="mt-1 font-medium">
                {isConfiguredAdmin
                  ? "Configured by server-only Supabase user UUID allowlist"
                  : "Not in the server-only admin UUID allowlist"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session controls</CardTitle>
          <CardDescription>
            Sign-out is POST-only and clears the current Supabase session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/auth/sign-out?next=/" method="post">
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </ProtectedRouteShell>
  );
}
