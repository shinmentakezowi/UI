"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact } from "@/lib/format";
import { useTranslations } from "next-intl";
import type { UsageData } from "@/lib/types";

interface UsageTrendProps {
  loading: boolean;
  usageData: UsageData | null;
  selectedDays: number;
}

export function UsageTrend({ loading, usageData, selectedDays }: UsageTrendProps) {
  const t = useTranslations("usageTrend");

  if (loading) {
    return (
      <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5">
        <Skeleton className="h-4 w-28 mb-1.5" />
        <Skeleton className="h-3 w-36 mb-5" />
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const history = usageData?.history ?? [];
  const totalRequests = history.reduce((s, d) => s + d.requests, 0);
  const totalTokens = history.reduce((s, d) => s + d.tokens, 0);
  const totalCredits = history.reduce((s, d) => s + d.credits, 0);

  const periodLabel = `${selectedDays}-${t("title")}`;

  const items = [
    { label: t("totalRequests"), value: totalRequests.toLocaleString() },
    { label: t("totalTokens"), value: formatCompact(totalTokens) },
    { label: t("creditsConsumed"), value: formatCompact(totalCredits) },
  ];

  return (
    <div
      className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5"
      style={{ animation: "fadeInUp 0.5s ease-out 0.6s both" }}
    >
      <h3 className="text-[13px] font-semibold text-zinc-200">{periodLabel}</h3>
      <p className="text-[11px] text-zinc-600 mt-0.5 mb-5">{t("forPeriod")}</p>
      <div className="space-y-5">
        {items.map((item, i) => (
          <div
            key={item.label}
            style={{ animation: `fadeInUp 0.4s ease-out ${0.7 + i * 0.08}s both` }}
          >
            <p className="text-[11px] text-zinc-500 font-medium mb-1">{item.label}</p>
            <p className="text-xl font-bold text-zinc-100 tabular-nums leading-none">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
