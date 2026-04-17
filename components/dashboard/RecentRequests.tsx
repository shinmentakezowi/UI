"use client";

import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact, formatTokens, formatLogTime } from "@/lib/format";
import { useTranslations } from "next-intl";
import type { LogEntry } from "@/lib/types";

interface RecentRequestsProps {
  loading: boolean;
  logs: LogEntry[];
}

export function RecentRequests({ loading, logs }: RecentRequestsProps) {
  const t = useTranslations("recentRequests");

  if (loading) {
    return (
      <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] overflow-hidden">
        <div className="flex items-center gap-2 px-4 pt-3.5 pb-2.5">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="px-4 pb-4 space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-[14px] border border-white/[0.06] bg-[#111111] overflow-hidden"
      style={{ animation: "fadeInUp 0.5s ease-out 0.65s both" }}
    >
      <div className="flex items-center gap-2 px-4 pt-3.5 pb-2.5">
        <FileText className="w-4 h-4 text-zinc-500" />
        <h2 className="text-[13px] font-semibold text-zinc-200">{t("title")}</h2>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-zinc-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
          {t("cacheHit")}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-t border-white/[0.04]">
              <th className="text-left text-[10px] text-zinc-600 uppercase tracking-wider font-medium px-4 py-2">{t("model")}</th>
              <th className="text-right text-[10px] text-zinc-600 uppercase tracking-wider font-medium px-4 py-2">{t("input")}</th>
              <th className="text-right text-[10px] text-zinc-600 uppercase tracking-wider font-medium px-4 py-2">{t("output")}</th>
              <th className="text-right text-[10px] text-zinc-600 uppercase tracking-wider font-medium px-4 py-2">{t("tokens")}</th>
              <th className="text-right text-[10px] text-zinc-600 uppercase tracking-wider font-medium px-4 py-2">{t("credits")}</th>
              <th className="text-right text-[10px] text-zinc-600 uppercase tracking-wider font-medium px-4 py-2">{t("time")}</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <p className="text-xs text-zinc-600">{t("noRequests")}</p>
                </td>
              </tr>
            ) : (
              logs.map((log, i) => (
                <tr
                  key={`${log.createdAt}-${i}`}
                  className="border-t border-white/[0.03] hover:bg-white/[0.015] transition-colors"
                >
                  <td className="px-4 py-2 text-[12px] text-zinc-300 font-mono whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      {log.model}
                      {log.cacheTokens > 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 flex-shrink-0" />}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <span className="text-[12px] text-zinc-400 tabular-nums">{formatTokens(log.promptTokens)}</span>
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <span className="text-[12px] text-zinc-400 tabular-nums">{formatTokens(log.completionTokens)}</span>
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <span className="text-[12px] text-zinc-400 tabular-nums">{formatTokens(log.promptTokens + log.completionTokens)}</span>
                  </td>
                  <td className="px-4 py-2 text-[12px] text-emerald-400/80 text-right font-medium tabular-nums">
                    {formatCompact(log.credits)}
                  </td>
                  <td className="px-4 py-2 text-[12px] text-zinc-500 text-right whitespace-nowrap">
                    {formatLogTime(log.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
