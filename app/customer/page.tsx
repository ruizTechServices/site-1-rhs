import { ClipboardList } from "lucide-react";
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

export default async function CustomerPage() {
  await requireCurrentUserRoleForPath("customer", "/customer");

  return (
    <ProtectedRouteShell
      badge="Customer role required"
      roleLabel="customer"
      title="Customer shell"
      description="This protected route verifies that the signed-in user has the trusted customer role. Service-request creation is still intentionally blocked."
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList aria-hidden="true" />
            Customer workflow status
          </CardTitle>
          <CardDescription>
            This is a route shell, not a service-request product screen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            The next approved phase must add customer service-request intake with server
            validation, ownership checks, and RLS tests before any customer data workflow is live.
          </p>
        </CardContent>
      </Card>
    </ProtectedRouteShell>
  );
}
