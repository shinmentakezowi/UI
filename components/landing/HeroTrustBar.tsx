"use client";

import { motion } from "framer-motion";
import { Cpu, Globe, Zap, Layers } from "lucide-react";

const icons = [Cpu, Globe, Zap, Layers];

export function HeroTrustBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6 }}
      className="pt-12 flex flex-col sm:flex-row items-center lg:items-start gap-6 text-zinc-500 text-sm border-t border-white/5 w-full"
    >
      <span className="uppercase tracking-widest text-[10px] font-mono opacity-50">
        POWERED BY
      </span>
      <div className="flex gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        {icons.map((Icon, i) => (
          <motion.div key={i} whileHover={{ scale: 1.2, color: "#fff" }}>
            <Icon className="w-6 h-6" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
