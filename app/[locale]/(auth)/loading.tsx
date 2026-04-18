import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-4" />
          <Skeleton className="w-32 h-6 rounded mx-auto mb-2" />
          <Skeleton className="w-48 h-4 rounded mx-auto" />
        </div>

        {/* Form card */}
        <div className="rounded-2xl bg-[#0A0A0A] border border-white/[0.06] p-8 space-y-5">
          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <Skeleton className="w-6 h-3 rounded" />
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Input fields */}
          <div className="space-y-4">
            <div>
              <Skeleton className="w-12 h-3 rounded mb-2" />
              <Skeleton className="w-full h-11 rounded-lg" />
            </div>
            <div>
              <Skeleton className="w-16 h-3 rounded mb-2" />
              <Skeleton className="w-full h-11 rounded-lg" />
            </div>
          </div>

          {/* Submit button */}
          <Skeleton className="w-full h-11 rounded-lg" />

          {/* Footer link */}
          <Skeleton className="w-48 h-4 rounded mx-auto" />
        </div>
      </div>
    </div>
  );
}
