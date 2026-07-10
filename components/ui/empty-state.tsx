import * as React from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = React.ComponentProps<"div"> & {
  readonly title: string;
  readonly description: string;
};

export function EmptyState({
  title,
  description,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed bg-muted/40 p-8 text-center",
        className,
      )}
      {...props}
    >
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
