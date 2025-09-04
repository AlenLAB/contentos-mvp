export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded-md animate-pulse-subtle" />
          <div className="h-4 w-32 bg-muted rounded-md animate-pulse-subtle" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-md animate-pulse-subtle" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-6 border rounded-lg space-y-3 animate-pulse-subtle"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-4 bg-muted rounded" />
            </div>
            <div className="h-8 w-16 bg-muted rounded" />
            <div className="h-1 w-full bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-6 border rounded-lg space-y-3 animate-pulse-subtle"
            style={{ animationDelay: `${200 + i * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-3/4 bg-muted rounded" />
              <div className="h-6 w-20 bg-muted rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-2/3 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
