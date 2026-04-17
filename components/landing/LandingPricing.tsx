import { Link } from "@/i18n/routing";
import { Check, X, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { getTranslations } from "next-intl/server";

export async function LandingPricing() {
  const t = await getTranslations("landingPricing");

  return (
    <section id="pricing" className="py-20 sm:py-28 px-4 border-t border-white/[0.04] scroll-mt-20">
      <FadeIn>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3">
          {t("title")}
        </h2>
        <p className="text-sm text-zinc-500 text-center mb-12">
          {t("subtitle")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Lite Pack */}
          <div className="p-6 rounded-xl border border-white/[0.07] bg-white/[0.02] flex flex-col">
            <p className="text-xs text-zinc-500 mb-3">Lite</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-zinc-100">$9.99</span>
              <span className="text-sm text-zinc-500">{t("oneTime")}</span>
            </div>
            <p className="text-xs text-zinc-600 mb-5">{t("liteDesc")}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {[t("liteFeature1"), t("liteFeature2"), t("liteFeature3"), t("liteFeature4")].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-zinc-400">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard/billing" className="block w-full py-2.5 rounded-lg border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-sm font-medium text-center transition-colors cursor-pointer">
              {t("buyNow")}
            </Link>
          </div>

          {/* Standard Pack */}
          <div className="p-6 rounded-xl border border-violet-500/20 bg-violet-500/[0.03] relative flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 rounded-full bg-violet-500 text-[10px] font-bold text-white uppercase tracking-wider">{t("popular")}</span>
            </div>
            <p className="text-xs text-zinc-500 mb-3">Standard</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-zinc-100">$19.99</span>
              <span className="text-sm text-zinc-500">{t("oneTime")}</span>
            </div>
            <p className="text-xs text-zinc-600 mb-5">{t("standardDesc")}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {[t("standardFeature1"), t("standardFeature2"), t("standardFeature3"), t("standardFeature4")].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-zinc-300">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard/billing" className="block w-full py-2.5 rounded-lg bg-white text-black text-sm font-semibold text-center hover:bg-zinc-100 transition-colors cursor-pointer">
              {t("buyNow")}
            </Link>
          </div>

          {/* Pro Pack */}
          <div className="p-6 rounded-xl border border-white/[0.07] bg-white/[0.02] flex flex-col">
            <p className="text-xs text-zinc-500 mb-3">Pro</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-zinc-100">$36.99</span>
              <span className="text-sm text-zinc-500">{t("oneTime")}</span>
            </div>
            <p className="text-xs text-zinc-600 mb-5">{t("proDesc")}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {[t("proFeature1"), t("proFeature2"), t("proFeature3"), t("proFeature4"), t("proFeature5")].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-zinc-400">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard/billing" className="block w-full py-2.5 rounded-lg border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-sm font-medium text-center transition-colors cursor-pointer">
              {t("buyNow")}
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] text-[10px] text-emerald-400 mb-5 uppercase tracking-wider">
            {t("freeTierBadge")}
          </div>
          <p className="text-sm font-semibold text-zinc-100 mb-1">{t("freeTierTitle")}</p>
          <p className="text-xs text-zinc-500 mb-4 leading-relaxed max-w-sm">
            {t("freeTierDesc")}
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-sm font-medium transition-colors cursor-pointer">
            {t("freeTierCta")}
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {[t("trustBadge1"), t("trustBadge2"), t("trustBadge3")].map(label => (
            <div key={label} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-zinc-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {label}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold text-center mb-6">{t("vsTitle")}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/[0.03]">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3 font-medium">{t("directApi")}</p>
            <p className="text-2xl font-bold text-red-400 mb-1">{t("directPrice")}</p>
            <p className="text-xs text-zinc-600 mb-4">{t("directPriceDesc")}</p>
            <ul className="space-y-2">
              {[t("directFeature1"), t("directFeature2"), t("directFeature3"), t("directFeature4")].map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-zinc-500">
                  <X className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-[10px] font-bold text-black uppercase tracking-wider">{t("recommended")}</span>
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3 font-medium">Hapuppy</p>
            <p className="text-2xl font-bold text-emerald-400 mb-1">{t("hapuppyPrice")}</p>
            <p className="text-xs text-zinc-600 mb-4">{t("hapuppyPriceDesc")}</p>
            <ul className="space-y-2">
              {[t("hapuppyFeature1"), t("hapuppyFeature2"), t("hapuppyFeature3"), t("hapuppyFeature4")].map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      </FadeIn>
    </section>
  );
}
