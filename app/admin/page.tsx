import { ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProtectedRouteShell } from "@/components/shared/protected-route-shell";
import { requireConfiguredAdminForPath } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireConfiguredAdminForPath("/admin");

  return (
    <ProtectedRouteShell
      badge="Configured admin required"
      roleLabel="admin"
      title="Admin shell"
      description="This protected route verifies a server-only Supabase user UUID allowlist. It does not trust Google email, client metadata, or database role assignment alone."
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" />
            Admin workflow status
          </CardTitle>
          <CardDescription>
            Role assignment, audit logging, payment review, and dispute tools are blocked.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            Any future admin operation must use this server-side admin boundary, avoid client
            role trust, and document the service-role boundary before it can mutate privileged
            data.
          </p>
        </CardContent>
      </Card>
    </ProtectedRouteShell>
  );
}
