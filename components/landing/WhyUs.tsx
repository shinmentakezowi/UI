"use client";

import {
  Code2,
  Globe,
  Zap,
  Shield,
  Wrench,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, type ReactNode } from "react";

interface FeatureCard {
  icon: ReactNode;
  title: string;
  desc: string;
  link: string | null;
  accent: string;
  stat?: string;
  statLabel?: string;
  gridClass: string;
  visual: "code" | "globe" | "speed" | "uptime" | "tools" | "price";
}

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  return (
    <motion.span
      className="font-mono font-black tabular-nums"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {value}{suffix}
    </motion.span>
  );
}

function CodeSnippetVisual() {
  return (
    <div className="relative mt-4 font-mono text-[10px] sm:text-[11px] leading-relaxed select-none">
      <div className="rounded-lg border border-white/[0.06] bg-black/40 p-3 overflow-hidden">
        <div className="flex gap-1.5 mb-2.5">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="text-zinc-500">{"// "}</span>
          <span className="text-emerald-400/80">Just change one line</span>
          <br />
          <span className="text-violet-400">base_url</span>
          <span className="text-zinc-500">{" = "}</span>
          <span className="text-amber-300/90">{'"beta.hapuppy.com"'}</span>
        </motion.div>
      </div>
    </div>
  );
}

function SpeedVisual() {
  return (
    <div className="mt-4 space-y-2">
      {[
        { label: "Overhead", value: 15, color: "bg-cyan-400" },
        { label: "Cache hit", value: 92, color: "bg-emerald-400" },
      ].map((bar) => (
        <div key={bar.label} className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-zinc-500 font-mono">{bar.label}</span>
            <span className="text-zinc-400 font-mono font-bold">{bar.value}{bar.label === "Overhead" ? "ms" : "%"}</span>
          </div>
          <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${bar.color}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${bar.value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function UptimeVisual() {
  const dots = Array.from({ length: 30 }, (_, i) => i < 29);
  return (
    <div className="mt-4 flex flex-wrap gap-[3px]">
      {dots.map((up, i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-[2px] ${up ? "bg-emerald-400/70" : "bg-red-400/50"}`}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.02 * i }}
        />
      ))}
      <div className="w-full mt-1.5 flex items-center gap-1.5 text-[9px] text-emerald-400/70 font-mono">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        All systems operational
      </div>
    </div>
  );
}

function ProviderLogosVisual() {
  const providers = ["Claude", "GPT", "Gemini", "Grok", "GLM", "Mistral", "Llama"];
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {providers.map((p, i) => (
        <motion.span
          key={p}
          className="text-[9px] px-2 py-1 rounded-md border border-white/[0.06] bg-white/[0.02] text-zinc-400 font-mono font-medium"
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.06 * i }}
        >
          {p}
        </motion.span>
      ))}
      <span className="text-[9px] px-2 py-1 rounded-md border border-violet-500/20 bg-violet-500/[0.06] text-violet-400 font-mono font-bold">
        +93 more
      </span>
    </div>
  );
}

function ToolsVisual() {
  const tools = ["Streaming", "Functions", "Vision", "Tool Use"];
  return (
    <div className="mt-4 grid grid-cols-2 gap-1.5">
      {tools.map((tool, i) => (
        <motion.div
          key={tool}
          className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono px-2 py-1.5 rounded-md border border-white/[0.04] bg-white/[0.01]"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 * i }}
        >
          <div className="w-1 h-1 rounded-full bg-emerald-400" />
          {tool}
        </motion.div>
      ))}
    </div>
  );
}

function PriceVisual() {
  return (
    <div className="mt-4 flex items-baseline gap-1">
      <span className="text-3xl font-black font-mono text-white">$9.99</span>
      <span className="text-zinc-500 text-xs font-mono">/mo</span>
      <motion.span
        className="ml-2 text-[9px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        FLAT RATE
      </motion.span>
    </div>
  );
}

const VISUAL_MAP: Record<string, () => ReactNode> = {
  code: CodeSnippetVisual,
  globe: ProviderLogosVisual,
  speed: SpeedVisual,
  uptime: UptimeVisual,
  tools: ToolsVisual,
  price: PriceVisual,
};

function FeatureCardComponent({
  feature,
  index,
}: {
  feature: FeatureCard;
  index: number;
}) {
  const VisualComponent = VISUAL_MAP[feature.visual];
  const tc = useTranslations("common");

  return (
    <motion.div
      className={`group relative rounded-[20px] overflow-hidden border border-white/[0.06] bg-[#08080c] transition-all duration-500 hover:border-white/[0.12] ${feature.gridClass}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
    >
      {/* Mesh gradient bg */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at 20% 0%, ${feature.accent}18 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, ${feature.accent}0a 0%, transparent 50%)`,
        }}
      />

      {/* Top accent bar animation */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.div
          className="h-full w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${feature.accent}, transparent)`,
          }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700"
        style={{
          backgroundImage: `linear-gradient(${feature.accent}20 1px, transparent 1px), linear-gradient(90deg, ${feature.accent}20 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative p-6 sm:p-7 h-full flex flex-col">
        {/* Icon + number */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.06] group-hover:border-white/[0.12] transition-colors duration-300"
            style={{ background: `${feature.accent}10` }}
          >
            <div
              className="text-zinc-400 group-hover:text-white transition-colors duration-300"
              style={{
                filter: `drop-shadow(0 0 6px ${feature.accent}40)`,
              }}
            >
              {feature.icon}
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold text-zinc-600 tracking-widest">
            0{index + 1}
          </span>
        </div>

        {/* Stat hero number for select cards */}
        {feature.stat && (
          <div className="mb-2">
            <span
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: feature.accent }}
            >
              <AnimatedCounter value={feature.stat} suffix={feature.statLabel} />
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 tracking-tight">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-zinc-500 leading-relaxed mb-auto">
          {feature.desc}
        </p>

        {/* Visual element */}
        {VisualComponent && <VisualComponent />}

        {/* Link */}
        {feature.link && (
          <a
            href={feature.link}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 group-hover:text-violet-400 transition-colors"
          >
            {tc("learnMore")}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

function SectionHeader({
  badge,
  titleStart,
  titleHighlight,
  subtitle,
}: {
  badge: string;
  titleStart: string;
  titleHighlight: string;
  subtitle: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="text-center mb-12 sm:mb-14">
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/[0.06] text-xs text-violet-400 font-medium mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <Zap className="w-3.5 h-3.5" />
        {badge}
      </motion.div>

      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-white">{titleStart}</span>
        <br className="hidden sm:block" />
        <span className="glitch-wrapper inline-block">
          <span
            className="glitch relative inline-block bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            data-text={titleHighlight}
          >
            {titleHighlight}
          </span>
        </span>
      </motion.h2>

      <motion.p
        className="text-sm sm:text-base text-zinc-500 max-w-xl mx-auto leading-relaxed font-light"
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

export function WhyUs() {
  const t = useTranslations("whyUs");
  const sectionRef = useRef<HTMLElement>(null);

  const features: FeatureCard[] = [
    {
      icon: <Code2 className="w-5 h-5" />,
      title: t("feature1Title"),
      desc: t("feature1Desc"),
      link: "#quickstart",
      accent: "#22d3ee",
      stat: "1",
      statLabel: " line",
      gridClass: "sm:col-span-2 lg:col-span-2",
      visual: "code",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: t("feature2Title"),
      desc: t("feature2Desc"),
      link: "#models",
      accent: "#a78bfa",
      stat: "100+",
      statLabel: "",
      gridClass: "sm:col-span-2 lg:col-span-1",
      visual: "globe",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: t("feature3Title"),
      desc: t("feature3Desc"),
      link: null,
      accent: "#fbbf24",
      stat: "<50",
      statLabel: "ms",
      gridClass: "lg:col-span-1",
      visual: "speed",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: t("feature4Title"),
      desc: t("feature4Desc"),
      link: null,
      accent: "#34d399",
      stat: "99.9",
      statLabel: "%",
      gridClass: "lg:col-span-1",
      visual: "uptime",
    },
    {
      icon: <Wrench className="w-5 h-5" />,
      title: t("feature5Title"),
      desc: t("feature5Desc"),
      link: null,
      accent: "#f472b6",
      gridClass: "lg:col-span-1",
      visual: "tools",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: t("feature6Title"),
      desc: t("feature6Desc"),
      link: "#pricing",
      accent: "#60a5fa",
      gridClass: "sm:col-span-2 lg:col-span-3",
      visual: "price",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="pt-0 sm:pt-1 pb-20 sm:pb-28 px-4 relative overflow-hidden -mt-[5%]"
    >
      {/* Background blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Connecting line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-white/[0.06] to-transparent" />

      <div className="max-w-5xl mx-auto relative">
        <SectionHeader
          badge={t("badge")}
          titleStart={t("titleStart")}
          titleHighlight={t("titleHighlight")}
          subtitle={t("subtitle")}
        />

        {/* Bento grid - asymmetric layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature, i) => (
            <FeatureCardComponent key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
