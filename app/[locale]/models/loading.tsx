import { Skeleton } from "@/components/ui/skeleton";

export default function ModelsLoading() {
  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Navbar skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
        <div className="w-full max-w-5xl h-14 rounded-2xl bg-zinc-900/40 border border-white/[0.08] flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Skeleton className="w-[22px] h-[22px] rounded" />
            <Skeleton className="w-16 h-4 rounded" />
          </div>
          <Skeleton className="w-24 h-8 rounded-lg" />
        </div>
      </div>

      <div className="pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <Skeleton className="w-40 h-7 rounded-full mb-4" />
              <Skeleton className="w-56 h-9 rounded-lg mb-2" />
              <Skeleton className="w-72 h-4 rounded" />
            </div>
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-16 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                  <Skeleton className="w-10 h-5 rounded mb-1" />
                  <Skeleton className="w-14 h-2.5 rounded" />
                </div>
              ))}
            </div>
          </div>
          {/* Search */}
          <Skeleton className="h-12 max-w-2xl rounded-xl" />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-9 rounded-xl" style={{ width: `${65 + (i % 4) * 12}px` }} />
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#0A0A0A] border border-white/[0.06] overflow-hidden"
              style={{ animationDelay: `${i * 75}ms` }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div>
                      <Skeleton className="w-14 h-3 rounded mb-2" />
                      <Skeleton className="w-10 h-4 rounded" />
                    </div>
                  </div>
                </div>
                <Skeleton className="w-3/4 h-5 rounded mb-2" />
                <Skeleton className="w-full h-3 rounded mb-1" />
                <Skeleton className="w-2/3 h-3 rounded" />
              </div>
              <div className="px-5 py-3 border-t border-white/[0.04]">
                <Skeleton className="w-1/2 h-3 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
