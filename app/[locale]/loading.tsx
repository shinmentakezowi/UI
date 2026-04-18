import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Navbar skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
        <div className="w-full max-w-5xl h-14 rounded-2xl bg-zinc-900/40 border border-white/[0.08] flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Skeleton className="w-[22px] h-[22px] rounded" />
            <Skeleton className="w-16 h-4 rounded" />
            <div className="hidden md:flex items-center gap-1 ml-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-14 h-4 rounded mx-2" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-[72px] h-7 rounded-lg" />
            <Skeleton className="w-24 h-8 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Page content skeleton */}
      <div className="pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Hero area */}
        <div className="mb-12">
          <Skeleton className="w-32 h-7 rounded-full mb-4" />
          <Skeleton className="w-64 h-10 rounded-lg mb-3" />
          <Skeleton className="w-96 h-5 rounded mb-1" />
          <Skeleton className="w-72 h-5 rounded" />
        </div>

        {/* Content blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#0A0A0A] border border-white/[0.06] p-6"
            >
              <Skeleton className="w-12 h-12 rounded-xl mb-4" />
              <Skeleton className="w-3/4 h-5 rounded mb-2" />
              <Skeleton className="w-full h-4 rounded mb-1" />
              <Skeleton className="w-2/3 h-4 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
