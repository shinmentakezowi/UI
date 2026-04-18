"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Zap,
  Star,
  Brain,
  Activity,
  Cpu,
  Command,
  X,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import { ModelsBackground } from "@/components/models/ModelsBackground";
import { ModelCard } from "@/components/models/ModelCard";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";

// Provider configuration with logos and accent colors
const providerConfig: Record<
  string,
  { icon: any; color: string; accent: string; gradient: string; logo?: string }
> = {
  ANTHROPIC: {
    icon: Zap,
    color: "text-violet-400",
    accent: "#8b5cf6",
    gradient: "from-violet-500/20 to-purple-500/20",
    logo: "/logos/claude.png",
  },
  OPENAI: {
    icon: Sparkles,
    color: "text-emerald-400",
    accent: "#10b981",
    gradient: "from-emerald-500/20 to-green-500/20",
    logo: "/logos/openai.png",
  },
  GOOGLE: {
    icon: Star,
    color: "text-blue-400",
    accent: "#3b82f6",
    gradient: "from-blue-500/20 to-cyan-500/20",
    logo: "/logos/gemini.png",
  },
  XAI: {
    icon: Brain,
    color: "text-zinc-400",
    accent: "#a1a1aa",
    gradient: "from-zinc-500/20 to-gray-500/20",
    logo: "/logos/xai.png",
  },
  DEEPSEEK: {
    icon: Activity,
    color: "text-cyan-400",
    accent: "#06b6d4",
    gradient: "from-cyan-500/20 to-teal-500/20",
    logo: "/logos/deepseek.png",
  },
  MISTRAL: {
    icon: Zap,
    color: "text-orange-400",
    accent: "#f97316",
    gradient: "from-orange-500/20 to-amber-500/20",
    logo: "/logos/mistral.png",
  },
  META: {
    icon: Brain,
    color: "text-sky-400",
    accent: "#0ea5e9",
    gradient: "from-sky-500/20 to-blue-500/20",
    logo: "/logos/meta.png",
  },
  ALIBABA: {
    icon: Activity,
    color: "text-red-400",
    accent: "#ef4444",
    gradient: "from-red-500/20 to-rose-500/20",
    logo: "/logos/qwen.png",
  },
  ZHIPU: {
    icon: Star,
    color: "text-fuchsia-400",
    accent: "#d946ef",
    gradient: "from-fuchsia-500/20 to-pink-500/20",
    logo: "/logos/zhipu.png",
  },
  MOONSHOT: {
    icon: Brain,
    color: "text-slate-400",
    accent: "#94a3b8",
    gradient: "from-slate-500/20 to-gray-500/20",
    logo: "/logos/kimi.png",
  },
  COHERE: {
    icon: Activity,
    color: "text-teal-400",
    accent: "#14b8a6",
    gradient: "from-teal-500/20 to-cyan-500/20",
    logo: "/logos/cohere.png",
  },
  PERPLEXITY: {
    icon: Sparkles,
    color: "text-indigo-400",
    accent: "#6366f1",
    gradient: "from-indigo-500/20 to-purple-500/20",
    logo: "/logos/perplexity.png",
  },
  OTHER: {
    icon: Cpu,
    color: "text-zinc-400",
    accent: "#71717a",
    gradient: "from-zinc-500/20 to-gray-500/20",
  },
};

const providers = [
  { key: "All", label: "All Models", logo: null },
  { key: "Anthropic", label: "Anthropic", logo: "/logos/claude.png" },
  { key: "OpenAI", label: "OpenAI", logo: "/logos/openai.png" },
  { key: "Google", label: "Google", logo: "/logos/gemini.png" },
  { key: "xAI", label: "xAI", logo: "/logos/xai.png" },
  { key: "DeepSeek", label: "DeepSeek", logo: "/logos/deepseek.png" },
  { key: "Mistral", label: "Mistral", logo: "/logos/mistral.png" },
  { key: "Meta", label: "Meta", logo: "/logos/meta.png" },
  { key: "Qwen", label: "Qwen", logo: "/logos/qwen.png" },
  { key: "Perplexity", label: "Perplexity", logo: "/logos/perplexity.png" },
];

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("All");
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    async function loadModels() {
      try {
        const { MOCK_MODELS, MODEL_SPECS } = await import("@/lib/mock-data");
        const { detectProvider } = await import("@/lib/models");

        const transformedModels = MOCK_MODELS.map(
          (id: string, index: number) => {
            const provider = detectProvider(id);
            const config = providerConfig[provider] || providerConfig.OTHER;
            const specs = MODEL_SPECS[id] || {
              context: "128K",
              description: "",
            };

            return {
              id,
              name: id,
              provider,
              context: specs.context,
              description: specs.description,
              icon: config.icon,
              color: config.color,
              accent: config.accent,
              gradient: config.gradient,
              logo: config.logo,
              popular: index < 10,
            };
          }
        );

        setModels(transformedModels);
      } catch (error) {
        console.error("Failed to load models:", error);
      } finally {
        setLoading(false);
      }
    }

    loadModels();
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("model-search")?.focus();
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        (document.activeElement as HTMLElement)?.blur();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider =
      selectedProvider === "All" ||
      model.provider === selectedProvider.toUpperCase() ||
      (selectedProvider === "Qwen" && model.provider === "ALIBABA");
    return matchesSearch && matchesProvider;
  });

  const handleModelClick = useCallback((model: any) => {
    navigator.clipboard.writeText(model.id);
    setCopiedId(model.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // Unique provider count
  const providerCount = new Set(models.map((m) => m.provider)).size;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
        <ModelsBackground />
        <Navbar />
        <div className="relative z-10 pt-28 pb-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Skeleton header */}
            <div className="mb-10">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
                <div>
                  <div className="h-7 w-40 rounded-full bg-white/[0.04] animate-pulse mb-4" />
                  <div className="h-9 w-56 rounded-lg bg-white/[0.06] animate-pulse mb-2" />
                  <div className="h-4 w-72 rounded bg-white/[0.04] animate-pulse" />
                </div>
                <div className="flex gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-20 h-16 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
                  ))}
                </div>
              </div>
              {/* Skeleton search */}
              <div className="h-12 max-w-2xl rounded-xl bg-white/[0.04] border border-white/[0.06] animate-pulse" />
            </div>
            {/* Skeleton filter pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse" style={{ width: `${60 + i * 10}px` }} />
              ))}
            </div>
            {/* Skeleton grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-[#0A0A0A] border border-white/[0.06] overflow-hidden" style={{ animationDelay: `${i * 75}ms` }}>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.06] animate-pulse" />
                        <div>
                          <div className="h-3 w-14 rounded bg-white/[0.06] animate-pulse mb-2" />
                          <div className="h-4 w-10 rounded bg-white/[0.04] animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <div className="h-5 w-3/4 rounded bg-white/[0.06] animate-pulse mb-2" />
                    <div className="h-3 w-full rounded bg-white/[0.04] animate-pulse mb-1" />
                    <div className="h-3 w-2/3 rounded bg-white/[0.04] animate-pulse" />
                  </div>
                  <div className="px-5 py-3 border-t border-white/[0.04]">
                    <div className="h-3 w-1/2 rounded bg-white/[0.04] animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      <ModelsBackground />
      <Navbar />

      <div className="relative z-10 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-xs font-medium text-violet-400">
                    {models.length} models available
                  </span>
                </motion.div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
                  Model Library
                </h1>
                <p className="text-gray-400 text-sm sm:text-base max-w-lg">
                  Browse and discover AI models from{" "}
                  <span className="text-white font-medium">
                    {providerCount} providers
                  </span>
                  . Click any model to copy its ID.
                </p>
              </div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-4"
              >
                {[
                  {
                    label: "Models",
                    value: models.length,
                    color: "text-violet-400",
                  },
                  {
                    label: "Providers",
                    value: providerCount,
                    color: "text-cyan-400",
                  },
                  {
                    label: "Max Context",
                    value: "1M",
                    color: "text-amber-400",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                  >
                    <p
                      className={`text-lg font-bold ${stat.color} font-mono`}
                    >
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative max-w-2xl"
            >
              <div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0A0A0A]/80 backdrop-blur-xl border transition-all duration-300 ${
                  searchFocused
                    ? "border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <Search
                  className={`w-4 h-4 transition-colors ${searchFocused ? "text-violet-400" : "text-gray-500"}`}
                />
                <input
                  id="model-search"
                  type="text"
                  placeholder="Search models by name or provider..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-sm"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 hover:bg-white/10 rounded-md transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ) : (
                  <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
                    <Command className="w-3 h-3 text-gray-500" />
                    <span className="text-[11px] text-gray-500 font-medium">
                      K
                    </span>
                  </div>
                )}
                <AnimatePresence>
                  {searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="px-2 py-1 bg-violet-500/15 text-violet-400 text-xs font-mono rounded-md border border-violet-500/20"
                    >
                      {filteredModels.length}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Provider Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {providers.map((provider) => {
                const isSelected = selectedProvider === provider.key;
                return (
                  <button
                    key={provider.key}
                    onClick={() => setSelectedProvider(provider.key)}
                    className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                        : "bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-gray-200 hover:border-white/[0.12]"
                    }`}
                  >
                    {provider.logo && (
                      <Image
                        src={provider.logo}
                        alt=""
                        width={14}
                        height={14}
                        className={`object-contain transition-opacity ${isSelected ? "opacity-100" : "opacity-50 group-hover:opacity-80"}`}
                      />
                    )}
                    {!provider.logo && provider.key === "All" && (
                      <Layers
                        className={`w-3.5 h-3.5 ${isSelected ? "text-violet-400" : "text-gray-500"}`}
                      />
                    )}
                    {provider.label}
                    {isSelected && provider.key !== "All" && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-0.5 text-[10px] text-violet-400/70 font-mono"
                      >
                        {filteredModels.length}
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Copy Toast */}
          <AnimatePresence>
            {copiedId && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0A0A0A]/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/10"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-200">Copied</span>
                <code className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                  {copiedId}
                </code>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Models Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredModels.map((model, i) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  index={i}
                  onClick={() => handleModelClick(model)}
                  copied={copiedId === model.id}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results */}
          {filteredModels.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-5">
                <Search className="w-7 h-7 text-gray-600" />
              </div>
              <p className="text-gray-400 text-base mb-1">No models found</p>
              <p className="text-gray-600 text-sm mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedProvider("All");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] rounded-xl text-sm text-gray-300 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Clear filters
              </button>
            </motion.div>
          )}

          {/* Footer Stats */}
          {filteredModels.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex items-center justify-center gap-3"
            >
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-white/[0.06]" />
              <p className="text-gray-500 text-xs">
                Showing{" "}
                <span className="text-violet-400 font-medium">
                  {filteredModels.length}
                </span>{" "}
                of{" "}
                <span className="text-gray-300 font-medium">
                  {models.length}
                </span>{" "}
                models
              </p>
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-white/[0.06]" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
