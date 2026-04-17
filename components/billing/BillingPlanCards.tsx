"use client";

import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface PlanDef {
  key: string;
  name: string;
  price: number;
  dailyCredits: string;
  featureKeys: string[];
  accent?: string;
}

export const BILLING_PLANS: PlanDef[] = [
  {
    key: "lite",
    name: "Lite",
    price: 9.99,
    dailyCredits: "1,000,000",
    featureKeys: ["liteFeature1", "liteFeature2", "liteFeature3", "liteFeature4"],
  },
  {
    key: "standard",
    name: "Standard",
    price: 19.99,
    dailyCredits: "4,000,000",
    accent: "violet",
    featureKeys: ["standardFeature1", "standardFeature2", "standardFeature3", "standardFeature4"],
  },
  {
    key: "pro",
    name: "Pro",
    price: 36.99,
    dailyCredits: "8,000,000",
    accent: "amber",
    featureKeys: ["proFeature1", "proFeature2", "proFeature3", "proFeature4"],
  },
];

interface BillingPlanCardsProps {
  currentPlan: string | null;
  subscribing: string | null;
  onSubscribe: (planKey: string) => void;
}

export function BillingPlanCards({ currentPlan, subscribing, onSubscribe }: BillingPlanCardsProps) {
  const t = useTranslations("billingPlan");
  const tc = useTranslations("common");
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {BILLING_PLANS.map((p) => {
        const isCurrent = p.key === currentPlan;
        const isHigher =
          !currentPlan ||
          BILLING_PLANS.findIndex((x) => x.key === currentPlan) <
            BILLING_PLANS.findIndex((x) => x.key === p.key);

        return (
          <div
            key={p.key}
            className={`relative rounded-2xl border ${
              isCurrent
                ? "border-violet-500/30 bg-violet-500/[0.03]"
                : "border-zinc-800 bg-[#111111]"
            } p-6 flex flex-col`}
          >
            {isCurrent && (
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/20">
                {t("current")}
              </span>
            )}

            <p
              className={`text-sm font-semibold mb-2 ${
                p.accent === "violet"
                  ? "text-violet-400"
                  : p.accent === "amber"
                    ? "text-amber-400"
                    : "text-zinc-300"
              }`}
            >
              {p.name}
            </p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold text-zinc-100">${p.price}</span>
              <span className="text-sm text-zinc-500">{tc("mo")}</span>
            </div>

            <div className="mt-3 mb-4 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <p className="text-[10px] text-zinc-500">{t("dailyCredits")}</p>
              <p className="text-sm font-semibold text-zinc-200">{p.dailyCredits}</p>
            </div>

            <ul className="space-y-2 flex-1 mb-5">
              {p.featureKeys.map((fk) => (
                <li key={fk} className="flex items-start gap-2">
                  <Check
                    className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                      isCurrent ? "text-violet-400" : "text-emerald-400"
                    }`}
                  />
                  <span className="text-xs text-zinc-400">{t(fk)}</span>
                </li>
              ))}
            </ul>

            {isCurrent ? (
              <Button
                className="w-full py-2 text-sm bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-default"
                size="lg"
                disabled
              >
                {t("currentPlan")}
              </Button>
            ) : (
              <Button
                className={`w-full gap-2 py-2 text-sm ${
                  !currentPlan
                    ? "bg-white text-black hover:bg-zinc-100"
                    : isHigher
                      ? "bg-violet-600 hover:bg-violet-500 text-white"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                }`}
                size="lg"
                onClick={() => onSubscribe(p.key)}
                disabled={subscribing !== null}
              >
                {subscribing === p.key ? (
                  "Redirecting..."
                ) : (
                  <>
                    {t("selectPlan")}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
