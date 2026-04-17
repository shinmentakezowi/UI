"use client";

import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";

interface CurrentPlanBannerProps {
  group: string;
}

export function CurrentPlanBanner({ group }: CurrentPlanBannerProps) {
  const t = useTranslations("currentPlanBanner");

  const isPro = group !== "free";
  const label = isPro ? "Pro" : t("free");

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <CreditCard className="w-4.5 h-4.5 text-zinc-400" />
        </div>
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{t("currentPlan")}</p>
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-zinc-100">{label}</p>
            {isPro && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/20">
                PRO
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {isPro ? t("proDesc") : t("freeDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}
