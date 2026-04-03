export default function DashboardLoading() {
  return (
    <div className="space-y-5 px-1">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border bg-card px-4 py-3.5"
          >
            <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="h-7 w-12 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b p-3">
          <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 border-t px-4 py-3">
            <div className="h-5 w-5 animate-pulse rounded bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}