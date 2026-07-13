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

export async function POST(request: Request) {
  const requestId = createRequestId(request.headers);
  const startedAt = Date.now();
  const requestContext = getRequestLogContext(request, requestId);
  const requestUrl = new URL(request.url);

  const origin = request.headers.get("origin");
  if (origin && origin !== requestUrl.origin) {
    logEvent({
      context: {
        ...requestContext,
        originPresent: true,
        status: 403,
      },
      event: "auth.sign_out.forbidden_origin",
      level: "warn",
      message: "Sign-out request failed same-origin validation.",
    });
    return attachRequestId(NextResponse.json({ error: "Forbidden" }, { status: 403 }), requestId);
  }

  const nextPath = getSafeRedirectPath(requestUrl.searchParams.get("next"));
  const supabase = await createSupabaseServerClient();

  logEvent({
    context: {
      ...requestContext,
      nextPath,
    },
    event: "auth.sign_out.start",
    level: "info",
    message: "Sign-out request started.",
  });

  const { error } = await supabase.auth.signOut();

  if (error) {
    logAuthFailure({
      context: {
        durationMs: Date.now() - startedAt,
        nextPath,
        requestId,
      },
      error,
      event: "auth.sign_out.failed",
      message: "Supabase sign-out failed.",
    });
  } else {
    logEvent({
      context: {
        durationMs: Date.now() - startedAt,
        nextPath,
        requestId,
        status: 303,
      },
      event: "auth.sign_out.completed",
      level: "info",
      message: "Supabase sign-out completed.",
    });
  }

  return attachRequestId(
    NextResponse.redirect(new URL(nextPath, requestUrl.origin), { status: 303 }),
    requestId,
  );
}
