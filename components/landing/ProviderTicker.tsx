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

const ROW1: ProviderEntry[] = [
  { key: "OPENAI", name: "OpenAI", Icon: OpenAIIcon, color: "#10a37f" },
  { key: "ANTHROPIC", name: "Anthropic", Icon: AnthropicIcon, color: "#D19B75" },
  { key: "GOOGLE", name: "Google Gemini", Icon: GoogleIcon, color: "#4285F4" },
  { key: "XAI", name: "xAI", Icon: XAIIcon, color: "#E0E0E0" },
  { key: "DEEPSEEK", name: "DeepSeek", Icon: DeepSeekIcon, color: "#4D6BFE" },
  { key: "MISTRAL", name: "Mistral AI", Icon: MistralIcon, color: "#FF7000" },
];

const ROW2: ProviderEntry[] = [
  { key: "META", name: "Meta Llama", Icon: MetaIcon, color: "#0081FB" },
  { key: "ALIBABA", name: "Qwen", Icon: QwenIcon, color: "#615CED" },
  { key: "ZHIPU", name: "Zhipu AI", Icon: ZhipuIcon, color: "#1679FF" },
  { key: "MOONSHOT", name: "Kimi", Icon: MoonshotIcon, color: "#1783FF" },
  { key: "COHERE", name: "Cohere", Icon: CohereIcon, color: "#14B8A6" },
  { key: "PERPLEXITY", name: "Perplexity", Icon: PerplexityIcon, color: "#22D3EE" },
];

function ProviderChip({ provider }: { provider: ProviderEntry }) {
  return (
    <motion.div
      className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 cursor-default shrink-0"
      whileHover={{ scale: 1.06, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
        style={{ background: `${provider.color}18` }}
      />

      <div
        className="w-5 h-5 flex items-center justify-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
        style={{ filter: `drop-shadow(0 0 4px ${provider.color}00)` }}
      >
        <provider.Icon size={20} />
      </div>

      <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-100 whitespace-nowrap tracking-wide transition-colors duration-300">
        {provider.name}
      </span>
    </motion.div>
  );
}

function MarqueeRow({
  providers,
  direction = "left",
  duration = 30,
}: {
  providers: ProviderEntry[];
  direction?: "left" | "right";
  duration?: number;
}) {
  // Repeat items enough times to guarantee no blank space on any screen width.
  // 4 copies ensures seamless coverage up to ~3000px+ viewports.
  const repeated = [...providers, ...providers, ...providers, ...providers];

  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className="flex shrink-0 gap-3"
        style={{
          animation: `${direction === "left" ? "marquee-left" : "marquee-right"} ${duration}s linear infinite`,
        }}
      >
        {repeated.map((p, i) => (
          <ProviderChip key={`${p.key}-${i}`} provider={p} />
        ))}
      </div>
    </div>
  );
}

export function ProviderTicker() {
  return (
    <div className="relative py-6 select-none space-y-3">
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <MarqueeRow providers={ROW1} direction="left" duration={32} />
      <MarqueeRow providers={ROW2} direction="right" duration={36} />

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </div>
  );
}
