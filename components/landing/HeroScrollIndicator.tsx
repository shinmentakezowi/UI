"use client";

import { motion } from "framer-motion";

export function HeroScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600/30 z-10"
    >
      <span className="text-[10px] font-mono uppercase tracking-widest">
        SCROLL_DOWN
      </span>
      <motion.div
        animate={{ height: [20, 40, 20], opacity: [0.2, 0.8, 0.2] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-[1px] bg-white"
      />
    </motion.div>
  );
}
