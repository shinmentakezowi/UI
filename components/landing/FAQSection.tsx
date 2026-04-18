"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Layers,
  Gauge,
  Plug,
  Database,
  Wallet,
  CreditCard,
  HelpCircle,
  Plus,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const FAQ_META = [
  { icon: Layers, accent: "#a78bfa", label: "Models" },
  { icon: Gauge, accent: "#22d3ee", label: "Limits" },
  { icon: Plug, accent: "#34d399", label: "Compat" },
  { icon: Database, accent: "#fbbf24", label: "Cache" },
  { icon: Wallet, accent: "#f472b6", label: "Credits" },
  { icon: CreditCard, accent: "#60a5fa", label: "Payment" },
];

function PlusMinusIcon({ isOpen, accent }: { isOpen: boolean; accent: string }) {
  return (
    <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
      <motion.div
        className="absolute w-3 h-[1.5px] rounded-full"
        style={{ backgroundColor: isOpen ? accent : "#52525b" }}
        animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute w-3 h-[1.5px] rounded-full"
        style={{ backgroundColor: isOpen ? accent : "#52525b" }}
        animate={{ rotate: isOpen ? 0 : 90 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}

function DashedGridLines({ accent }: { accent: string }) {
  const lineStyle = {
    backgroundImage: `linear-gradient(to right, ${accent}50 50%, transparent 50%)`,
    backgroundSize: "8px 1px",
  };
  const lineStyleV = {
    backgroundImage: `linear-gradient(to bottom, ${accent}50 50%, transparent 50%)`,
    backgroundSize: "1px 8px",
  };

  return (
    <>
      {/* Top */}
      <motion.div
        className="absolute -top-[1px] -left-4 -right-4 h-[1px]"
        style={lineStyle}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        exit={{ opacity: 0, scaleX: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-transparent to-[#09090b]" />
      </motion.div>
      {/* Bottom */}
      <motion.div
        className="absolute -bottom-[1px] -left-4 -right-4 h-[1px]"
        style={lineStyle}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        exit={{ opacity: 0, scaleX: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-transparent to-[#09090b]" />
      </motion.div>
      {/* Left */}
      <motion.div
        className="absolute -top-4 -bottom-4 -left-[1px] w-[1px]"
        style={lineStyleV}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-transparent to-[#09090b]" />
      </motion.div>
      {/* Right */}
      <motion.div
        className="absolute -top-4 -bottom-4 -right-[1px] w-[1px]"
        style={lineStyleV}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-transparent to-[#09090b]" />
      </motion.div>
    </>
  );
}

function FAQItem({
  question,
  answer,
  index,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const meta = FAQ_META[index] ?? { icon: HelpCircle, accent: "#a78bfa", label: "FAQ" };
  const Icon = meta.icon;
  const accent = meta.accent;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Dashed grid lines on active */}
      <AnimatePresence>
        {isOpen && <DashedGridLines accent={accent} />}
      </AnimatePresence>

      <motion.div
        className="relative rounded-2xl border transition-all duration-300 overflow-hidden"
        style={{
          borderColor: isOpen ? `${accent}30` : "rgba(255,255,255,0.05)",
          background: isOpen ? `${accent}06` : "transparent",
          boxShadow: isOpen
            ? `0 0 30px -10px ${accent}20, 0 1px 3px ${accent}10`
            : "none",
        }}
        whileHover={
          !isOpen
            ? { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.015)" }
            : {}
        }
      >
        <button
          onClick={onToggle}
          className="relative w-full flex items-center gap-4 p-5 sm:p-6 text-left cursor-pointer group"
        >
          {/* Number badge */}
          <div
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold tracking-wider transition-all duration-300"
            style={{
              background: isOpen
                ? `linear-gradient(135deg, ${accent}30, ${accent}10)`
                : "rgba(255,255,255,0.03)",
              color: isOpen ? accent : "#52525b",
              border: `1px solid ${isOpen ? `${accent}25` : "rgba(255,255,255,0.04)"}`,
            }}
          >
            0{index + 1}
          </div>

          {/* Icon */}
          <div
            className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: isOpen ? `${accent}12` : "rgba(255,255,255,0.02)",
              border: `1px solid ${isOpen ? `${accent}20` : "rgba(255,255,255,0.04)"}`,
            }}
          >
            <Icon
              className="w-4 h-4 transition-colors duration-300"
              style={{ color: isOpen ? accent : "#71717a" }}
            />
          </div>

          {/* Question text */}
          <div className="flex-1 min-w-0">
            <span
              className="text-sm sm:text-[15px] font-semibold leading-snug transition-colors duration-300 block"
              style={{ color: isOpen ? "#fafafa" : "#d4d4d8" }}
            >
              {question}
            </span>
            {!isOpen && (
              <span className="text-[10px] font-mono text-zinc-600 mt-0.5 block">
                {meta.label}
              </span>
            )}
          </div>

          {/* Plus/minus icon */}
          <PlusMinusIcon isOpen={isOpen} accent={accent} />
        </button>

        {/* Answer */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                {/* Divider */}
                <div
                  className="h-[1px] mb-4 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${accent}20, ${accent}08)`,
                  }}
                />
                <motion.p
                  className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-[4.5rem]"
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {answer}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function FloatingParticle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-violet-400/20"
      style={{ left: x, top: y }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1.5, 0],
        y: [0, -30, -60],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

export function FAQSection() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const FAQS = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
  ];

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-24 sm:py-32 px-4 relative overflow-hidden scroll-mt-20 -mt-[13%]"
    >
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-500/[0.02] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-cyan-500/[0.015] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-pink-500/[0.012] rounded-full blur-[120px] pointer-events-none" />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      <FloatingParticle delay={0} x="15%" y="20%" />
      <FloatingParticle delay={1.2} x="80%" y="35%" />
      <FloatingParticle delay={2.4} x="25%" y="65%" />
      <FloatingParticle delay={3.6} x="70%" y="80%" />
      <FloatingParticle delay={0.8} x="50%" y="15%" />

      {/* Connecting line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-white/[0.06] to-transparent" />

      <div className="max-w-5xl mx-auto relative">
        {/* Two-column layout: header left, FAQ right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-start">
          {/* Left: sticky header */}
          <div className="lg:sticky lg:top-28">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/[0.06] text-xs text-violet-400 font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              FAQ
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="text-white">Frequently</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Asked Questions
              </span>
            </motion.h2>

            <motion.p
              className="text-sm sm:text-base text-zinc-500 leading-relaxed font-light mb-8 max-w-sm"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              Everything you need to know about our API, pricing, and how to get started.
            </motion.p>

            {/* Quick stats */}
            <motion.div
              className="hidden lg:flex flex-col gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="font-mono">100+ models available</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Plug className="w-3 h-3 text-cyan-400" />
                </div>
                <span className="font-mono">OpenAI SDK compatible</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Database className="w-3 h-3 text-amber-400" />
                </div>
                <span className="font-mono">Auto prompt caching</span>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="mt-8 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <span className="text-xs font-semibold text-zinc-300">Still have questions?</span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed mb-3">
                Our team is here to help. Reach out and we will get back to you within 24 hours.
              </p>
              <a
                href="mailto:support@hapuppy.com"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-400/80 hover:text-violet-400 transition-colors"
              >
                <span>support@hapuppy.com</span>
                <Plus className="w-3 h-3 rotate-45" />
              </a>
            </motion.div>
          </div>

          {/* Right: FAQ accordion */}
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQItem
                key={faq.q}
                question={faq.q}
                answer={faq.a}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}

            {/* Bottom decoration */}
            <motion.div
              className="pt-6 flex items-center gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
              <span className="text-[10px] font-mono text-zinc-700 tracking-widest uppercase">
                {FAQS.length} answers
              </span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
