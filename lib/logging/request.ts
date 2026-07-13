import type { NextResponse } from "next/server";

const LARGE_HEADER_BYTES = 12_000;
const LARGE_COOKIE_BYTES = 8_000;

type CookieSize = {
  readonly bytes: number;
  readonly name: string;
};

function getHeaderByteEstimate(headers: Headers): number {
  let byteCount = 0;

  headers.forEach((value, key) => {
    byteCount += key.length + value.length + 4;
  });

  return byteCount;
}

function getCookieSizes(cookieHeader: string | null): readonly CookieSize[] {
  if (!cookieHeader) {
    return [];
  }

  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .map((cookie) => {
      const separatorIndex = cookie.indexOf("=");
      const name = separatorIndex >= 0 ? cookie.slice(0, separatorIndex) : cookie;

      return {
        bytes: cookie.length,
        name,
      };
    })
    .sort((first, second) => second.bytes - first.bytes);
}

export function createRequestId(headers?: Headers): string {
  const incomingRequestId = headers?.get("x-request-id")?.trim();

  if (incomingRequestId && /^[a-zA-Z0-9_.:-]{8,128}$/.test(incomingRequestId)) {
    return incomingRequestId;
  }

  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getRequestLogContext(request: Request, requestId: string) {
  const requestUrl = new URL(request.url);
  const cookieHeader = request.headers.get("cookie");
  const cookieSizes = getCookieSizes(cookieHeader);
  const cookieHeaderBytes = cookieHeader?.length ?? 0;
  const approximateHeaderBytes = getHeaderByteEstimate(request.headers);

  return {
    approximateHeaderBytes,
    cookieCount: cookieSizes.length,
    cookieHeaderBytes,
    host: request.headers.get("host"),
    largestCookies: cookieSizes.slice(0, 5),
    method: request.method,
    pathname: requestUrl.pathname,
    requestId,
    searchPresent: requestUrl.search.length > 0,
    userAgentPresent: Boolean(request.headers.get("user-agent")),
  };
}

export function getRequestSizeWarnings(request: Request) {
  const context = getRequestLogContext(request, createRequestId(request.headers));
  const warnings: string[] = [];

  if (context.approximateHeaderBytes >= LARGE_HEADER_BYTES) {
    warnings.push("large-headers");
  }

  if (context.cookieHeaderBytes >= LARGE_COOKIE_BYTES) {
    warnings.push("large-cookies");
  }

  return warnings;
}

export function attachRequestId(response: NextResponse, requestId: string): NextResponse {
  response.headers.set("x-request-id", requestId);
  return response;
}
