import Link from "next/link";
import { ClipboardList, Hammer, LogIn, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { getCurrentAuth } from "@/lib/auth/session";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";

type SiteShellProps = {
  readonly children: React.ReactNode;
};

export async function SiteShell({ children }: SiteShellProps) {
  const auth = getSupabasePublicConfig() ? await getCurrentAuth() : null;
  const isSignedIn = Boolean(auth);

  return (
    <div className="min-h-screen">
      <header className="border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Ruiz Home Services home">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Hammer aria-hidden="true" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold">Ruiz Home Services</span>
              <span className="text-xs text-muted-foreground">NYC platform scaffold</span>
            </span>
          </Link>
          <nav aria-label="Primary navigation" className="hidden items-center gap-2 md:flex">
            <Link href="/#status" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              <ClipboardList data-icon="inline-start" aria-hidden="true" />
              Status
            </Link>
            <Link href="/#architecture" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              <ShieldCheck data-icon="inline-start" aria-hidden="true" />
              Boundaries
            </Link>
            {isSignedIn ? (
              <>
                <Link href="/account" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                  <UserRound data-icon="inline-start" aria-hidden="true" />
                  Account
                </Link>
                <form action="/auth/sign-out?next=/" method="post">
                  <Button type="submit" variant="ghost" size="sm">
                    <LogOut data-icon="inline-start" aria-hidden="true" />
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                <LogIn data-icon="inline-start" aria-hidden="true" />
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>Phase 3 auth verification exists. Customer requests, payments, and job operations are not live.</p>
          <p>Authoritative rules live in AGENTS.md and maintained docs.</p>
        </div>
      </footer>
    </div>
  );
}
