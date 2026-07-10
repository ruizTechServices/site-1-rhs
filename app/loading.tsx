export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <div className="h-8 w-48 rounded-md bg-muted" />
        <div className="h-4 w-full rounded-md bg-muted" />
        <div className="h-4 w-2/3 rounded-md bg-muted" />
      </div>
    </main>
  );
}
