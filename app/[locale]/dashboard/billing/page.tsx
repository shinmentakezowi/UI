"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { HelpCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CurrentPlanBanner } from "@/components/billing/CurrentPlanBanner";
import { CreditPackCards } from "@/components/billing/CreditPackCards";
import { useTranslations } from "next-intl";

export default function BillingPage() {
  const t = useTranslations("billing");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [group, setGroup] = useState("free");

  const FAQ = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
  ];

  useEffect(() => {
    async function loadPlan() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const subRes = await fetch("/api/billing/subscription")
          .then((r) => r.json())
          .catch(() => ({ group: "free" }));

        setGroup(subRes.group || "free");
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, [router]);

  async function handlePurchase(packKey: string) {
    setPurchasing(packKey);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: packKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // ignore
    } finally {
      setPurchasing(null);
    }
  }

  if (loading) {
    return (
      <div className="pt-10 space-y-8 pb-16">
        <div>
          <Skeleton className="h-5 w-20 mb-1.5" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 space-y-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-24" />
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-3">
                <Skeleton className="h-2.5 w-20 mb-1.5" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2.5">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="w-3.5 h-3.5 rounded-full" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 space-y-8 pb-16">
      <div>
        <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">{t("title")}</h1>
        <p className="text-xs text-zinc-600 mt-0.5">{t("subtitle")}</p>
      </div>

      <CurrentPlanBanner group={group} />

      <CreditPackCards
        purchasing={purchasing}
        onPurchase={handlePurchase}
      />

      {/* FAQ */}
      <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6">
        <div className="flex items-center gap-2 mb-5">
          <HelpCircle className="w-4 h-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-200">{t("faqTitle")}</h2>
        </div>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q}>
              <p className="text-[13px] font-medium text-zinc-200">{item.q}</p>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] text-zinc-600">
        {t("needHelp")}{" "}
        <a
          href="mailto:support@hapuppy.com"
          className="text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          support@hapuppy.com
        </a>
      </p>
    </div>
  );
}
