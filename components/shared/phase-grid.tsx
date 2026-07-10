import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ArchitecturePhase, PhaseStatus } from "@/lib/project/architecture-plan";

const statusVariant: Record<PhaseStatus, "success" | "warning" | "secondary" | "outline"> = {
  complete: "success",
  current: "warning",
  planned: "secondary",
  blocked: "outline",
};

export function PhaseGrid({
  phases,
}: {
  readonly phases: readonly ArchitecturePhase[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {phases.map((phase) => (
        <Card key={phase.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-base">{phase.title}</CardTitle>
              <Badge variant={statusVariant[phase.status]}>{phase.status}</Badge>
            </div>
            <CardDescription>{phase.id.replace("-", " ")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">{phase.objective}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
