import { NextResponse } from "next/server";
import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const nextPath = getSafeRedirectPath(requestUrl.searchParams.get("next"));
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin), { status: 303 });
}
