import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <Skeleton className="w-40 h-8 rounded-lg mb-2" />
        <Skeleton className="w-64 h-4 rounded" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="w-20 h-3 rounded" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
            <Skeleton className="w-24 h-7 rounded mb-1" />
            <Skeleton className="w-16 h-3 rounded" />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="w-32 h-5 rounded" />
              <Skeleton className="w-20 h-7 rounded-lg" />
            </div>
            <Skeleton className="w-full h-48 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-6">
        <Skeleton className="w-36 h-5 rounded mb-5" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <Skeleton className="flex-1 h-4 rounded" />
              <Skeleton className="w-16 h-4 rounded" />
              <Skeleton className="w-20 h-4 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
