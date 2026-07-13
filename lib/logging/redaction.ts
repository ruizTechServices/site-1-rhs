export type JsonPrimitive = boolean | null | number | string;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const JWT_LIKE_PATTERN = /\beyJ[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}\b/g;
const LONG_SECRET_PATTERN = /\b(?:sb_[A-Za-z0-9_]{16,}|[A-Za-z0-9_-]{32,})\b/g;
const SENSITIVE_KEY_PATTERN =
  /password|secret|token|refresh|session|jwt|api[_-]?key|apikey|client[_-]?secret|email/i;
const RAW_HEADER_SECRET_KEY_PATTERN = /^(authorization|cookie|set-cookie)$/i;

function redactString(value: string): string {
  return value
    .replace(EMAIL_PATTERN, "[redacted-email]")
    .replace(JWT_LIKE_PATTERN, "[redacted-jwt]")
    .replace(LONG_SECRET_PATTERN, "[redacted-secret]");
}

export function redactLogValue(value: unknown, key = ""): JsonValue {
  if (key === "requestId") {
    return typeof value === "string" ? value : String(value ?? "");
  }

  if (RAW_HEADER_SECRET_KEY_PATTERN.test(key) || SENSITIVE_KEY_PATTERN.test(key)) {
    return "[redacted]";
  }

  if (value === null) {
    return null;
  }

  if (typeof value === "string") {
    return redactString(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (value instanceof Error) {
    return {
      errorMessage: redactString(value.message),
      errorName: value.name,
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactLogValue(item));
  }

  if (typeof value === "object" && value) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([entryKey, entryValue]) => [
        entryKey,
        redactLogValue(entryValue, entryKey),
      ]),
    );
  }

  return String(value);
}
