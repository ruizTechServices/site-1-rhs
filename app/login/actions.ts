"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  getLoginResultRedirectPath,
  getSafeRedirectPath,
} from "@/lib/auth/redirects";
import { logAuthFailure } from "@/lib/logging/auth";
import { logEvent } from "@/lib/logging/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EMAIL_MAX_LENGTH = 320;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HOST_PATTERN = /^(?:[a-zA-Z0-9.-]+|\[[0-9a-fA-F:.]+\])(?::\d+)?$/;

function getStringFormValue(value: FormDataEntryValue | null): string | null {
  return typeof value === "string" ? value : null;
}

function parseEmail(value: FormDataEntryValue | null): string | null {
  const email = getStringFormValue(value)?.trim().toLowerCase();

  if (!email || email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
    return null;
  }

  return email;
}

function getConfiguredOrigin(): string | null {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!configuredUrl) {
    return null;
  }

  try {
    const url = new URL(configuredUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

async function getRequestOrigin(): Promise<string | null> {
  const configuredOrigin = getConfiguredOrigin();

  if (configuredOrigin) {
    return configuredOrigin;
  }

  const headerStore = await headers();
  const rawHost = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const host = rawHost?.split(",")[0]?.trim();
  const proto = headerStore.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "http";

  if (!host || !HOST_PATTERN.test(host) || (proto !== "http" && proto !== "https")) {
    return null;
  }

  return `${proto}://${host}`;
}

function getNextPath(formData: FormData): string {
  return getSafeRedirectPath(getStringFormValue(formData.get("next")), "/account");
}

export async function requestMagicLink(formData: FormData) {
  const nextPath = getNextPath(formData);
  const email = parseEmail(formData.get("email"));

  if (!email) {
    logEvent({
      context: { nextPath },
      event: "auth.magic_link.invalid_email",
      level: "warn",
      message: "Magic-link request rejected invalid email input.",
    });
    redirect(getLoginResultRedirectPath({ error: "invalid-email", nextPath }));
  }

  const origin = await getRequestOrigin();

  if (!origin) {
    logEvent({
      context: { nextPath },
      event: "auth.magic_link.invalid_origin",
      level: "warn",
      message: "Magic-link request could not verify an app origin.",
    });
    redirect(getLoginResultRedirectPath({ error: "invalid-origin", nextPath }));
  }

  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", nextPath);

  logEvent({
    context: {
      callbackPath: callbackUrl.pathname,
      nextPath,
      origin,
    },
    event: "auth.magic_link.start",
    level: "info",
    message: "Starting Supabase magic-link request.",
  });

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl.toString(),
      shouldCreateUser: true,
    },
  });

  if (error) {
    logAuthFailure({
      context: {
        callbackPath: callbackUrl.pathname,
        nextPath,
        origin,
      },
      error,
      event: "auth.magic_link_start_failed",
      message: "Supabase magic-link request failed to start.",
    });
    redirect(getLoginResultRedirectPath({ error: "auth-request-failed", nextPath }));
  }

  logEvent({
    context: { nextPath, origin },
    event: "auth.magic_link.started",
    level: "info",
    message: "Supabase magic-link request started.",
  });

  redirect(getLoginResultRedirectPath({ nextPath, status: "check-email" }));
}

export async function signInWithGoogle(formData: FormData) {
  const nextPath = getNextPath(formData);
  const origin = await getRequestOrigin();

  if (!origin) {
    logEvent({
      context: { nextPath },
      event: "auth.google.invalid_origin",
      level: "warn",
      message: "Google OAuth request could not verify an app origin.",
    });
    redirect(getLoginResultRedirectPath({ error: "invalid-origin", nextPath }));
  }

  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", nextPath);

  logEvent({
    context: {
      callbackPath: callbackUrl.pathname,
      nextPath,
      origin,
      provider: "google",
    },
    event: "auth.google.start",
    level: "info",
    message: "Starting Supabase Google OAuth request.",
  });

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    logAuthFailure({
      context: {
        callbackPath: callbackUrl.pathname,
        nextPath,
        origin,
        provider: "google",
      },
      error,
      event: "auth.google_oauth_start_failed",
      message: "Supabase Google OAuth request failed to start.",
    });
    redirect(getLoginResultRedirectPath({ error: "google-auth-request-failed", nextPath }));
  }

  const providerUrl = data?.url;

  if (!providerUrl) {
    logAuthFailure({
      context: {
        callbackPath: callbackUrl.pathname,
        nextPath,
        origin,
        provider: "google",
      },
      error: new Error("Supabase did not return an OAuth provider URL."),
      event: "auth.google_oauth_start_failed",
      message: "Supabase Google OAuth request did not return a provider URL.",
    });
    redirect(getLoginResultRedirectPath({ error: "oauth-url-missing", nextPath }));
  }

  logEvent({
    context: {
      nextPath,
      origin,
      provider: "google",
    },
    event: "auth.google.started",
    level: "info",
    message: "Supabase Google OAuth provider redirect created.",
  });

  redirect(providerUrl);
}
