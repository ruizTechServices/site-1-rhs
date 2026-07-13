"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logEvent } from "@/lib/logging/logger";

export default function Error({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    logEvent({
      context: {
        digest: error.digest ?? null,
        message: error.message,
        pathname: window.location.pathname,
      },
      event: "client.error_boundary",
      level: "error",
      message: "Client error boundary rendered.",
    });
  }, [error]);

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          The scaffold caught an unexpected rendering error. Retry the render, then inspect the server logs if it repeats.
        </p>
        <div>
          <Button onClick={reset}>Retry</Button>
        </div>
      </div>
    </main>
  );
}
