"use client";

import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles, Zap, Crown } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

interface Pack {
  key: string;
  name: string;
  price: number;
  credits: string;
  badge?: string;
  badgeIcon?: typeof Sparkles;
  features: string[];
  highlighted?: boolean;
}

export function PricingCard() {
  const [loading, setLoading] = useState<string | null>(null);
  const t = useTranslations("pricingCard");

  const packs: Pack[] = [
    {
      key: "lite_pack",
      name: "Lite",
      price: 9.99,
      credits: "30M",
      badgeIcon: Zap,
      features: [
        t("liteFeature1"),
        t("liteFeature2"),
        t("liteFeature3"),
        t("liteFeature4"),
      ],
    },
    {
      key: "standard_pack",
      name: "Standard",
      price: 19.99,
      credits: "120M",
      badge: t("popular"),
      badgeIcon: Sparkles,
      highlighted: true,
      features: [
        t("standardFeature1"),
        t("standardFeature2"),
        t("standardFeature3"),
        t("standardFeature4"),
      ],
    },
    {
      key: "pro_pack",
      name: "Pro",
      price: 36.99,
      credits: "240M",
      badge: t("maxPower"),
      badgeIcon: Crown,
      features: [
        t("proFeature1"),
        t("proFeature2"),
        t("proFeature3"),
        t("proFeature4"),
      ],
    },
  ];

  async function handleBuy(pack: string) {
    setLoading(pack);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      window.location.href = "/login";
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
      {packs.map((pack) => {
        const isHighlighted = pack.highlighted;
        const BadgeIcon = pack.badgeIcon;

        return (
          <div key={pack.key} className="relative group">
            {/* Highlighted badge floating above card */}
            {isHighlighted && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-[10px] font-bold text-white uppercase tracking-wider whitespace-nowrap shadow-lg shadow-violet-500/30">
                  {pack.badge}
                </span>
              </div>
            )}

            {/* Outer glow */}
            <div
              className={`absolute -inset-[1px] bg-gradient-to-b ${
                isHighlighted
                  ? "from-violet-500/30 via-violet-500/10"
                  : "from-zinc-500/15 via-zinc-500/5"
              } to-transparent rounded-2xl ${
                isHighlighted
                  ? "opacity-100"
                  : "opacity-40 group-hover:opacity-70"
              } transition-opacity duration-500`}
            />

            <div
              className={`relative rounded-2xl border ${
                isHighlighted
                  ? "border-violet-500/30"
                  : "border-white/[0.08]"
              } bg-[#0f0f14] overflow-hidden h-full flex flex-col`}
            >
              {/* Top gradient bar */}
              <div
                className={`h-px bg-gradient-to-r from-transparent ${
                  isHighlighted
                    ? "via-violet-500/60"
                    : "via-zinc-500/20"
                } to-transparent`}
              />

              {/* Header */}
              <div className="p-6 text-center">
                {BadgeIcon && pack.badge && !isHighlighted && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-medium mb-4 text-zinc-400">
                    <BadgeIcon className="w-3 h-3" />
                    {pack.badge}
                  </div>
                )}
                {isHighlighted && <div className="mb-4 h-6" />}

                <h3 className="text-xl font-bold text-zinc-100 mb-1">
                  {pack.name}
                </h3>
                <p className="text-xs text-zinc-500 mb-2">{pack.credits} {t("totalCredits")}</p>

                <div className="flex items-baseline justify-center gap-1 mt-3">
                  <span
                    className={`text-4xl font-bold ${
                      isHighlighted
                        ? "bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                        : "text-zinc-100"
                    }`}
                  >
                    ${pack.price}
                  </span>
                  <span className="text-zinc-500 text-sm">{t("oneTime")}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-5 h-px bg-zinc-800/60" />

              {/* Features */}
              <div className="p-5 flex-1">
                <ul className="space-y-2.5">
                  {pack.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          isHighlighted
                            ? "bg-violet-500/10 border-violet-500/20"
                            : "bg-zinc-500/10 border-zinc-500/20"
                        } border flex items-center justify-center shrink-0 mt-0.5`}
                      >
                        <Check
                          className={`w-2.5 h-2.5 ${
                            isHighlighted ? "text-violet-400" : "text-zinc-400"
                          }`}
                        />
                      </div>
                      <span className="text-xs text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="p-5 pt-0">
                <Button
                  className={`w-full gap-2 py-5 text-sm shadow-lg ${
                    isHighlighted
                      ? "shadow-violet-600/20 hover:shadow-violet-600/40"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 shadow-none"
                  } transition-shadow`}
                  size="lg"
                  onClick={() => handleBuy(pack.key)}
                  disabled={loading !== null}
                >
                  {loading === pack.key ? (
                    "Redirecting..."
                  ) : (
                    <>
                      {t("buyNow")}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
                <p className="text-center text-[10px] text-zinc-600 mt-2.5">
                  {t("secureCheckout")}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
