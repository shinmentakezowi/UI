"use client";

import { motion } from "framer-motion";
import { Copy, Check, Sparkles } from "lucide-react";
import Image from "next/image";

interface ModelCardProps {
  model: {
    id: string;
    provider: string;
    name: string;
    context: string;
    icon: any;
    color: string;
    accent: string;
    gradient: string;
    logo?: string;
    popular?: boolean;
    description?: string;
  };
  index: number;
  onClick: () => void;
  copied?: boolean;
}

function formatModelName(id: string): string {
  return id
    .replace(/-\d{8}$/, "")
    .replace(/-latest$/, "")
    .replace(/-instruct$/, "");
}

const providerLabels: Record<string, string> = {
  ANTHROPIC: "Anthropic",
  OPENAI: "OpenAI",
  GOOGLE: "Google",
  XAI: "xAI",
  DEEPSEEK: "DeepSeek",
  MISTRAL: "Mistral",
  META: "Meta",
  ALIBABA: "Qwen",
  ZHIPU: "Zhipu",
  MOONSHOT: "Moonshot",
  COHERE: "Cohere",
  PERPLEXITY: "Perplexity",
  OTHER: "Other",
};

export function ModelCard({ model, index, onClick, copied }: ModelCardProps) {
  const displayName = formatModelName(model.name);
  const providerLabel = providerLabels[model.provider] || model.provider;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(0.03 * index, 0.6), duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      {/* Hover glow */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${model.accent}15, transparent 70%)`,
        }}
      />

      {/* Card */}
      <div className="relative h-full rounded-2xl bg-[#0A0A0A] border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-300 overflow-hidden">
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${model.accent}60, transparent)`,
          }}
        />

        <div className="p-5">
          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/[0.08] group-hover:border-white/[0.15] transition-all shrink-0">
                {model.logo ? (
                  <Image
                    src={model.logo}
                    alt=""
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                ) : (
                  <model.icon
                    className={`w-5 h-5 ${model.color}`}
                  />
                )}
              </div>
              {/* Provider */}
              <div>
                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider leading-none mb-1">
                  {providerLabel}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-gray-400 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                    {model.context}
                  </span>
                  {model.popular && (
                    <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber-400/80 px-1.5 py-0.5 rounded bg-amber-500/[0.08] border border-amber-500/[0.12]">
                      <Sparkles className="w-2.5 h-2.5" />
                      Popular
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Copy button */}
            <button
              className={`p-1.5 rounded-lg transition-all ${
                copied
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-white/[0.06] hover:text-gray-400"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Model name */}
          <h3 className="text-[15px] font-semibold text-gray-100 group-hover:text-white transition-colors mb-2 leading-tight truncate">
            {displayName}
          </h3>

          {/* Description */}
          {model.description && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 group-hover:text-gray-400 transition-colors">
              {model.description}
            </p>
          )}
        </div>

        {/* Bottom bar */}
        <div className="px-5 py-3 border-t border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
          <code className="text-[10px] font-mono text-gray-600 truncate max-w-[70%] group-hover:text-gray-500 transition-colors">
            {model.id}
          </code>
          <span className="text-[10px] text-gray-600 group-hover:text-gray-500 transition-colors shrink-0 ml-2">
            Click to copy
          </span>
        </div>
      </div>
    </motion.div>
  );
}
