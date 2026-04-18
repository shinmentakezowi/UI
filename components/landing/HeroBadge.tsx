"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function HeroBadge({ badge }: { badge: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="group inline-flex items-center gap-3 px-3 py-1.5 rounded bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-default hover:border-violet-500/50"
    >
      <div className="flex items-center gap-2 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
        <Sparkles className="w-3 h-3" />
        NEW
      </div>
      <span className="text-xs font-mono text-zinc-400 tracking-wide group-hover:text-white transition-colors">
        {badge}
      </span>
    </motion.div>
  );
}
