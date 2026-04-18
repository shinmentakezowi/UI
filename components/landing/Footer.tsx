"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("common");

  const linkVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <footer className="border-t border-white/[0.05] pt-20 sm:pt-28 pb-0 overflow-hidden relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/[0.02] to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <motion.div 
          className="max-w-5xl mx-auto px-4 mb-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {/* Top section - Logo and status */}
          <motion.div 
            variants={linkVariants}
            className="flex items-center justify-between mb-12 pb-8 border-b border-white/[0.04]"
          >
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="" width={24} height={24} className="rounded" />
              <span className="text-xl font-bold text-white tracking-tight">Hapuppy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
              <span className="text-[11px] font-mono text-emerald-500/70 uppercase tracking-wider">Online</span>
            </div>
          </motion.div>

          {/* Main footer grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Product */}
            <motion.div variants={linkVariants}>
              <h3 className="text-xs font-mono font-semibold text-zinc-500 uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/dashboard/billing" className="text-sm text-zinc-400 hover:text-white transition-colors inline-block hover:translate-x-1 duration-200">{tc("pricing")}</Link></li>
                <li><Link href="/dashboard/models" className="text-sm text-zinc-400 hover:text-white transition-colors inline-block hover:translate-x-1 duration-200">Models</Link></li>
                <li><Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors inline-block hover:translate-x-1 duration-200">Dashboard</Link></li>
              </ul>
            </motion.div>

            {/* Account */}
            <motion.div variants={linkVariants}>
              <h3 className="text-xs font-mono font-semibold text-zinc-500 uppercase tracking-wider mb-4">Account</h3>
              <ul className="space-y-3">
                <li><Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors inline-block hover:translate-x-1 duration-200">{t("signIn")}</Link></li>
                <li><Link href="/register" className="text-sm text-zinc-400 hover:text-white transition-colors inline-block hover:translate-x-1 duration-200">{t("register")}</Link></li>
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div variants={linkVariants}>
              <h3 className="text-xs font-mono font-semibold text-zinc-500 uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-sm text-zinc-400 hover:text-white transition-colors inline-block hover:translate-x-1 duration-200">{t("privacy")}</Link></li>
                <li><Link href="/terms" className="text-sm text-zinc-400 hover:text-white transition-colors inline-block hover:translate-x-1 duration-200">{t("terms")}</Link></li>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div variants={linkVariants}>
              <h3 className="text-xs font-mono font-semibold text-zinc-500 uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:support@hapuppy.com" className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-200">
                    <Mail className="w-3.5 h-3.5" />
                    {t("email")}
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/YWayJmZKCu" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-200">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {t("discord")}
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Disclaimer */}
          <motion.p 
            variants={linkVariants}
            className="max-w-3xl mx-auto text-center text-[10px] text-zinc-700 mb-8 leading-relaxed"
          >
            {t("disclaimer")}
          </motion.p>

          {/* Copyright */}
          <motion.div 
            variants={linkVariants}
            className="text-center text-xs text-zinc-600 pt-6 border-t border-white/[0.04]"
          >
            <span>&copy; {new Date().getFullYear()} Hapuppy. All rights reserved.</span>
          </motion.div>
        </motion.div>

        {/* Large text background */}
        <div className="relative text-center select-none overflow-hidden h-28 sm:h-40">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-x-0 text-[80px] sm:text-[120px] md:text-[160px] font-black leading-none tracking-tighter text-transparent pointer-events-none"
            style={{
              bottom: "10%",
              WebkitTextStroke: "1px rgba(255,255,255,0.04)",
              background: "linear-gradient(to bottom, rgba(124,58,237,0.15), transparent)",
              WebkitBackgroundClip: "text",
            }}
          >
            hapuppy
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
