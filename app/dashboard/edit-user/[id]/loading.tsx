export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Simplified skeleton for page loading */}
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded-xl" />
              <div className="h-48 bg-muted rounded-xl" />
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-muted rounded-xl" />
              <div className="h-64 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}