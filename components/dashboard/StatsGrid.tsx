"use client";

import { Wallet, Flame, Shield, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact } from "@/lib/format";
import { useTranslations } from "next-intl";
import type { UsageData } from "@/lib/types";

function getResetCountdown(nextResetAt: string): string {
  const diff = new Date(nextResetAt).getTime() - Date.now();
  if (diff <= 0) return "now";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function StatsGrid({ loading, usageData }: { loading: boolean; usageData: UsageData | null }) {
  const t = useTranslations("statsGrid");

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[14px] border border-white/[0.06] bg-[#111111] px-4 py-4">
            <div className="flex items-center gap-2.5 mb-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>
    );
  }

  const remaining = usageData?.credits?.remaining ?? 0;
  const used = usageData?.credits?.used ?? 0;
  const daily = usageData?.credits?.daily ?? 0;
  // Total available = remaining + used (what you started with today)
  const percent = remaining > 0 ? Math.min(100, (used / remaining) * 100) : 0;
  const tier = usageData?.plan?.tier;
  const isPro = tier === "pro";
  const hasDailyReset = daily > 0 && !!usageData?.reservoir?.nextResetAt && !isPro;
  const resetTime = usageData?.reservoir?.nextResetAt;
  const resetCountdown = (!isPro && resetTime) ? getResetCountdown(resetTime) : t("neverResets");

  const cards = [
    {
      icon: Wallet, label: t("remaining"), value: formatCompact(remaining),
      sub: hasDailyReset ? `${t("of")} ${formatCompact(daily)} ${t("daily")}` : t("availableCredits"),
      iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400",
      valueColor: "text-emerald-400",
    },
    {
      icon: Flame, label: t("usedToday"), value: formatCompact(used),
      sub: daily > 0 && !isPro ? `${percent < 1 && percent > 0 ? percent.toFixed(1) : Math.round(percent)}${t("ofBudget")}` : t("creditsConsumed"),
      iconBg: "bg-orange-500/10", iconColor: "text-orange-400",
      valueColor: "text-orange-400",
    },
    {
      icon: Shield, label: t("dailyLimit"), value: isPro ? t("unlimited") : (daily > 0 ? formatCompact(daily) : "None"),
      sub: isPro ? t("noDailyCap") : (hasDailyReset ? t("dailyBudget") : t("noDailyCap")),
      iconBg: "bg-violet-500/10", iconColor: "text-violet-400",
      valueColor: "text-zinc-100",
    },
    {
      icon: Clock, label: t("resetsIn"), value: isPro ? t("neverResets") : resetCountdown,
      sub: isPro ? t("noDailyReset") : (hasDailyReset ? t("nextRefresh") : t("noDailyReset")),
      iconBg: "bg-cyan-500/10", iconColor: "text-cyan-400",
      valueColor: "text-zinc-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="relative overflow-hidden rounded-[14px] border border-white/[0.06] bg-[#111111] px-4 py-4"
          style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both` }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
              <card.icon className={`w-4 h-4 ${card.iconColor}`} />
            </div>
            <span className="text-[12px] text-zinc-500 font-medium">{card.label}</span>
          </div>
          <div className={`text-2xl font-bold ${card.valueColor} leading-none tabular-nums`}>
            {card.value}
          </div>
          <div className="text-[10px] text-zinc-600 mt-1">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
