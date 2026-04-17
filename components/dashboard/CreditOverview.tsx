"use client";

import { Activity, Layers, Zap, ArrowRight, ArrowLeft, Cpu } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact } from "@/lib/format";
import { useTranslations } from "next-intl";
import type { UsageData } from "@/lib/types";

export function CreditOverview({ loading, usageData }: { loading: boolean; usageData: UsageData | null }) {
  const t = useTranslations("creditOverview");

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5">
          <Skeleton className="h-4 w-28 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-16 mb-1.5" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-16 mb-1.5" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const requests = usageData?.today.requests ?? 0;
  const totalTokens = usageData?.today.totalTokens ?? 0;
  const prompt = usageData?.today.promptTokens ?? 0;
  const completion = usageData?.today.completionTokens ?? 0;
  const used = usageData?.credits?.used ?? 0;
  const avgPerReq = requests > 0 ? Math.round(used / requests) : 0;
  const modelsUsed = usageData?.modelBreakdown?.length ?? 0;
  const promptPct = totalTokens > 0 ? (prompt / totalTokens) * 100 : 50;

  const distributionItems = [
    {
      icon: ArrowRight, label: t("input"),
      value: formatCompact(prompt),
      sub: totalTokens > 0 ? `${Math.round(promptPct)}${t("ofTokens")}` : t("promptTokens"),
      iconBg: "bg-amber-500/10", iconColor: "text-amber-400",
    },
    {
      icon: ArrowLeft, label: t("output"),
      value: formatCompact(completion),
      sub: totalTokens > 0 ? `${Math.round(100 - promptPct)}${t("ofTokens")}` : t("completionTokens"),
      iconBg: "bg-rose-500/10", iconColor: "text-rose-400",
    },
    {
      icon: Cpu, label: t("modelsUsed"),
      value: `${modelsUsed}`,
      sub: t("distinctModels"),
      iconBg: "bg-cyan-500/10", iconColor: "text-cyan-400",
    },
  ];

  const activityItems = [
    {
      icon: Activity, label: t("requests"),
      value: requests.toLocaleString(),
      sub: t("apiCallsToday"),
      iconBg: "bg-blue-500/10", iconColor: "text-blue-400",
    },
    {
      icon: Layers, label: t("tokens"),
      value: formatCompact(totalTokens),
      sub: totalTokens > 0
        ? `${t("in")} ${formatCompact(prompt)} ${t("out")} ${formatCompact(completion)}`
        : t("inputOutput"),
      iconBg: "bg-violet-500/10", iconColor: "text-violet-400",
    },
    {
      icon: Zap, label: t("avgPerRequest"),
      value: requests > 0 ? formatCompact(avgPerReq) : "\u2014",
      sub: t("creditsPerCall"),
      iconBg: "bg-amber-500/10", iconColor: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Today's Activity */}
      <div
        className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5"
        style={{ animation: "fadeInUp 0.5s ease-out 0.4s both" }}
      >
        <h3 className="text-[13px] font-semibold text-zinc-200 mb-4">{t("todaysActivity")}</h3>
        <div className="space-y-3.5">
          {activityItems.map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-3"
              style={{ animation: `fadeInUp 0.4s ease-out ${0.5 + i * 0.06}s both` }}
            >
              <div className={`w-9 h-9 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-zinc-500 font-medium">{item.label}</p>
                <p className="text-lg font-bold text-zinc-100 tabular-nums leading-tight">{item.value}</p>
              </div>
              <span className="text-[10px] text-zinc-600 flex-shrink-0">{item.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Token Distribution */}
      <div
        className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5"
        style={{ animation: "fadeInUp 0.5s ease-out 0.45s both" }}
      >
        <h3 className="text-[13px] font-semibold text-zinc-200 mb-4">{t("tokenDistribution")}</h3>
        <div className="space-y-3.5">
          {distributionItems.map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-3"
              style={{ animation: `fadeInUp 0.4s ease-out ${0.55 + i * 0.06}s both` }}
            >
              <div className={`w-9 h-9 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-zinc-500 font-medium">{item.label}</p>
                <p className="text-lg font-bold text-zinc-100 tabular-nums leading-tight">{item.value}</p>
              </div>
              <span className="text-[10px] text-zinc-600 flex-shrink-0">{item.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
