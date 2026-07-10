import Link from "next/link";
import { ClipboardList, Hammer, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SiteShellProps = {
  readonly children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
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
            <Link href="#status" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              <ClipboardList data-icon="inline-start" aria-hidden="true" />
              Status
            </Link>
            <Link href="#architecture" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              <ShieldCheck data-icon="inline-start" aria-hidden="true" />
              Boundaries
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>Project scaffold only. Customer requests, authentication, payments, and job operations are not live.</p>
          <p>Authoritative rules live in AGENTS.md and maintained docs.</p>
        </div>
      </footer>
    </div>
  );
}
