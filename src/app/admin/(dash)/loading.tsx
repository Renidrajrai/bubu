export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="animate-pulse space-y-4">
        <div className="h-5 w-32 rounded bg-surface-muted" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-surface-muted" />
          ))}
        </div>
        <div className="h-32 rounded-xl bg-surface-muted" />
      </div>
    </div>
  );
}
