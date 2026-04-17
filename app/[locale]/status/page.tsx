import { Suspense } from "react";
import { MinimalNav } from "@/components/MinimalNav";
import { Link } from "@/i18n/routing";
import { getTranslations, getLocale } from "next-intl/server";
import { Activity } from "lucide-react";
import { UptimeBar } from "@/components/status/UptimeBar";

export const metadata = {
  title: "System Status — Hapuppy",
  description: "Real-time status and uptime of Hapuppy AI API services.",
};

interface CheckData {
  time: string;
  status: string;
}

interface BucketData {
  key: string;
  status: string;
  checks: CheckData[];
  avgMs: number | null;
}

interface ModelStatus {
  id: string;
  uptimePercent: number;
  buckets: BucketData[];
}

interface ProviderStatus {
  key: string;
  name: string;
  models: ModelStatus[];
}

interface StatusData {
  status: string;
  lastUpdated: string;
  providers: ProviderStatus[];
}

async function StatusContent() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const locale = await getLocale();
  const t = await getTranslations("status");

  let data: StatusData;
  try {
    const res = await fetch(`${siteUrl}/api/status`, { cache: "no-store" });
    const json = await res.json();
    data = json.providers ? json : { status: "operational", lastUpdated: new Date().toISOString(), providers: [] };
  } catch {
    data = { status: "operational", lastUpdated: new Date().toISOString(), providers: [] };
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 bg-white/[0.04]">
          <Activity className="w-8 h-8 text-zinc-400" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          {t("title")}
        </h2>
        <p className="text-sm text-zinc-500">
          {t("subtitle")}
        </p>
        <p className="text-[11px] text-zinc-600 mt-1.5">
          {t("checkInterval")}
        </p>
      </div>

      {/* Providers */}
      {data.providers.length > 0 ? (
        <div className="space-y-4">
          {data.providers.map((provider) => (
            <div
              key={provider.key}
              className="rounded-xl border border-white/[0.06] bg-[#111111] px-4 sm:px-5 py-3 sm:py-4"
            >
              {/* Provider header */}
              <div className="mb-2.5">
                <span className="text-sm font-medium text-zinc-200">{provider.name}</span>
              </div>

              {/* Per-model rows */}
              <div className="space-y-2.5 sm:space-y-1.5">
                {provider.models.map((model) => (
                  <div key={model.id}>
                    {/* Mobile: stacked layout */}
                    <div className="sm:hidden">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] text-zinc-300 font-mono">{model.id}</span>
                        <span className="text-[11px] text-zinc-400 font-mono tabular-nums">{model.uptimePercent.toFixed(1)}%</span>
                      </div>
                      <UptimeBar buckets={model.buckets} locale={locale} />
                    </div>
                    {/* Desktop: single row */}
                    <div className="hidden sm:flex items-center gap-3">
                      <span className="text-[11px] text-zinc-300 font-mono truncate w-[200px] shrink-0">{model.id}</span>
                      <div className="flex-1 min-w-0">
                        <UptimeBar buckets={model.buckets} locale={locale} />
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono tabular-nums w-[48px] text-right shrink-0">{model.uptimePercent.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Time labels */}
              <div className="flex items-center justify-between mt-1.5 sm:hidden">
                <span className="text-[10px] text-zinc-600">{t("eightHoursAgo")}</span>
                <span className="text-[10px] text-zinc-600">{t("now")}</span>
              </div>
              <div className="hidden sm:flex items-center gap-3 mt-1">
                <div className="w-[200px] shrink-0" />
                <div className="flex-1 flex justify-between min-w-0">
                  <span className="text-[10px] text-zinc-600">{t("eightHoursAgo")}</span>
                  <span className="text-[10px] text-zinc-600">{t("now")}</span>
                </div>
                <div className="w-[48px] shrink-0" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-12 text-center">
          <p className="text-sm text-zinc-500">{t("noDataYet")}</p>
        </div>
      )}
    </div>
  );
}

function StatusSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="text-center mb-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-white/[0.04] animate-pulse mb-6" />
        <div className="h-8 w-72 mx-auto rounded-lg bg-white/[0.04] animate-pulse mb-2" />
        <div className="h-4 w-48 mx-auto rounded bg-white/[0.03] animate-pulse" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl border border-white/[0.06] bg-[#111111] px-5 py-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-2 h-2 rounded-full bg-white/[0.06] animate-pulse" />
              <div className="h-4 w-28 rounded bg-white/[0.04] animate-pulse" />
            </div>
            <div className="h-[34px] rounded bg-white/[0.03] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function StatusPage() {
  const tf = await getTranslations("footer");
  const tc = await getTranslations("common");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 overflow-x-hidden">
      <MinimalNav />

      <section className="pt-36 sm:pt-44 pb-20">
        <Suspense fallback={<StatusSkeleton />}>
          <StatusContent />
        </Suspense>
      </section>

      <footer className="border-t border-white/[0.05] py-8 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <div className="flex items-center">
            <span className="font-medium text-zinc-500">Hapuppy</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-zinc-400 transition-colors">{tc("home")}</Link>
            <Link href="/models" className="hover:text-zinc-400 transition-colors">{tc("pricing")}</Link>
            <Link href="/login" className="hover:text-zinc-400 transition-colors">{tf("signIn")}</Link>
          </div>
          <span>&copy; {new Date().getFullYear()} Hapuppy</span>
        </div>
      </footer>
    </div>
  );
}
