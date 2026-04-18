"use client";

import { motion } from "framer-motion";
import {
  OpenAIIcon,
  AnthropicIcon,
  GoogleIcon,
  XAIIcon,
  DeepSeekIcon,
  MistralIcon,
  MetaIcon,
  QwenIcon,
  ZhipuIcon,
  MoonshotIcon,
  CohereIcon,
  PerplexityIcon,
} from "@/components/icons/providers";
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

interface ProviderEntry {
  key: string;
  name: string;
  Icon: (props: IconProps) => React.ReactElement;
  color: string;
}

const ALL_PROVIDERS: ProviderEntry[] = [
  { key: "OPENAI", name: "OpenAI", Icon: OpenAIIcon, color: "#10a37f" },
  { key: "ANTHROPIC", name: "Anthropic", Icon: AnthropicIcon, color: "#D19B75" },
  { key: "GOOGLE", name: "Google Gemini", Icon: GoogleIcon, color: "#4285F4" },
  { key: "XAI", name: "xAI", Icon: XAIIcon, color: "#E0E0E0" },
  { key: "DEEPSEEK", name: "DeepSeek", Icon: DeepSeekIcon, color: "#4D6BFE" },
  { key: "MISTRAL", name: "Mistral AI", Icon: MistralIcon, color: "#FF7000" },
  { key: "META", name: "Meta Llama", Icon: MetaIcon, color: "#0081FB" },
  { key: "ALIBABA", name: "Qwen", Icon: QwenIcon, color: "#615CED" },
  { key: "ZHIPU", name: "Zhipu AI", Icon: ZhipuIcon, color: "#1679FF" },
  { key: "MOONSHOT", name: "Moonshot", Icon: MoonshotIcon, color: "#A78BFA" },
  { key: "COHERE", name: "Cohere", Icon: CohereIcon, color: "#14B8A6" },
  { key: "PERPLEXITY", name: "Perplexity", Icon: PerplexityIcon, color: "#22D3EE" },
];

function ProviderChip({ provider }: { provider: ProviderEntry }) {
  return (
    <motion.div
      className="group relative flex items-center gap-3 px-6 py-3 rounded-full border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 cursor-default shrink-0"
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10"
        style={{ background: `${provider.color}15` }}
      />

      <div
        className="w-6 h-6 flex items-center justify-center rounded-md transition-transform duration-300 group-hover:scale-110"
        style={{ filter: `drop-shadow(0 0 6px ${provider.color}40)` }}
      >
        <provider.Icon size={20} />
      </div>

      <span className="text-[13px] font-medium text-zinc-400 group-hover:text-zinc-200 whitespace-nowrap tracking-wide transition-colors duration-300">
        {provider.name}
      </span>
    </motion.div>
  );
}

export function ProviderTicker() {
  const providers = ALL_PROVIDERS;

  return (
    <div className="relative overflow-hidden py-8 select-none">
      {/* Section label */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-[10px] tracking-[0.3em] font-mono text-zinc-600 uppercase mb-6"
      >
        Trusted Providers
      </motion.p>

      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />

      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      {/* Row 1 - scrolls left */}
      <div className="flex mb-3" style={{ animation: "ticker 40s linear infinite" }}>
        {[0, 1].map((i) => (
          <div key={i} aria-hidden={i === 1} className="flex shrink-0 gap-3 px-1.5">
            {providers.map((p) => (
              <ProviderChip key={p.key} provider={p} />
            ))}
          </div>
        ))}
      </div>

      {/* Row 2 - scrolls right (reversed order) */}
      <div className="flex" style={{ animation: "ticker-reverse 45s linear infinite" }}>
        {[0, 1].map((i) => (
          <div key={i} aria-hidden={i === 1} className="flex shrink-0 gap-3 px-1.5">
            {[...providers].reverse().map((p) => (
              <ProviderChip key={p.key} provider={p} />
            ))}
          </div>
        ))}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </div>
  );
}
