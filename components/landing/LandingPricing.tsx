"use client";

import { Link } from "@/i18n/routing";
import { Check, X, CheckCircle2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function LandingPricing() {
  const t = useTranslations("landingPricing");

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section id="pricing" className="py-20 sm:py-28 px-4 border-t border-white/[0.04] scroll-mt-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/[0.03] via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-mono text-violet-400 uppercase tracking-wider">Pricing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            {t("title")}
          </h2>
          <p className="text-sm text-zinc-500">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
        >
          {/* Lite Pack */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="p-6 rounded-xl border border-white/[0.07] bg-white/[0.02] flex flex-col hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300"
          >
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
            <Link href="/dashboard/billing" className="block w-full py-2.5 rounded-lg border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-sm font-medium text-center transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              {t("buyNow")}
            </Link>
          </motion.div>

          {/* Standard Pack */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.3 } }}
            className="p-6 rounded-xl border border-violet-500/20 bg-violet-500/[0.03] relative flex flex-col hover:border-violet-500/40 hover:bg-violet-500/[0.06] transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]"
          >
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
            <Link href="/dashboard/billing" className="block w-full py-2.5 rounded-lg bg-white text-black text-sm font-semibold text-center hover:bg-zinc-100 transition-all cursor-pointer hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              {t("buyNow")}
            </Link>
          </motion.div>

          {/* Pro Pack */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="p-6 rounded-xl border border-white/[0.07] bg-white/[0.02] flex flex-col hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-300"
          >
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
            <Link href="/dashboard/billing" className="block w-full py-2.5 rounded-lg border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-sm font-medium text-center transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              {t("buyNow")}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] flex flex-col items-center text-center mb-8 hover:border-emerald-500/30 hover:bg-emerald-500/[0.05] transition-all duration-300"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] text-[10px] text-emerald-400 mb-5 uppercase tracking-wider">
            {t("freeTierBadge")}
          </div>
          <p className="text-sm font-semibold text-zinc-100 mb-1">{t("freeTierTitle")}</p>
          <p className="text-xs text-zinc-500 mb-4 leading-relaxed max-w-sm">
            {t("freeTierDesc")}
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-sm font-medium transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            {t("freeTierCta")}
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {[t("trustBadge1"), t("trustBadge2"), t("trustBadge3")].map(label => (
            <div key={label} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-zinc-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {label}
            </div>
          ))}
        </motion.div>

        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-lg font-bold text-center mb-6"
        >
          {t("vsTitle")}
        </motion.h3>
        <motion.div 
          className="grid sm:grid-cols-2 gap-3"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.div 
            variants={cardVariants}
            className="p-5 rounded-xl border border-red-500/20 bg-red-500/[0.03] hover:border-red-500/30 transition-all duration-300"
          >
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
          </motion.div>
          <motion.div 
            variants={cardVariants}
            className="relative p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] hover:border-emerald-500/30 hover:bg-emerald-500/[0.05] transition-all duration-300"
          >
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
