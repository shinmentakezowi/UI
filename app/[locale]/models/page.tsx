"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, Sparkles, Zap, Star, Brain, Activity, Cpu } from "lucide-react";
import { ModelsBackground } from "@/components/models/ModelsBackground";
import { ModelCard } from "@/components/models/ModelCard";
import { Navbar } from "@/components/Navbar";

// Provider configuration
const providerConfig: Record<string, { icon: any; color: string; gradient: string }> = {
  ANTHROPIC: { icon: Zap, color: "text-violet-400", gradient: "from-violet-500/20 to-purple-500/20" },
  OPENAI: { icon: Sparkles, color: "text-emerald-400", gradient: "from-emerald-500/20 to-green-500/20" },
  GOOGLE: { icon: Star, color: "text-blue-400", gradient: "from-blue-500/20 to-cyan-500/20" },
  XAI: { icon: Brain, color: "text-zinc-400", gradient: "from-zinc-500/20 to-gray-500/20" },
  DEEPSEEK: { icon: Activity, color: "text-cyan-400", gradient: "from-cyan-500/20 to-teal-500/20" },
  MISTRAL: { icon: Zap, color: "text-orange-400", gradient: "from-orange-500/20 to-amber-500/20" },
  META: { icon: Brain, color: "text-sky-400", gradient: "from-sky-500/20 to-blue-500/20" },
  ALIBABA: { icon: Activity, color: "text-red-400", gradient: "from-red-500/20 to-rose-500/20" },
  ZHIPU: { icon: Star, color: "text-fuchsia-400", gradient: "from-fuchsia-500/20 to-pink-500/20" },
  MOONSHOT: { icon: Brain, color: "text-slate-400", gradient: "from-slate-500/20 to-gray-500/20" },
  COHERE: { icon: Activity, color: "text-teal-400", gradient: "from-teal-500/20 to-cyan-500/20" },
  PERPLEXITY: { icon: Sparkles, color: "text-indigo-400", gradient: "from-indigo-500/20 to-purple-500/20" },
  OTHER: { icon: Cpu, color: "text-zinc-400", gradient: "from-zinc-500/20 to-gray-500/20" },
};

const providers = ["All", "Anthropic", "OpenAI", "Google", "xAI", "DeepSeek", "Mistral"];

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("All");
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch models data
  useState(() => {
    async function loadModels() {
      try {
        const { MOCK_MODELS } = await import("@/lib/mock-data");
        const { detectProvider } = await import("@/lib/models");
        
        const transformedModels = MOCK_MODELS.map((id: string, index: number) => {
          const provider = detectProvider(id);
          const config = providerConfig[provider] || providerConfig.OTHER;
          
          return {
            id,
            name: id,
            provider: provider,
            inputPrice: "$1.00",
            outputPrice: "$3.00",
            context: "128K",
            icon: config.icon,
            color: config.color,
            gradient: config.gradient,
            popular: index < 10,
            speed: "Fast",
          };
        });
        
        setModels(transformedModels);
      } catch (error) {
        console.error("Failed to load models:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadModels();
  });

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        model.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = selectedProvider === "All" || model.provider === selectedProvider.toUpperCase();
    return matchesSearch && matchesProvider;
  });

  const handleModelClick = (model: any) => {
    // Copy model ID to clipboard
    navigator.clipboard.writeText(model.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-mono">Loading models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      <ModelsBackground />
      <Navbar />

      {/* Corner Brackets - HUD Style */}
      <div className="absolute top-24 left-10 w-16 h-16 border-l-2 border-t-2 border-white/10 rounded-tl-2xl pointer-events-none z-10 hidden lg:block" />
      <div className="absolute top-24 right-10 w-16 h-16 border-r-2 border-t-2 border-white/10 rounded-tr-2xl pointer-events-none z-10 hidden lg:block" />

      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 space-y-4"
          >
            {/* Search Bar and Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 w-full lg:max-w-md">
                <div className="relative flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 hover:border-violet-500/30 transition-all">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search models..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500 text-sm"
                  />
                  {searchQuery && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2 py-1 bg-violet-500/20 text-violet-400 text-xs font-mono rounded border border-violet-500/30"
                    >
                      {filteredModels.length}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Provider Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {providers.map((provider) => (
                  <button
                    key={provider}
                    onClick={() => setSelectedProvider(provider)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedProvider === provider
                        ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {provider}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredModels.map((model, i) => (
              <ModelCard
                key={model.id}
                model={model}
                index={i}
                onClick={() => handleModelClick(model)}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredModels.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-gray-400 text-lg font-mono">No models found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedProvider("All");
                }}
                className="mt-6 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm font-mono transition-all"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          {/* Stats Footer */}
          {filteredModels.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-500 text-xs">
                Showing <span className="text-violet-400 font-medium">{filteredModels.length}</span> of{" "}
                <span className="text-white font-medium">{models.length}</span> models
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
