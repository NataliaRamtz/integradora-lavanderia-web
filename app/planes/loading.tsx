export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}
