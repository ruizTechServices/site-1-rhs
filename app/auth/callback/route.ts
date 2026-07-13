import { NextResponse } from "next/server";
import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { logAuthFailure } from "@/lib/logging/auth";
import { logEvent } from "@/lib/logging/logger";
import {
  attachRequestId,
  createRequestId,
  getRequestLogContext,
} from "@/lib/logging/request";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestId = createRequestId(request.headers);
  const startedAt = Date.now();
  const requestContext = getRequestLogContext(request, requestId);
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeRedirectPath(requestUrl.searchParams.get("next"));

  logEvent({
    context: {
      ...requestContext,
      hasCode: Boolean(code),
      nextPath,
    },
    event: "auth.callback.start",
    level: "info",
    message: "Auth callback route started.",
  });

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(new URL(nextPath, requestUrl.origin), {
        status: 303,
      });
      logEvent({
        context: {
          durationMs: Date.now() - startedAt,
          nextPath,
          requestId,
          status: 303,
        },
        event: "auth.callback.exchanged",
        level: "info",
        message: "Auth callback exchanged code for session.",
      });

      return attachRequestId(response, requestId);
    }

    logAuthFailure({
      context: {
        durationMs: Date.now() - startedAt,
        nextPath,
        requestId,
      },
      error,
      event: "auth.callback.exchange_failed",
      message: "Auth callback failed to exchange code for session.",
    });
  } else {
    logEvent({
      context: {
        durationMs: Date.now() - startedAt,
        nextPath,
        requestId,
      },
      event: "auth.callback.missing_code",
      level: "warn",
      message: "Auth callback was requested without an auth code.",
    });
  }

  const failureUrl = new URL("/", requestUrl.origin);
  failureUrl.searchParams.set("auth_error", "callback_failed");

  return attachRequestId(NextResponse.redirect(failureUrl, { status: 303 }), requestId);
}
