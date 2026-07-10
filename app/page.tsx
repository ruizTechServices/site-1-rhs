import Link from "next/link";
import { ArrowRight, CircleAlert, ClipboardCheck, LockKeyhole } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PhaseGrid } from "@/components/shared/phase-grid";
import { SiteShell } from "@/components/shared/site-shell";
import { StatusPanel } from "@/components/shared/status-panel";
import {
  architectureBoundaries,
  architecturePhases,
  currentStateItems,
  unresolvedDecisions,
} from "@/lib/project/architecture-plan";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <SiteShell>
      <section className="border-b">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="flex min-w-0 flex-col gap-6">
            <div className="flex items-center gap-3 text-sm font-medium text-primary">
              <ClipboardCheck aria-hidden="true" />
              Phase 3 backend foundation underway
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
                Ruiz Home Services platform foundation
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                A conservative Next.js baseline for the NYC home-services marketplace. The shell exposes current architecture status without pretending that requests, auth, jobs, or payments are live.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="#status"
                className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
              >
                Review current state
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
              <Link
                href="#architecture"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto",
                )}
              >
                View boundaries
              </Link>
            </div>
          </div>

          <div className="min-w-0 rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <span className="flex size-10 items-center justify-center rounded-md bg-warning text-warning-foreground">
                  <CircleAlert aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <h2 className="text-lg font-semibold">Not production ready</h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    This page is the app scaffold and design foundation only. Business workflows remain planned or blocked until their security and policy dependencies exist.
                  </p>
                </div>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <LockKeyhole aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                  <span className="min-w-0">Supabase Auth has backend scaffolding, but no sign-in UI or protected product workflow is live.</span>
                </li>
                <li className="flex gap-3">
                  <LockKeyhole aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                  <span className="min-w-0">Square payment code is blocked until payment policy is approved.</span>
                </li>
                <li className="flex gap-3">
                  <LockKeyhole aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                  <span className="min-w-0">Customer, handyman, and admin surfaces are intentionally absent.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="status" className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">Current state</h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              The repository now has a minimal executable scaffold, reusable UI primitives, and the first Supabase Auth/Profile backend foundation. Feature workflows remain intentionally unimplemented.
            </p>
          </div>
          <StatusPanel items={currentStateItems} />
        </div>
      </section>

      <section id="architecture" className="border-b bg-muted/35">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">Implementation phases</h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Phase 1 and the initial Phase 2 foundation are complete. Phase 3 now has Supabase schema and auth-route groundwork, while product workflows still require authorization and policy follow-through.
            </p>
          </div>
          <PhaseGrid phases={architecturePhases} />
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Architecture boundaries</h2>
            <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
              {architectureBoundaries.map((item) => (
                <li key={item} className="rounded-md border bg-card px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Blocked decisions</h2>
            <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
              {unresolvedDecisions.map((item) => (
                <li key={item} className="rounded-md border bg-card px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-muted/35">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <EmptyState
            title="No customer workflow exists yet"
            description="The backend now has profile and role foundations, but customer request forms, dashboards, service jobs, and payments are still intentionally absent."
          />
        </div>
      </section>
    </SiteShell>
  );
}
