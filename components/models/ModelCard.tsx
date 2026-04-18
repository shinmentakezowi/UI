"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";
import Image from "next/image";

interface ModelCardProps {
  model: {
    id: string;
    provider: string;
    name: string;
    inputPrice: string;
    outputPrice: string;
    context: string;
    icon: any;
    color: string;
    gradient: string;
    logo?: string;
    popular?: boolean;
    speed: string;
  };
  index: number;
  onClick: () => void;
}

export function ModelCard({ model, index, onClick }: ModelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      {/* Glow Effect */}
      <div className={`absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 bg-gradient-to-br ${model.gradient}`} />

      {/* Card Container */}
      <div className="relative flex flex-col h-full p-1 rounded-2xl bg-gradient-to-br from-white/10 to-white/5">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent blur-sm" />

        <div className="h-full bg-[#0A0A0A] rounded-xl p-6 flex flex-col relative overflow-hidden border border-white/10 group-hover:border-violet-500/30 transition-all">
          {/* Animated Grid Pattern */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="relative w-14 h-14 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {model.logo ? (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-white/5 blur-md" />
                    <div className="relative w-full h-full rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-2.5 shadow-xl backdrop-blur-sm">
                      <Image 
                        src={model.logo} 
                        alt={`${model.provider} logo`}
                        width={32}
                        height={32}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-white/5 blur-md" />
                    <div className={`relative w-full h-full rounded-xl bg-white/10 border border-white/20 flex items-center justify-center ${model.color} shadow-xl`}>
                      <model.icon className="w-7 h-7" />
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                {model.popular && (
                  <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-violet-500/30 to-cyan-500/30 border border-violet-500/50 text-violet-400 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-violet-500/20">
                    <TrendingUp className="w-3 h-3" />
                    Popular
                  </span>
                )}
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider px-2 py-1 bg-white/5 rounded border border-white/10">
                  {model.context}
                </span>
              </div>
            </div>

            {/* Model Info */}
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-violet-400 transition-colors line-clamp-1">
              {model.name}
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-xs text-gray-400 font-mono">{model.provider}</p>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span className="text-[10px] text-gray-500 font-mono uppercase">{model.speed}</span>
            </div>

            {/* Pricing */}
            <div className="space-y-3 pt-4 border-t border-white/10 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                  <span className="text-sm text-gray-400 font-mono">Input</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-sm">{model.inputPrice}/1M</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
                  <span className="text-sm text-gray-400 font-mono">Output</span>
                </div>
                <span className="text-cyan-400 font-mono font-bold text-sm">{model.outputPrice}/1M</span>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              className="relative w-full py-3 font-mono text-sm font-bold tracking-wider transition-all overflow-hidden group/btn text-white mt-auto rounded-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 group-hover/btn:from-violet-500/20 group-hover/btn:to-cyan-500/20 border border-white/20 group-hover/btn:border-violet-500/50 transition-all duration-300 rounded-lg" />
              <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-30 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                View Details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
