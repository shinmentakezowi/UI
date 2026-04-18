"use client";

import { Link } from "@/i18n/routing";
import { ArrowRight, Crown } from "lucide-react";
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
  gradient: string;
  bg: string;
}

const PROVIDER_THEMES: Record<string, ProviderTheme> = {
  Anthropic: {
    Icon: AnthropicIcon,
    color: "#D19B75",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    bg: "rgba(209,155,117,0.08)",
  },
  OpenAI: {
    Icon: OpenAIIcon,
    color: "#10a37f",
    gradient: "from-emerald-500/20 via-green-500/10 to-transparent",
    bg: "rgba(16,163,127,0.08)",
  },
  Google: {
    Icon: GoogleIcon,
    color: "#4285F4",
    gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
    bg: "rgba(66,133,244,0.08)",
  },
  Zhipu: {
    Icon: ZhipuIcon,
    color: "#1679FF",
    gradient: "from-blue-600/20 via-indigo-500/10 to-transparent",
    bg: "rgba(22,121,255,0.08)",
  },
  xAI: {
    Icon: XAIIcon,
    color: "#E0E0E0",
    gradient: "from-zinc-400/20 via-zinc-500/10 to-transparent",
    bg: "rgba(224,224,224,0.06)",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 120, damping: 20 },
  },
};

function HeroModelCard({ model }: { model: (typeof FEATURED_MODELS)[0] }) {
  const theme = PROVIDER_THEMES[model.provider];
  const Icon = theme?.Icon;

  return (
    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
      <Link
        href="/login"
        className="group relative block rounded-2xl overflow-hidden cursor-pointer"
      >
        {/* Animated border glow */}
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 blur-[1px]"
          style={{
            background: `linear-gradient(135deg, ${theme?.color}60, transparent 60%)`,
          }}
        />

        {/* Card body */}
        <div className="relative rounded-2xl bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/[0.06] p-6 sm:p-8 transition-all duration-300 group-hover:border-white/[0.12]">
          {/* Background radial glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${theme?.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
          />

          <div className="relative flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Provider logo */}
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/[0.08]"
              style={{ background: theme?.bg }}
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              {Icon && (
                <div style={{ filter: `drop-shadow(0 0 8px ${theme?.color}50)` }}>
                  <Icon size={28} />
                </div>
              )}
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="text-lg sm:text-xl font-bold text-white">
                  {model.name}
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border"
                  style={{
                    color: theme?.color,
                    borderColor: `${theme?.color}30`,
                    background: `${theme?.color}12`,
                  }}
                >
                  {model.provider}
                </span>
                {model.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5" />
                    {model.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
                {model.description}
              </p>
            </div>

            <ArrowRight
              className="w-5 h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0 self-center hidden sm:block"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ModelCard({ model }: { model: (typeof FEATURED_MODELS)[0] }) {
  const theme = PROVIDER_THEMES[model.provider];
  const Icon = theme?.Icon;

  return (
    <motion.div variants={itemVariants}>
      <Link
        href="/login"
        className="group relative block rounded-2xl overflow-hidden cursor-pointer h-full"
      >
        {/* Border glow */}
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-[1px]"
          style={{
            background: `linear-gradient(135deg, ${theme?.color}50, transparent 60%)`,
          }}
        />

        {/* Card body */}
        <div className="relative h-full rounded-2xl bg-[#0a0a0f]/90 backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 transition-all duration-300 group-hover:border-white/[0.12] group-hover:-translate-y-1">
          {/* Subtle bg glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${theme?.gradient} opacity-0 group-hover:opacity-80 transition-opacity duration-500 rounded-2xl`}
          />

          <div className="relative flex flex-col h-full">
            {/* Top: Logo + Provider */}
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className="w-11 h-11 rounded-xl flex items-center justify-center border border-white/[0.08]"
                style={{ background: theme?.bg }}
                whileHover={{ scale: 1.1 }}
              >
                {Icon && (
                  <div style={{ filter: `drop-shadow(0 0 6px ${theme?.color}40)` }}>
                    <Icon size={22} />
                  </div>
                )}
              </motion.div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider border"
                style={{
                  color: theme?.color,
                  borderColor: `${theme?.color}25`,
                  background: `${theme?.color}10`,
                }}
              >
                {model.provider}
              </span>
            </div>

            {/* Model name */}
            <h3 className="text-base font-bold text-white mb-1.5">
              {model.name}
            </h3>

            {/* Description */}
            <p className="text-xs text-zinc-500 leading-relaxed flex-1">
              {model.description}
            </p>

            {/* Bottom arrow */}
            <div className="flex items-center gap-1.5 mt-4 text-xs text-zinc-600 group-hover:text-zinc-300 transition-colors duration-300">
              <span className="font-medium">Try now</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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
    <section id="models" className="py-24 sm:py-32 px-4 scroll-mt-20 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-500/20 bg-violet-500/[0.06] text-xs text-violet-400 font-medium mb-6">
            <Crown className="w-3 h-3" />
            {t("badge")}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {t("titleStart")}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {/* Hero card (featured/badged model) */}
          {featured.map((m) => (
            <HeroModelCard key={m.id} model={m} />
          ))}

          {/* Remaining models */}
          {others.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </motion.div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-4"
        >
          <Link
            href="/models"
            className="group flex items-center justify-center gap-2.5 py-4 rounded-2xl border border-dashed border-white/[0.08] text-sm text-zinc-600 hover:text-zinc-200 hover:border-white/[0.18] hover:bg-white/[0.02] transition-all duration-300"
          >
            {t("viewAll")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
