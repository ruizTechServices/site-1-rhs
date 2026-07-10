export type PhaseStatus = "complete" | "current" | "planned" | "blocked";

export type ArchitecturePhase = {
  readonly id: string;
  readonly title: string;
  readonly status: PhaseStatus;
  readonly objective: string;
};

export const currentStateItems = [
  { label: "Implemented routes", value: "1 page, 2 auth handlers" },
  { label: "Code components", value: "12" },
  { label: "Supabase tables", value: "4 Phase 3 tables" },
  { label: "Git repository", value: "Not initialized" },
] as const;

export const architecturePhases: readonly ArchitecturePhase[] = [
  {
    id: "phase-0",
    title: "Baseline",
    status: "complete",
    objective: "Project contract, planning docs, and implementation log exist.",
  },
  {
    id: "phase-1",
    title: "App Scaffold",
    status: "complete",
    objective: "Next.js App Router, TypeScript, Tailwind, and public shell.",
  },
  {
    id: "phase-2",
    title: "Design Foundations",
    status: "complete",
    objective: "Design tokens, UI primitives, app shell, and common states.",
  },
  {
    id: "phase-3",
    title: "Auth and Roles",
    status: "current",
    objective: "Supabase Auth callback, trusted profiles, role lookup, and RLS foundation.",
  },
  {
    id: "phase-4",
    title: "Service Requests",
    status: "planned",
    objective: "Customer request intake with server validation and ownership.",
  },
  {
    id: "phase-5",
    title: "Operations",
    status: "planned",
    objective: "Admin review, handyman assignment, and job boundaries.",
  },
  {
    id: "phase-6",
    title: "Payments",
    status: "blocked",
    objective: "Square sandbox payments after payment policy approval.",
  },
  {
    id: "phase-7",
    title: "Job Lifecycle",
    status: "blocked",
    objective: "Completion, disputes, reviews, and payout records after policy decisions.",
  },
] as const;

export const architectureBoundaries = [
  "Next.js App Router renders the public shell plus Supabase auth route handlers.",
  "Server modules will own validation, authorization, pricing, payments, and logging.",
  "Supabase now owns the profile and trusted role foundation with RLS-enabled tables.",
  "Square remains blocked until payment policy, idempotency, and webhook handling are ready.",
] as const;

export const unresolvedDecisions = [
  "Billing increment, minimum duration, travel time, materials, taxes, tips, and cancellations.",
  "Deposit, authorization, full prepayment, or post-service payment.",
  "Handyman payout method, schedule, merchant-of-record model, refunds, and disputes.",
  "Supported launch boroughs, service categories, verification, insurance, and prohibited tasks.",
] as const;
