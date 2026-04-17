"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, ShoppingCart, ArrowDown, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  StatsGrid,
  CreditOverview,
  UsageByModel,
  RecentRequests,
  AnnouncementBanner,
} from "@/components/dashboard";
import type { UsageData, LogEntry } from "@/lib/types";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");
  const [selectedDays, setSelectedDays] = useState<number>(1);
  const [chartLoading, setChartLoading] = useState(false);
  const [vaultBalance, setVaultBalance] = useState<number | null>(null);
  const [downgrading, setDowngrading] = useState(false);

  const fetchUsage = useCallback(async (days: number, signal?: AbortSignal) => {
    const res = await fetch(`/api/usage?days=${days}`, { signal });
    if (res.ok) return await res.json();
    return null;
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (signal.aborted) return;
        if (!user) { router.push("/login"); return; }
        setUserEmail(user.email ?? "");

        const [usage, logsRes] = await Promise.all([
          fetchUsage(1, signal),
          fetch("/api/logs?page=1&pageSize=10&days=1", { signal }),
        ]);
        if (signal.aborted) return;
        if (usage) setUsageData(usage);
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setRecentLogs(logsData.logs || []);
        }

        // Fetch vault balance for low-balance banner
        const vaultRes = await fetch("/api/vault", { signal });
        if (!signal.aborted && vaultRes.ok) {
          const v = await vaultRes.json();
          setVaultBalance(v.balance ?? 0);
        }
      } catch (e) {
        if (signal.aborted) return;
        setError(t("failedToLoad"));
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function handleDaysChange(days: number) {
    setSelectedDays(days);
    setChartLoading(true);
    try {
      const usage = await fetchUsage(days);
      if (usage) setUsageData(usage);
    } finally {
      setChartLoading(false);
    }
  }

  async function handleDowngrade() {
    setDowngrading(true);
    try {
      const res = await fetch("/api/account/downgrade", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      }
    } finally {
      setDowngrading(false);
    }
  }

  const isPro = usageData?.plan?.name && usageData.plan.name.toLowerCase() !== "free";
  const subscriptionRemaining = usageData?.credits?.remaining ?? 0;
  const lowBalance = isPro && vaultBalance !== null && (vaultBalance + subscriptionRemaining) < 10000;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <AlertTriangle className="w-8 h-8 text-red-400" />
        <p className="text-sm text-zinc-400">{error}</p>
        <button onClick={() => window.location.reload()} className="text-xs text-zinc-500 hover:text-zinc-300 underline cursor-pointer">
          {tc("retry")}
        </button>
      </div>
    );
  }

  const planName = usageData?.plan?.name;
  const used = usageData?.credits?.used ?? 0;
  const daily = usageData?.credits?.daily ?? 0;
  const remaining = usageData?.credits?.remaining ?? 0;
  const total = used + remaining;
  const percent = total > 0 ? Math.min(100, (used / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">{t("overview")}</h1>
            {planName && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
                {planName}
              </span>
            )}
            <AnnouncementBanner />
          </div>
          <div className="text-xs text-zinc-600 mt-0.5">
            {userEmail || <Skeleton className="h-3 w-40 mt-1" />}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-zinc-500">{t("allSystems")}</span>
        </div>
      </div>

      {/* Low Balance Banner */}
      {lowBalance && (
        <div
          className="rounded-[14px] border border-amber-500/20 bg-amber-500/5 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ animation: "fadeInUp 0.3s ease-out both" }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-200">{t("lowBalanceTitle")}</p>
              <p className="text-[11px] text-amber-400/70 mt-0.5">{t("lowBalanceDesc")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => router.push("/dashboard/billing")}
              className="h-8 px-4 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-medium border border-amber-500/20 hover:bg-amber-500/25 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingCart className="w-3 h-3" />
              {t("buyCredits")}
            </button>
            <button
              onClick={handleDowngrade}
              disabled={downgrading}
              className="h-8 px-4 rounded-lg bg-white/[0.03] text-zinc-400 text-xs font-medium border border-white/[0.08] hover:bg-white/[0.06] transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
            >
              <ArrowDown className="w-3 h-3" />
              {t("downgradeToFree")}
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <StatsGrid loading={loading} usageData={usageData} />

      {/* Daily Usage Bar */}
      {loading ? (
        <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] px-5 py-4">
          <div className="flex items-center justify-between mb-2.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
        </div>
      ) : (
        <div
          className="rounded-[14px] border border-white/[0.06] bg-[#111111] px-5 py-4"
          style={{ animation: "fadeInUp 0.5s ease-out 0.35s both" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[13px] font-semibold text-zinc-200">{t("dailyUsage")}</span>
            <span className="text-[12px] text-zinc-400 tabular-nums">
              {percent.toFixed(2)}{t("used")}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-zinc-800/60 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                percent >= 90 ? "bg-red-500" : percent >= 70 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{
                width: `${percent}%`,
                animation: "barGrow 1s ease-out 0.5s both",
                transformOrigin: "left",
              }}
            />
          </div>
        </div>
      )}

      {/* Today's Activity + Token Distribution */}
      <CreditOverview loading={loading} usageData={usageData} />

      {/* Top Models by Credits */}
      <UsageByModel
        loading={loading}
        usageData={usageData}
        chartLoading={chartLoading}
        selectedDays={selectedDays}
        onDaysChange={handleDaysChange}
      />

      {/* Recent Requests */}
      <RecentRequests loading={loading} logs={recentLogs} />
    </div>
  );
}
