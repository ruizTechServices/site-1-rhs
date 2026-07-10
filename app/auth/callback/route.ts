import { NextResponse } from "next/server";
import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeRedirectPath(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(nextPath, requestUrl.origin), { status: 303 });
    }
  }

  const failureUrl = new URL("/", requestUrl.origin);
  failureUrl.searchParams.set("auth_error", "callback_failed");

  return NextResponse.redirect(failureUrl, { status: 303 });
}
