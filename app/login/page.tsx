import { KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { requestMagicLink, signInWithGoogle } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteShell } from "@/components/shared/site-shell";
import { getSafeRedirectPath } from "@/lib/auth/redirects";

type LoginSearchParams = Record<string, string | string[] | undefined>;

type LoginPageProps = {
  readonly searchParams?: Promise<LoginSearchParams>;
};

function getSingleSearchParam(
  params: LoginSearchParams | undefined,
  key: string,
): string | null {
  const value = params?.[key];

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function getStatusCopy(status: string | null): string | null {
  if (status === "check-email") {
    return "Magic link requested. Check the inbox for that email address.";
  }

  return null;
}

function getErrorCopy(error: string | null): string | null {
  switch (error) {
    case "auth-request-failed":
      return "The sign-in request could not be started. Check the Supabase Auth settings and try again.";
    case "google-auth-request-failed":
      return "Google sign-in could not be started. Confirm the Supabase Google provider and redirect URL settings.";
    case "invalid-email":
      return "Enter a valid email address.";
    case "invalid-origin":
      return "The app origin could not be verified for this request.";
    case "oauth-url-missing":
      return "Supabase did not return a Google sign-in URL. Check the Google provider configuration.";
    default:
      return null;
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeRedirectPath(getSingleSearchParam(params, "next"), "/account");
  const statusCopy = getStatusCopy(getSingleSearchParam(params, "status"));
  const errorCopy = getErrorCopy(getSingleSearchParam(params, "error"));

  return (
    <SiteShell>
      <section className="border-b bg-muted/35">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
          <div className="flex min-w-0 flex-col justify-center gap-5">
            <div className="flex items-center gap-3 text-sm font-medium text-primary">
              <KeyRound aria-hidden="true" />
              Phase 3 auth verification
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                Sign in to verify the protected app boundary
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                These actions start Supabase Auth and return to the requested protected route after the callback succeeds. They are not the final launch authentication policy.
              </p>
            </div>
            <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <li className="rounded-md border bg-card px-4 py-3">
                Identity is verified server-side with Supabase claims.
              </li>
              <li className="rounded-md border bg-card px-4 py-3">
                Roles are loaded from trusted database assignments only.
              </li>
            </ul>
          </div>

          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Use Google OAuth or the email address configured for Supabase Auth testing.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <form action={signInWithGoogle}>
                <input type="hidden" name="next" value={nextPath} />
                <Button type="submit" variant="outline" className="w-full">
                  Continue with Google
                </Button>
              </form>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <span>Email magic link</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <form action={requestMagicLink} className="flex flex-col gap-5">
                <input type="hidden" name="next" value={nextPath} />
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    maxLength={320}
                    required
                    placeholder="you@example.com"
                  />
                </div>
                {statusCopy ? (
                  <div className="flex gap-3 rounded-md border border-success bg-success/35 p-3 text-sm text-success-foreground">
                    <MailCheck aria-hidden="true" className="mt-0.5 shrink-0" />
                    <span>{statusCopy}</span>
                  </div>
                ) : null}
                {errorCopy ? (
                  <div className="flex gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                    <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0" />
                    <span>{errorCopy}</span>
                  </div>
                ) : null}
                <Button type="submit" className="w-full">
                  Send magic link
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
