"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Cpu, Globe, Zap, Timer } from "lucide-react";

function useCountUp(
  target: number,
  duration: number,
  started: boolean,
  decimals: number
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    let raf: number;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toString();
}

interface StatItemProps {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  delay?: number;
  icon: React.ElementType;
  gradient: string;
  glowColor: string;
  index: number;
}

function StatItem({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  delay = 0,
  icon: Icon,
  gradient,
  glowColor,
  index,
}: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(t);
    }
  }, [isInView, delay]);

  const display = useCountUp(target, 1800, started, decimals);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="group relative"
    >
      {/* Outer glow on hover */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{ background: gradient }}
      />

      {/* Animated border gradient */}
      <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-500"
          style={{ background: gradient }}
        />
      </div>

      {/* Card body */}
      <div className="relative rounded-2xl bg-[#0a0a0f]/90 backdrop-blur-xl p-6 sm:p-8 overflow-hidden">
        {/* Subtle background gradient */}
        <div
          className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 70%)` }}
        />

        {/* Shimmer sweep */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div
            className="absolute top-0 -left-full w-full h-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
              animation: "shimmer 2s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative flex flex-col items-center text-center space-y-3">
          {/* Icon */}
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
            style={{
              background: `linear-gradient(135deg, ${glowColor}20, ${glowColor}08)`,
              border: `1px solid ${glowColor}25`,
            }}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-5 h-5" style={{ color: glowColor }} />
          </motion.div>

          {/* Number */}
          <div className="relative">
            <span
              className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tight"
              style={{
                background: gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {prefix}
              {display}
              {suffix}
            </span>
            {/* Glow behind number */}
            <div
              className="absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
              style={{ background: glowColor }}
            />
          </div>

          {/* Label */}
          <div className="text-[10px] sm:text-[11px] text-zinc-500 group-hover:text-zinc-400 tracking-[0.25em] font-mono font-medium uppercase transition-colors duration-300">
            {label}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[2px] transition-all duration-500 rounded-full" style={{ background: gradient }} />
      </div>
    </motion.div>
  );
}

const STAT_CONFIG = [
  {
    icon: Cpu,
    gradient: "linear-gradient(135deg, #a78bfa, #7c3aed, #6d28d9)",
    glowColor: "#7c3aed",
  },
  {
    icon: Globe,
    gradient: "linear-gradient(135deg, #22d3ee, #06b6d4, #0891b2)",
    glowColor: "#06b6d4",
  },
  {
    icon: Zap,
    gradient: "linear-gradient(135deg, #34d399, #10b981, #059669)",
    glowColor: "#10b981",
  },
  {
    icon: Timer,
    gradient: "linear-gradient(135deg, #f472b6, #ec4899, #db2777)",
    glowColor: "#ec4899",
  },
];

export function AnimatedStats() {
  const t = useTranslations("stats");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatItem
          target={100}
          suffix="+"
          label={t("models")}
          delay={0}
          index={0}
          {...STAT_CONFIG[0]}
        />
        <StatItem
          target={10}
          suffix="+"
          label={t("providers")}
          delay={150}
          index={1}
          {...STAT_CONFIG[1]}
        />
        <StatItem
          target={99.9}
          suffix="%"
          decimals={1}
          label={t("uptime")}
          delay={300}
          index={2}
          {...STAT_CONFIG[2]}
        />
        <StatItem
          prefix="<"
          target={50}
          suffix="ms"
          label={t("latency")}
          delay={450}
          index={3}
          {...STAT_CONFIG[3]}
        />
      </div>
    </div>
  );
}
