import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          This route has not been implemented. Planned customer, handyman, admin, auth, and payment routes remain blocked until their architecture phases are complete.
        </p>
        <div>
          <Link href="/" className={cn(buttonVariants())}>
            Back to scaffold
          </Link>
        </div>
      </div>
    </main>
  );
}
