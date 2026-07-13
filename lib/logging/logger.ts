import { redactLogValue, type JsonValue } from "@/lib/logging/redaction";

export type LogLevel = "debug" | "error" | "info" | "warn";
export type LogContext = Record<string, unknown>;

const LEVEL_WEIGHTS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function getConfiguredLogLevel(): LogLevel {
  const configuredLevel =
    typeof process === "undefined" ? undefined : process.env.LOG_LEVEL;

  if (
    configuredLevel === "debug" ||
    configuredLevel === "info" ||
    configuredLevel === "warn" ||
    configuredLevel === "error"
  ) {
    return configuredLevel;
  }

  return "info";
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_WEIGHTS[level] >= LEVEL_WEIGHTS[getConfiguredLogLevel()];
}

function getRuntime(): string {
  const edgeRuntime = (globalThis as { EdgeRuntime?: unknown }).EdgeRuntime;

  if (typeof edgeRuntime === "string") {
    return "edge";
  }

  if (typeof window === "undefined") {
    return "server";
  }

  return "browser";
}

function writeLog(level: LogLevel, payload: JsonValue) {
  const serializedPayload = JSON.stringify(payload);

  if (level === "error") {
    console.error(serializedPayload);
    return;
  }

  if (level === "warn") {
    console.warn(serializedPayload);
    return;
  }

  if (level === "debug") {
    console.debug(serializedPayload);
    return;
  }

  console.info(serializedPayload);
}

export function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      errorMessage: error.message,
      errorName: error.name,
    };
  }

  if (!error || typeof error !== "object") {
    return {
      errorMessage: String(error ?? "Unknown error"),
      errorName: "UnknownError",
    };
  }

  const candidate = error as {
    code?: unknown;
    message?: unknown;
    name?: unknown;
    status?: unknown;
  };

  return {
    errorCode: typeof candidate.code === "string" ? candidate.code : null,
    errorMessage:
      typeof candidate.message === "string"
        ? candidate.message
        : "Unknown error",
    errorName: typeof candidate.name === "string" ? candidate.name : "Error",
    errorStatus: typeof candidate.status === "number" ? candidate.status : null,
  };
}

export function logEvent({
  context = {},
  event,
  level,
  message,
}: {
  readonly context?: LogContext;
  readonly event: string;
  readonly level: LogLevel;
  readonly message: string;
}) {
  if (!shouldLog(level)) {
    return;
  }

  writeLog(
    level,
    redactLogValue({
      context,
      event,
      level,
      message,
      runtime: getRuntime(),
      timestamp: new Date().toISOString(),
    }),
  );
}
