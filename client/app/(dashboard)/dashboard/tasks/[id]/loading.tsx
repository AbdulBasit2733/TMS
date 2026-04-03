export default function TaskDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="h-7 w-64 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-96 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-36 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-7 w-32 animate-pulse rounded-full bg-muted" />
          ))}
        </div>

        <div className="rounded-xl border bg-background/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-7 w-36 animate-pulse rounded-full bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}