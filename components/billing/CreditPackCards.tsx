"use client";

import { Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CREDIT_PACKS } from "@/lib/constants";
import { useTranslations } from "next-intl";

interface CreditPackCardsProps {
  purchasing: string | null;
  onPurchase: (packKey: string) => void;
}

const PACK_KEYS = Object.keys(CREDIT_PACKS);

const PACK_LABELS: Record<string, { label: string; opusTokens: string }> = {
  lite_pack: { label: "轻度使用", opusTokens: "≈ 15M Opus Tokens" },
  standard_pack: { label: "日常使用", opusTokens: "≈ 60M Opus Tokens" },
  pro_pack: { label: "重度使用", opusTokens: "≈ 120M Opus Tokens" },
};

export function CreditPackCards({ purchasing, onPurchase }: CreditPackCardsProps) {
  const t = useTranslations("creditPack");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PACK_KEYS.map((key) => {
        const pack = CREDIT_PACKS[key];
        const meta = PACK_LABELS[key];
        return (
          <div
            key={key}
            className={`relative rounded-2xl border p-6 flex flex-col ${
              pack.popular
                ? "border-violet-500/30 bg-violet-500/[0.03]"
                : "border-zinc-800 bg-[#111111]"
            }`}
          >
            {pack.popular && (
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/20">
                {t("popular")}
              </span>
            )}

            <p className={`text-sm font-semibold mb-2 ${
              key === "pro_pack" ? "text-amber-400" : pack.popular ? "text-violet-400" : "text-zinc-300"
            }`}>
              {meta?.label || pack.name}
            </p>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-zinc-100">${pack.price}</span>
              <span className="text-lg text-zinc-400">/ ¥{pack.priceCNY}</span>
              <span className="text-sm text-zinc-500">{t("oneTime")}</span>
            </div>

            <div className="mt-3 mb-4 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <p className="text-[10px] text-zinc-500">{meta?.opusTokens}</p>
              <p className="text-sm font-semibold text-zinc-200">
                {(pack.credits / 1_000_000).toFixed(0)}M {t("totalCredits")}
              </p>
            </div>

            <ul className="space-y-2 flex-1 mb-5">
              {pack.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                    pack.popular ? "text-violet-400" : "text-emerald-400"
                  }`} />
                  <span className="text-xs text-zinc-400">{feat}</span>
                </li>
              ))}
            </ul>

            <Button
                className={`w-full gap-1.5 py-2 text-xs ${
                  pack.popular
                    ? "bg-violet-600 hover:bg-violet-500 text-white"
                    : "bg-white text-black hover:bg-zinc-100"
                }`}
                size="lg"
                onClick={() => onPurchase(key)}
                disabled={purchasing !== null}
              >
                {purchasing === key ? (
                  "..."
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5" />
                    ${pack.price}
                  </>
                )}
              </Button>
          </div>
        );
      })}
    </div>
  );
}
