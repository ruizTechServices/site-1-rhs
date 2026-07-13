import { logEvent, normalizeError } from "@/lib/logging/logger";

export function maskUserId(userId: string | null | undefined): string | null {
  if (!userId) {
    return null;
  }

  if (userId.length <= 12) {
    return `${userId.slice(0, 4)}...`;
  }

  return `${userId.slice(0, 8)}...${userId.slice(-4)}`;
}

export function logAuthFailure({
  context = {},
  error,
  event,
  message,
}: {
  readonly context?: Record<string, unknown>;
  readonly error: unknown;
  readonly event: string;
  readonly message: string;
}) {
  logEvent({
    context: {
      ...context,
      ...normalizeError(error),
    },
    event,
    level: "warn",
    message,
  });
}

export function logAuthError({
  context = {},
  error,
  event,
  message,
}: {
  readonly context?: Record<string, unknown>;
  readonly error: unknown;
  readonly event: string;
  readonly message: string;
}) {
  logEvent({
    context: {
      ...context,
      ...normalizeError(error),
    },
    event,
    level: "error",
    message,
  });
}
