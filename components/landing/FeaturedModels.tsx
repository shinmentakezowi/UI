"use client";

import { Link } from "@/i18n/routing";
import { ArrowRight, Crown, Sparkles, CircleDot } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FEATURED_MODELS } from "@/lib/featured-models";
import {
  AnthropicIcon,
  OpenAIIcon,
  GoogleIcon,
  ZhipuIcon,
  XAIIcon,
} from "@/components/icons/providers";
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

interface ProviderTheme {
  Icon: (props: IconProps) => React.ReactElement;
  color: string;
  accent: string;
  meshGradient: string;
}

const PROVIDER_THEMES: Record<string, ProviderTheme> = {
  Anthropic: {
    Icon: AnthropicIcon,
    color: "#D19B75",
    accent: "#D19B75",
    meshGradient:
      "radial-gradient(ellipse at 20% 0%, rgba(209,155,117,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(209,155,117,0.06) 0%, transparent 50%)",
  },
  OpenAI: {
    Icon: OpenAIIcon,
    color: "#10a37f",
    accent: "#10a37f",
    meshGradient:
      "radial-gradient(ellipse at 20% 0%, rgba(16,163,127,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(16,163,127,0.06) 0%, transparent 50%)",
  },
  Google: {
    Icon: GoogleIcon,
    color: "#4285F4",
    accent: "#4285F4",
    meshGradient:
      "radial-gradient(ellipse at 20% 0%, rgba(66,133,244,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(66,133,244,0.06) 0%, transparent 50%)",
  },
  Zhipu: {
    Icon: ZhipuIcon,
    color: "#1679FF",
    accent: "#1679FF",
    meshGradient:
      "radial-gradient(ellipse at 20% 0%, rgba(22,121,255,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(22,121,255,0.06) 0%, transparent 50%)",
  },
  xAI: {
    Icon: XAIIcon,
    color: "#a0a0a0",
    accent: "#a0a0a0",
    meshGradient:
      "radial-gradient(ellipse at 20% 0%, rgba(160,160,160,0.10) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(160,160,160,0.05) 0%, transparent 50%)",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function HeroModelCard({ model }: { model: (typeof FEATURED_MODELS)[0] }) {
  const theme = PROVIDER_THEMES[model.provider];
  const Icon = theme?.Icon;

  return (
    <motion.div variants={itemVariants}>
      <Link href="/login" className="group relative block cursor-pointer">
        <div className="relative rounded-[20px] overflow-hidden border border-white/[0.06] bg-[#08080c] transition-all duration-500 group-hover:border-white/[0.12]">
          {/* Mesh gradient background */}
          <div
            className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: theme?.meshGradient }}
          />

          {/* Animated top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
            <motion.div
              className="h-full w-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${theme?.accent}, transparent)`,
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(${theme?.color}20 1px, transparent 1px), linear-gradient(90deg, ${theme?.color}20 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative p-7 sm:p-9">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              {/* Left: Logo container with orbital ring */}
              <div className="relative w-16 h-16 shrink-0">
                {/* Orbital ring */}
                <motion.div
                  className="absolute inset-[-6px] rounded-full border border-dashed"
                  style={{ borderColor: `${theme?.color}20` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                {/* Orbital dot */}
                <motion.div
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: theme?.color,
                    boxShadow: `0 0 8px ${theme?.color}`,
                    transformOrigin: `4px ${16 + 4 + 6}px`,
                    top: -6,
                    left: "calc(50% - 4px)",
                    width: 8,
                    height: 8,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/[0.08] relative z-10"
                  style={{ background: `${theme?.color}10` }}
                >
                  {Icon && (
                    <div style={{ filter: `drop-shadow(0 0 10px ${theme?.color}60)` }}>
                      <Icon size={32} />
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {model.name}
                  </h3>
                  <span
                    className="text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest border"
                    style={{
                      color: theme?.color,
                      borderColor: `${theme?.color}30`,
                      background: `${theme?.color}10`,
                    }}
                  >
                    {model.provider}
                  </span>
                  {model.badge && (
                    <span className="text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/25 flex items-center gap-1.5">
                      <Crown className="w-3 h-3" />
                      {model.badge}
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed mb-5 max-w-2xl">
                  {model.description}
                </p>

                {/* Capabilities + Context */}
                <div className="flex items-center gap-2 flex-wrap">
                  {model.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="text-[10px] px-2 py-0.5 rounded font-medium tracking-wide border border-white/[0.06] bg-white/[0.03] text-zinc-400"
                    >
                      {cap}
                    </span>
                  ))}
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold tracking-wide text-emerald-400/80 bg-emerald-500/8 border border-emerald-500/15">
                    {model.context} ctx
                  </span>
                  {/* Live indicator */}
                  <span className="flex items-center gap-1.5 text-[10px] text-emerald-400/70 ml-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    Live
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden sm:flex items-center self-center">
                <div className="w-10 h-10 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center group-hover:bg-white/[0.06] group-hover:border-white/[0.12] transition-all duration-300">
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ModelCard({
  model,
  index,
}: {
  model: (typeof FEATURED_MODELS)[0];
  index: number;
}) {
  const theme = PROVIDER_THEMES[model.provider];
  const Icon = theme?.Icon;

  return (
    <motion.div variants={itemVariants}>
      <Link href="/login" className="group relative block cursor-pointer h-full">
        <div className="relative h-full rounded-[20px] overflow-hidden border border-white/[0.06] bg-[#08080c] transition-all duration-500 group-hover:border-white/[0.12] group-hover:-translate-y-1">
          {/* Mesh gradient */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: theme?.meshGradient }}
          />

          {/* Left accent strip */}
          <div
            className="absolute top-0 left-0 w-[2px] h-0 group-hover:h-full transition-all duration-700 ease-out"
            style={{ background: `linear-gradient(180deg, ${theme?.accent}, transparent)` }}
          />

          <div className="relative p-6 flex flex-col h-full">
            {/* Header: Logo + Live dot */}
            <div className="flex items-start justify-between mb-5">
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/[0.06] group-hover:border-white/[0.12] transition-colors duration-300"
                  style={{ background: `${theme?.color}08` }}
                >
                  {Icon && (
                    <div
                      className="opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ filter: `drop-shadow(0 0 6px ${theme?.color}40)` }}
                    >
                      <Icon size={24} />
                    </div>
                  )}
                </div>
                {/* Number badge */}
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-md bg-[#111] border border-white/[0.08] flex items-center justify-center">
                  <span className="text-[9px] font-mono font-bold text-zinc-500">
                    0{index + 2}
                  </span>
                </div>
              </div>

              <span
                className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest border mt-1"
                style={{
                  color: theme?.color,
                  borderColor: `${theme?.color}25`,
                  background: `${theme?.color}08`,
                }}
              >
                {model.provider}
              </span>
            </div>

            {/* Name */}
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-white/90">
              {model.name}
            </h3>

            {/* Description */}
            <p className="text-xs text-zinc-500 leading-relaxed flex-1 mb-4">
              {model.description}
            </p>

            {/* Capability chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {model.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="text-[9px] px-1.5 py-0.5 rounded font-medium tracking-wide border border-white/[0.05] bg-white/[0.02] text-zinc-500 group-hover:text-zinc-400 group-hover:border-white/[0.08] transition-colors"
                >
                  {cap}
                </span>
              ))}
            </div>

            {/* Footer: Context + Arrow */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-zinc-500">
                  {model.context} ctx
                </span>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 group-hover:text-zinc-300 transition-colors">
                <span className="font-medium">Explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedModels() {
  const t = useTranslations("featuredModels");
  const featured = FEATURED_MODELS.filter((m) => m.badge);
  const others = FEATURED_MODELS.filter((m) => !m.badge);

  return (
    <section id="models" className="py-20 sm:py-28 px-4 scroll-mt-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Connecting line from ticker above */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-14 bg-gradient-to-b from-violet-500/15 to-transparent" />

      <div className="max-w-5xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/[0.06] text-xs text-violet-400 font-medium mb-5"
            whileHover={{ scale: 1.03 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t("badge")}
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-[1.1]">
            {t("titleStart")}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 max-w-lg mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Model grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-3"
        >
          {/* Hero card - full width */}
          {featured.map((m) => (
            <HeroModelCard key={m.id} model={m} />
          ))}

          {/* Regular cards - 2x2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {others.map((m, i) => (
              <ModelCard key={m.id} model={m} index={i} />
            ))}
          </div>

          {/* View all */}
          <motion.div variants={itemVariants}>
            <Link
              href="/models"
              className="group relative flex items-center justify-center gap-3 py-4 rounded-[20px] border border-dashed border-white/[0.06] bg-[#08080c]/50 hover:border-violet-500/20 hover:bg-violet-500/[0.02] transition-all duration-500 cursor-pointer"
            >
              <CircleDot className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 transition-colors" />
              <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-200 transition-colors">
                {t("viewAll")}
              </span>
              <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
