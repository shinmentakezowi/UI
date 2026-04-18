"use client";

import { useEffect, useCallback } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import {
  OpenAIIcon,
  AnthropicIcon,
  GoogleIcon,
  XAIIcon,
  MoonshotIcon,
  DeepSeekIcon,
  MistralIcon,
  MetaIcon,
  QwenIcon,
  PerplexityIcon,
  CohereIcon,
  ZhipuIcon,
} from "@/components/icons/providers";

const floatingLogos = [
  { Icon: OpenAIIcon, size: 44, top: "6%", left: "5%", delay: 0, glow: "#10a37f" },
  { Icon: AnthropicIcon, size: 48, top: "12%", right: "8%", delay: 1.2, glow: "#D19B75" },
  { Icon: GoogleIcon, size: 40, top: "52%", left: "3%", delay: 2.5, glow: "#4285F4" },
  { Icon: XAIIcon, size: 36, bottom: "18%", right: "7%", delay: 0.8, glow: "#E0E0E0" },
  { Icon: MoonshotIcon, size: 42, top: "32%", left: "16%", delay: 3, glow: "#A78BFA" },
  { Icon: DeepSeekIcon, size: 46, bottom: "10%", left: "32%", delay: 1.8, glow: "#4D6BFE" },
  { Icon: MistralIcon, size: 38, top: "22%", right: "22%", delay: 0.5, glow: "#FF7000" },
  { Icon: MetaIcon, size: 34, top: "68%", left: "12%", delay: 2.2, glow: "#0081FB" },
  { Icon: QwenIcon, size: 40, top: "42%", right: "4%", delay: 3.5, glow: "#615CED" },
  { Icon: PerplexityIcon, size: 34, bottom: "28%", left: "48%", delay: 1.5, glow: "#22D3EE" },
  { Icon: CohereIcon, size: 32, top: "4%", left: "42%", delay: 4, glow: "#14B8A6" },
  { Icon: ZhipuIcon, size: 36, bottom: "6%", right: "28%", delay: 2.8, glow: "#1679FF" },
  { Icon: OpenAIIcon, size: 30, top: "78%", right: "16%", delay: 0.3, glow: "#10a37f" },
  { Icon: AnthropicIcon, size: 28, top: "10%", left: "68%", delay: 3.2, glow: "#D19B75" },
  { Icon: MistralIcon, size: 30, top: "58%", left: "58%", delay: 1, glow: "#FF7000" },
] as const;

function FloatingProviderLogos() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {floatingLogos.map((item, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: "top" in item ? item.top : undefined,
            left: "left" in item ? item.left : undefined,
            right: "right" in item ? item.right : undefined,
            bottom: "bottom" in item ? item.bottom : undefined,
            width: item.size,
            height: item.size,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.06, 0.18, 0.06],
            y: [0, -30, 0],
            rotate: [0, 6, -6, 0],
            scale: [0.95, 1.1, 0.95],
          }}
          transition={{
            duration: 10 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          {/* Glow halo behind icon */}
          <div
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              background: `radial-gradient(circle, ${item.glow}30 0%, transparent 70%)`,
              transform: "scale(2.5)",
            }}
          />
          <div className="relative" style={{ filter: `drop-shadow(0 0 8px ${item.glow}40)` }}>
            <item.Icon size={item.size} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function HeroBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    ({ clientX, clientY }: { clientX: number; clientY: number }) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
      {/* Moving Grid */}
      <div className="absolute inset-0 perspective-1000">
        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "0px 40px"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-grid-white opacity-[0.15] transform-gpu rotate-x-12 scale-150 origin-top"
        />
      </div>

      {/* Dynamic Spotlights */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              800px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.08),
              transparent 80%
            )
          `,
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />

      {/* Bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />

      {/* Floating Provider Logos */}
      <FloatingProviderLogos />
    </div>
  );
}
