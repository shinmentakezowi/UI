"use client";

import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact } from "@/lib/format";
import { useTranslations } from "next-intl";
import type { UsageData } from "@/lib/types";

const TIME_RANGES = [
  { labelKey: "today" as const, days: 1 },
  { labelKey: "threeD" as const, days: 3 },
  { labelKey: "sevenD" as const, days: 7 },
];

const BAR_COLOR = { bg: "bg-violet-500/20", gradient: "from-violet-500/60 to-violet-400/80" };

interface UsageByModelProps {
  loading: boolean;
  usageData: UsageData | null;
  chartLoading: boolean;
  selectedDays: number;
  onDaysChange: (days: number) => void;
}

export function UsageByModel({ loading, usageData, chartLoading, selectedDays, onDaysChange }: UsageByModelProps) {
  const t = useTranslations("usageByModel");

  if (loading) {
    return (
      <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-36" />
          <div className="flex gap-1">
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-10 rounded-full" />
            <Skeleton className="h-6 w-10 rounded-full" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-3 w-[120px] hidden sm:block" />
              <Skeleton className="flex-1 h-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const breakdown = usageData?.modelBreakdown ?? [];
  const top5 = breakdown.slice(0, 5);
  const othersCredits = breakdown.slice(5).reduce((sum, m) => sum + m.credits, 0);
  const othersCount = breakdown.length - 5;
  const maxCredits = top5[0]?.credits || 1;
  const totalCredits = breakdown.reduce((sum, m) => sum + m.credits, 0);

  // Period stats for multi-day footer
  const history = usageData?.history ?? [];
  const periodRequests = history.reduce((s, d) => s + d.requests, 0);
  const periodTokens = history.reduce((s, d) => s + d.tokens, 0);
  const periodCredits = history.reduce((s, d) => s + d.credits, 0);
  const avgPerDay = history.length > 0 ? Math.round(periodCredits / history.length) : 0;

  return (
    <div
      className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-4"
      style={{ animation: "fadeInUp 0.5s ease-out 0.55s both" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[13px] font-semibold text-zinc-200">{t("title")}</h2>
        <div className="flex items-center gap-1">
          {chartLoading && <Loader2 className="w-3 h-3 text-zinc-500 animate-spin mr-1" />}
          {TIME_RANGES.map(r => (
            <button
              key={r.days}
              onClick={() => onDaysChange(r.days)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                selectedDays === r.days
                  ? "bg-violet-500/[0.12] text-violet-400 border border-violet-500/20"
                  : "text-zinc-600 hover:text-zinc-400 border border-transparent"
              }`}
            >
              {t(r.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {chartLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#111111]/60 z-10 rounded-lg">
            <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
          </div>
        )}

        {breakdown.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-xs text-zinc-600">
            {t("noData")}
          </div>
        ) : (
          <div className="space-y-2.5">
            {top5.map((item, i) => {
              const pct = maxCredits > 0 ? (item.credits / maxCredits) * 100 : 0;
              const share = totalCredits > 0 ? Math.round((item.credits / totalCredits) * 100) : 0;
              return (
                <div key={item.model} className="flex items-center gap-3">
                  <div className="w-[140px] flex-shrink-0 text-right hidden sm:block">
                    <span className="text-[12px] font-mono text-zinc-300 truncate block">{item.model}</span>
                  </div>
                  <div className="sm:hidden w-[80px] flex-shrink-0 text-right">
                    <span className="text-[11px] font-mono text-zinc-300 truncate block">{item.model.split("/").pop()}</span>
                  </div>
                  <div className="flex-1 relative h-3">
                    <div className={`absolute inset-0 ${BAR_COLOR.bg} rounded-full`} />
                    <div
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${BAR_COLOR.gradient} rounded-full transition-[width] duration-500 ease-out`}
                      style={{
                        width: `${pct}%`,
                        animation: `barGrow 0.6s ease-out ${0.6 + i * 0.1}s both`,
                        transformOrigin: "left",
                      }}
                    />
                  </div>
                  <div className="w-[80px] text-right flex items-baseline gap-1.5">
                    <span className="text-[12px] text-zinc-400 tabular-nums font-medium">{formatCompact(item.credits)}</span>
                    <span className="text-[10px] text-zinc-600 tabular-nums">{share}%</span>
                  </div>
                </div>
              );
            })}

            {othersCount > 0 && othersCredits > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-[140px] flex-shrink-0 text-right hidden sm:block">
                  <span className="text-[12px] font-mono text-zinc-500">
                    {t("others")} <span className="text-zinc-600">({othersCount})</span>
                  </span>
                </div>
                <div className="sm:hidden w-[80px] flex-shrink-0 text-right">
                  <span className="text-[11px] font-mono text-zinc-500">
                    {t("others")} ({othersCount})
                  </span>
                </div>
                <div className="flex-1 relative h-3">
                  <div className="absolute inset-0 bg-zinc-700/30 rounded-full" />
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-zinc-600/40 to-zinc-500/50 rounded-full transition-[width] duration-500 ease-out"
                    style={{
                      width: `${maxCredits > 0 ? (othersCredits / maxCredits) * 100 : 0}%`,
                      animation: `barGrow 0.6s ease-out ${0.5 + top5.length * 0.1}s both`,
                      transformOrigin: "left",
                    }}
                  />
                </div>
                <div className="w-[80px] text-right flex items-baseline gap-1.5">
                  <span className="text-[12px] text-zinc-500 tabular-nums font-medium">{formatCompact(othersCredits)}</span>
                  <span className="text-[10px] text-zinc-600 tabular-nums">{totalCredits > 0 ? Math.round((othersCredits / totalCredits) * 100) : 0}%</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Period stats footer — only for multi-day */}
      {selectedDays > 1 && history.length > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/[0.04]">
          <div className="text-center flex-1">
            <span className="text-[10px] text-zinc-600 block">{t("requests")}</span>
            <span className="text-[13px] font-semibold text-zinc-200 tabular-nums">{periodRequests.toLocaleString()}</span>
          </div>
          <div className="w-px h-6 bg-white/[0.04]" />
          <div className="text-center flex-1">
            <span className="text-[10px] text-zinc-600 block">{t("tokens")}</span>
            <span className="text-[13px] font-semibold text-zinc-200 tabular-nums">{formatCompact(periodTokens)}</span>
          </div>
          <div className="w-px h-6 bg-white/[0.04]" />
          <div className="text-center flex-1">
            <span className="text-[10px] text-zinc-600 block">{t("credits")}</span>
            <span className="text-[13px] font-semibold text-zinc-200 tabular-nums">{formatCompact(periodCredits)}</span>
          </div>
          <div className="w-px h-6 bg-white/[0.04]" />
          <div className="text-center flex-1">
            <span className="text-[10px] text-zinc-600 block">{t("avgDay")}</span>
            <span className="text-[13px] font-semibold text-zinc-200 tabular-nums">{formatCompact(avgPerDay)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
