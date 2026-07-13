import { Hammer } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProtectedRouteShell } from "@/components/shared/protected-route-shell";
import { requireCurrentUserRoleForPath } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function HandymanPage() {
  await requireCurrentUserRoleForPath("handyman", "/handyman");

  return (
    <ProtectedRouteShell
      badge="Handyman role required"
      roleLabel="handyman"
      title="Handyman shell"
      description="This protected route verifies that the signed-in user has the trusted handyman role. Job acceptance and work tracking remain unresolved."
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hammer aria-hidden="true" />
            Handyman workflow status
          </CardTitle>
          <CardDescription>
            Assignment, availability, earnings, and payout behavior are not implemented.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            Future work must define onboarding requirements, assignment policy, job visibility,
            and payout rules before this shell becomes an operational surface.
          </p>
        </CardContent>
      </Card>
    </ProtectedRouteShell>
  );
}
