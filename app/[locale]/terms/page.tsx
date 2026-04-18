"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const t = useTranslations("terms");

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
            <FileText className="w-3.5 h-3.5 text-violet-400" />
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
            <p>{t("s1Body")}</p>
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
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">{t("s2ThTier")}</th>
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">{t("s2ThPrice")}</th>
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">{t("s2ThCredits")}</th>
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">{t("s2ThRpm")}</th>
                    <th className="text-left py-2 text-zinc-400 font-medium">{t("s2ThModels")}</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-2 pr-4">{t("s2Row0Tier")}</td>
                    <td className="py-2 pr-4">$0</td>
                    <td className="py-2 pr-4">100K {t("s2Daily")}</td>
                    <td className="py-2 pr-4">100</td>
                    <td className="py-2">{t("s2Row0Models")}</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-2 pr-4">Lite</td>
                    <td className="py-2 pr-4">$9.99 {t("s2OneTime")}</td>
                    <td className="py-2 pr-4">30M</td>
                    <td className="py-2 pr-4">100</td>
                    <td className="py-2">{t("s2Row1Models")}</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-2 pr-4">Standard</td>
                    <td className="py-2 pr-4">$19.99 {t("s2OneTime")}</td>
                    <td className="py-2 pr-4">120M</td>
                    <td className="py-2 pr-4">100</td>
                    <td className="py-2">{t("s2Row2Models")}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Pro</td>
                    <td className="py-2 pr-4">$36.99 {t("s2OneTime")}</td>
                    <td className="py-2 pr-4">240M</td>
                    <td className="py-2 pr-4">100</td>
                    <td className="py-2">{t("s2Row3Models")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="list-disc list-inside mt-4 space-y-1">
              <li>{t("s2I1")}</li>
              <li>{t("s2I2")}</li>
              <li>{t("s2I3")}</li>
              <li>{t("s2I4")}</li>
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
            <ul className="list-disc list-inside space-y-1">
              <li>{t("s3I1")}</li>
              <li>{t("s3I2")}</li>
              <li>{t("s3I3")}</li>
              <li>{t("s3I4")}</li>
              <li>{t("s3I5")}</li>
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
              <li>
                {t("s4I2")}{" "}
                <a href="mailto:support@hapuppy.com" className="text-violet-400 hover:text-violet-300 transition-colors">
                  support@hapuppy.com
                </a>.
              </li>
              <li>{t("s4I3")}</li>
            </ul>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s5Title")}
            </h2>
            <p>{t("s5Body")}</p>
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
              <li>{t("s6I1")}</li>
              <li>{t("s6I2")}</li>
              <li>{t("s6I3")}</li>
              <li>{t("s6I4")}</li>
              <li>{t("s6I5")}</li>
              <li>{t("s6I6")}</li>
              <li>{t("s6I7")}</li>
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
            <p>{t("s8Body")}</p>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s9Title")}
            </h2>
            <p>{t("s9Body")}</p>
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
            <p>{t("s11Body")}</p>
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
            <p>{t("s14Body")}</p>
          </motion.section>

          <motion.section 
            variants={sectionVariants}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300"
          >
            <h2 className="text-base font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {t("s15Title")}
            </h2>
            <p>
              {t("s15Body")}{" "}
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
