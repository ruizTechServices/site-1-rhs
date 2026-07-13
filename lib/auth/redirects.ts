import type { AppRole } from "@/lib/auth/types";

export function getSafeRedirectPath(
  value: string | null | undefined,
  fallback = "/",
): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\r") ||
    value.includes("\n")
  ) {
    return fallback;
  }

  return value;
}

export function getLoginRedirectPath(nextPath: string): string {
  const safeNextPath = getSafeRedirectPath(nextPath, "/account");
  const params = new URLSearchParams({ next: safeNextPath });

  return `/login?${params.toString()}`;
}

export function getLoginResultRedirectPath({
  error,
  nextPath,
  status,
}: {
  readonly error?: string;
  readonly nextPath: string;
  readonly status?: string;
}): string {
  const safeNextPath = getSafeRedirectPath(nextPath, "/account");
  const params = new URLSearchParams({ next: safeNextPath });

  if (status) {
    params.set("status", status);
  }

  if (error) {
    params.set("error", error);
  }

  return `/login?${params.toString()}`;
}

export function getForbiddenRedirectPath(role: AppRole): string {
  const params = new URLSearchParams({ authorization: `missing-${role}` });

  return `/account?${params.toString()}`;
}
