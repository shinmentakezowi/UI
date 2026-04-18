"use client";

import { Link } from "@/i18n/routing";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

interface HeroCTAButtonsProps {
  getApiKeyLabel: string;
  quickStartLabel: string;
}

function CyberButton({
  children,
  className = "",
  primary = false,
}: {
  children: React.ReactNode;
  className?: string;
  primary?: boolean;
}) {
  return (
    <div
      className={`relative group px-8 py-4 font-mono text-sm font-bold tracking-wider overflow-hidden clip-path-slant transition-all duration-300 cursor-pointer ${primary ? "text-black" : "text-white"} ${className}`}
    >
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          primary
            ? "bg-white group-hover:bg-cyan-400"
            : "bg-white/5 border border-white/10 group-hover:border-white/30 group-hover:bg-white/10"
        }`}
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
      <div className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </div>
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-50" />
    </div>
  );
}

export function HeroCTAButtons({
  getApiKeyLabel,
  quickStartLabel,
}: HeroCTAButtonsProps) {
  return (
    <motion.div
      className="flex flex-col sm:flex-row items-center lg:items-start gap-6 w-full sm:w-auto pt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6 }}
    >
      <Link href="/login" className="w-full sm:w-auto">
        <CyberButton primary className="w-full sm:w-auto">
          {getApiKeyLabel} <ArrowRight className="w-4 h-4" />
        </CyberButton>
      </Link>

      <a href="#quickstart" className="w-full sm:w-auto">
        <CyberButton className="w-full sm:w-auto">
          <Play className="w-4 h-4" /> {quickStartLabel}
        </CyberButton>
      </a>
    </motion.div>
  );
}
