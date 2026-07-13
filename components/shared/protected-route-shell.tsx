import type { ReactNode } from "react";
import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteShell } from "@/components/shared/site-shell";
import { cn } from "@/lib/utils";

type ProtectedRouteShellProps = {
  readonly badge: string;
  readonly children?: ReactNode;
  readonly description: string;
  readonly roleLabel?: string;
  readonly title: string;
};

export function ProtectedRouteShell({
  badge,
  children,
  description,
  roleLabel,
  title,
}: ProtectedRouteShellProps) {
  return (
    <SiteShell>
      <section className="border-b bg-muted/35">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex max-w-3xl flex-col gap-4">
            <div className="flex items-center gap-3 text-sm font-medium text-primary">
              <LockKeyhole aria-hidden="true" />
              {badge}
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                {title}
              </h1>
              <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                {description}
              </p>
            </div>
            {roleLabel ? (
              <Badge variant="success" className="w-fit">
                {roleLabel}
              </Badge>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Security boundary</CardTitle>
                <CardDescription>
                  This route rendered only after server-side checks completed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                    <span>Supabase claims verified the authenticated user.</span>
                  </li>
                  <li className="flex gap-3">
                    <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                    <span>Application role checks read from `role_assignments`.</span>
                  </li>
                  <li className="flex gap-3">
                    <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                    <span>Product workflows remain blocked until Phase 3 tests pass.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex min-w-0 flex-col gap-6">{children}</div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/account"
              className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
            >
              Account
            </Link>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "ghost" }), "w-full sm:w-auto")}
            >
              Current state
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
