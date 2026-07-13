import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";
import { logAuthFailure, maskUserId } from "@/lib/logging/auth";
import { logEvent, normalizeError } from "@/lib/logging/logger";
import {
  attachRequestId,
  createRequestId,
  getRequestLogContext,
} from "@/lib/logging/request";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

const PROTECTED_ROUTE_PREFIXES = ["/account", "/customer", "/handyman", "/admin"] as const;

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function getLoginRedirectResponse(
  request: NextRequest,
  requestId: string,
): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return attachRequestId(NextResponse.redirect(loginUrl, { status: 307 }), requestId);
}

export async function updateSupabaseSession(request: NextRequest) {
  const requestId = createRequestId(request.headers);
  const startedAt = Date.now();
  const requestContext = getRequestLogContext(request, requestId);
  const protectedPath = isProtectedPath(request.nextUrl.pathname);

  logEvent({
    context: {
      ...requestContext,
      protectedPath,
    },
    event: "request.proxy.start",
    level: "info",
    message: "Proxy request started.",
  });

  if (
    requestContext.approximateHeaderBytes >= 12_000 ||
    requestContext.cookieHeaderBytes >= 8_000
  ) {
    logEvent({
      context: {
        ...requestContext,
        protectedPath,
      },
      event: "request.headers.near_limit",
      level: "warn",
      message: "Request headers or cookies are large enough to risk HTTP 431.",
    });
  }

  function completeResponse(
    response: NextResponse,
    outcome: string,
    status: number,
    extraContext: Record<string, unknown> = {},
  ) {
    attachRequestId(response, requestId);
    logEvent({
      context: {
        ...requestContext,
        ...extraContext,
        durationMs: Date.now() - startedAt,
        outcome,
        protectedPath,
        status,
      },
      event: "request.proxy.complete",
      level: "info",
      message: "Proxy request completed.",
    });

    return response;
  }

  const config = getSupabasePublicConfig();

  if (!config) {
    logEvent({
      context: {
        ...requestContext,
        protectedPath,
      },
      event: "supabase.config.missing_public",
      level: protectedPath ? "error" : "warn",
      message: "Supabase public configuration is missing.",
    });

    if (protectedPath) {
      return completeResponse(
        getLoginRedirectResponse(request, requestId),
        "redirect-login-missing-config",
        307,
      );
    }

    return completeResponse(
      NextResponse.next({ request }),
      "next-missing-config",
      200,
    );
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        logEvent({
          context: {
            cookieCount: cookiesToSet.length,
            cookieNames: cookiesToSet.map(({ name }) => name),
            requestId,
          },
          event: "supabase.proxy.cookies_set",
          level: "info",
          message: "Supabase proxy cookie refresh wrote response cookies.",
        });

        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  if (error) {
    logAuthFailure({
      context: {
        ...requestContext,
        protectedPath,
      },
      error,
      event: "auth.proxy.claims_failed",
      message: "Supabase claims lookup failed in proxy.",
    });
  }

  if (protectedPath && (error || !userId)) {
    return completeResponse(
      getLoginRedirectResponse(request, requestId),
      "redirect-login-auth-required",
      307,
      {
        authState: error ? "claims-error" : "missing-user",
      },
    );
  }

  if (userId) {
    logEvent({
      context: {
        requestId,
        userId: maskUserId(userId),
      },
      event: "auth.proxy.session_present",
      level: "info",
      message: "Proxy verified a Supabase-authenticated request.",
    });
  }

  return completeResponse(response, "next", 200, {
    authState: userId ? "authenticated" : "anonymous",
    supabaseError: error ? normalizeError(error) : null,
  });
}
