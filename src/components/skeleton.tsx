// Shared loading-skeleton primitives, used by the admin's loading.tsx files.
// Admin pages can't be statically cached (always live, per-session data), so
// perceived speed here comes from Suspense showing one of these immediately
// on navigation while the real Server Component fetches in the background.

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-zinc-200 ${className}`} />;
}

export function PageHeaderSkeleton() {
  return (
    <div>
      <Skeleton className="mb-2 h-3 w-40" />
      <Skeleton className="h-6 w-56" />
      <Skeleton className="mt-2 h-4 w-96 max-w-full" />
    </div>
  );
}

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="max-w-4xl space-y-6">
      <PageHeaderSkeleton />
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="h-14 w-14 shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-4 w-10 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeaderSkeleton />
      <div className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
