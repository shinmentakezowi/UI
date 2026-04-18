"use client";

import { motion } from "framer-motion";

export function HeroSubtitle({ subtitleRich }: { subtitleRich: string }) {
  const parts = subtitleRich.split(/\{\{price\}\}|\{\{\/price\}\}/);

  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="text-lg md:text-xl text-zinc-400 max-w-xl font-light leading-relaxed"
    >
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-white font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </motion.p>
  );
}
