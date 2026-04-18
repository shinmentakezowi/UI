"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/[0.05] via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />

      {/* Floating navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div className="w-full max-w-3xl flex items-center justify-between px-5 h-12 rounded-xl border border-white/[0.10] bg-zinc-900/80 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.3)] hover:border-white/[0.15] transition-all duration-300">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-zinc-100 hover:text-white transition-colors">
            <img src="/favicon.svg" alt="" width={16} height={16} className="rounded" />
            Hapuppy
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            {t("backToHome")}
          </Link>
        </div>
      </motion.nav>

      <article className="max-w-2xl mx-auto px-4 pt-32 pb-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
            <Shield className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-mono text-violet-400 uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">{t("title")}</h1>
          <p className="text-xs text-zinc-500 font-mono">{t("lastUpdated")}</p>
        </motion.div>

        <motion.div 
          className="space-y-8 text-sm text-zinc-400 leading-relaxed"
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s1Title")}
            </h2>
            <p>
              {t("s1Body")}{" "}
              <a href="mailto:support@hapuppy.com" className="text-violet-400 hover:text-violet-300 transition-colors">
                support@hapuppy.com
              </a>.
            </p>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s2Title")}
            </h2>
            <p>{t("s2Intro")}</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-zinc-200">{t("s2I1Label")}</strong> — {t("s2I1")}</li>
              <li><strong className="text-zinc-200">{t("s2I2Label")}</strong> — {t("s2I2")}</li>
              <li><strong className="text-zinc-200">{t("s2I3Label")}</strong> — {t("s2I3")}</li>
              <li><strong className="text-zinc-200">{t("s2I4Label")}</strong> — {t("s2I4")}</li>
            </ul>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s3Title")}
            </h2>
            <p>{t("s3Intro")}</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-zinc-200">{t("s3I1Label")}</strong> — {t("s3I1")}</li>
              <li><strong className="text-zinc-200">{t("s3I2Label")}</strong> — {t("s3I2")}</li>
              <li><strong className="text-zinc-200">{t("s3I3Label")}</strong> — {t("s3I3")}</li>
            </ul>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s4Title")}
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>{t("s4I1")}</li>
              <li>{t("s4I2")}</li>
              <li>{t("s4I3")}</li>
              <li>{t("s4I4")}</li>
              <li>{t("s4I5")}</li>
              <li>{t("s4I6")}</li>
            </ul>
            <p className="mt-2">{t("s4Note")}</p>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s5Title")}
            </h2>
            <p>
              {t("s5Body1")} <strong className="text-zinc-200">{t("s5Not")}</strong> {t("s5Body2")}
            </p>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s6Title")}
            </h2>
            <p>{t("s6Intro")}</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-zinc-200">{t("s6I1Label")}</strong> — {t("s6I1")}</li>
              <li><strong className="text-zinc-200">{t("s6I2Label")}</strong> — {t("s6I2")}</li>
              <li><strong className="text-zinc-200">{t("s6I3Label")}</strong> — {t("s6I3")}</li>
            </ul>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s7Title")}
            </h2>
            <p>{t("s7Body")}</p>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s8Title")}
            </h2>
            <p>{t("s8Intro")}</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("s8I1")}</li>
              <li>{t("s8I2")}</li>
              <li>{t("s8I3")}</li>
              <li>{t("s8I4")}</li>
              <li>{t("s8I5")}</li>
            </ul>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s9Title")}
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-zinc-200">{t("s9I1Label")}</strong> — {t("s9I1")}</li>
              <li><strong className="text-zinc-200">{t("s9I2Label")}</strong> — {t("s9I2")}</li>
              <li><strong className="text-zinc-200">{t("s9I3Label")}</strong> — {t("s9I3")}</li>
              <li><strong className="text-zinc-200">{t("s9I4Label")}</strong> — {t("s9I4")}</li>
            </ul>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s10Title")}
            </h2>
            <p>{t("s10Body")}</p>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s11Title")}
            </h2>
            <p>{t("s11Intro")}</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-zinc-200">{t("s11I1Label")}</strong> — {t("s11I1")}</li>
              <li><strong className="text-zinc-200">{t("s11I2Label")}</strong> — {t("s11I2")}</li>
              <li><strong className="text-zinc-200">{t("s11I3Label")}</strong> — {t("s11I3")}</li>
              <li><strong className="text-zinc-200">{t("s11I4Label")}</strong> — {t("s11I4")}</li>
              <li><strong className="text-zinc-200">{t("s11I5Label")}</strong> — {t("s11I5")}</li>
              <li><strong className="text-zinc-200">{t("s11I6Label")}</strong> — {t("s11I6")}</li>
              <li><strong className="text-zinc-200">{t("s11I7Label")}</strong> — {t("s11I7")}</li>
            </ul>
            <p className="mt-2">
              {t("s11FooterPre")}{" "}
              <a href="mailto:support@hapuppy.com" className="text-violet-400 hover:text-violet-300 transition-colors">
                support@hapuppy.com
              </a>.{" "}
              {t("s11FooterPost")}
            </p>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s12Title")}
            </h2>
            <p>{t("s12Body")}</p>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s13Title")}
            </h2>
            <p>{t("s13Body")}</p>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s14Title")}
            </h2>
            <p>
              {t("s14Body")}{" "}
              <a href="mailto:support@hapuppy.com" className="text-violet-400 hover:text-violet-300 transition-colors">
                support@hapuppy.com
              </a>{" "}
              or{" "}
              <a href="https://discord.gg/YWayJmZKCu" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 transition-colors">
                Discord
              </a>.
            </p>
          </motion.section>
        </motion.div>
      </article>
    </div>
  );
}
