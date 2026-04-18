"use client";

import { motion } from "framer-motion";
import { GlitchText, TypewriterText } from "./GlitchText";

export function HeroHeadline({
  line1,
  line2,
}: {
  line1: string;
  line2: string;
}) {
  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-white">
        <TypewriterText text={line1} delay={0.3} />
        <br />
        <GlitchText
          text={line2}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black"
        />
      </h1>
    </motion.div>
  );
}
