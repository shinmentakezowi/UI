"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import {
  Check,
  X,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Shield,
  Timer,
  Clock,
  Activity,
} from "lucide-react";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── Pricing Data ──────────────────────────────────────────────

interface Pack {
  key: string;
  name: string;
  price: number;
  credits: string;
  creditsDisplay: string;
  description: string;
  popular?: boolean;
  bonus?: string;
  features: string[];
  icon: typeof Zap;
  color: string;
}

const packs: Pack[] = [
  {
    key: "lite_pack",
    name: "Lite",
    price: 9.99,
    credits: "30M",
    creditsDisplay: "30M credits",
    description: "30M credits, unlock all 105+ models",
    features: ["30M credits", "All 105+ models", "Never expires", "Upgrades to Pro"],
    icon: Zap,
    color: "text-emerald-400",
  },
  {
    key: "standard_pack",
    name: "Standard",
    price: 19.99,
    credits: "120M",
    creditsDisplay: "120M credits",
    description: "120M credits, unlock all 105+ models",
    popular: true,
    bonus: "4× Value",
    features: ["120M credits", "All 105+ models", "Never expires", "Upgrades to Pro"],
    icon: Crown,
    color: "text-violet-400",
  },
  {
    key: "pro_pack",
    name: "Pro",
    price: 36.99,
    credits: "240M",
    creditsDisplay: "240M credits",
    description: "240M credits + priority routing",
    features: ["240M credits", "All 105+ models", "Never expires", "Upgrades to Pro", "Priority routing"],
    icon: Sparkles,
    color: "text-fuchsia-400",
  },
];

const highlights = [
  { icon: Timer, label: "Never Expires", desc: "Buy once, use forever" },
  { icon: Shield, label: "No Hidden Fees", desc: "What you see is what you pay" },
  { icon: Activity, label: "105+ Models", desc: "One key, every provider" },
  { icon: Clock, label: "7-Day Money Back", desc: "No questions asked" },
];

const comparisonRows = [
  { feature: "Pricing model", direct: "Per-token billing", hapuppy: "One-time credit pack" },
  { feature: "Monthly bill", direct: "Unpredictable", hapuppy: "Zero — credits never expire" },
  { feature: "Model access", direct: "Separate keys each", hapuppy: "One key, 105+ models" },
  { feature: "Prompt caching", direct: "Not included", hapuppy: "Auto-enabled" },
  { feature: "Setup time", direct: "Hours", hapuppy: "60 seconds" },
  { feature: "Dashboard", direct: "None", hapuppy: "Full usage analytics" },
];

const FAQS = [
  { q: "Which models are included?", a: "Buying any credit pack upgrades you to Pro, unlocking all 105+ models including Claude Opus, GPT, Gemini, DeepSeek, and more. Free users get basic models." },
  { q: "What's the difference between packs?", a: "The three packs differ only in credit amount: Lite 30M, Standard 120M, Pro 240M. The Pro pack also includes priority routing." },
  { q: "What are the usage limits?", a: "All Pro users get 100 requests per minute. Credits are consumed based on model multipliers and never expire. Free users get 100K daily credits." },
  { q: "Is this OpenAI-compatible?", a: "Yes. Point your OpenAI SDK base_url to our endpoint — works with Claude Code, Cursor, and any SDK." },
  { q: "What about prompt caching?", a: "Automatic. Claude Code's 40K-token system prompt is cached after the first request, cutting usage by ~90%." },
  { q: "Do credits expire?", a: "No. Vault credits never expire. Use them at your own pace." },
  { q: "What payment methods?", a: "All major credit cards and PayPal. Secure checkout powered by Creem." },
];

// ─── Background ────────────────────────────────────────────────

function PricingBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Moving Grid */}
      <div className="absolute inset-0 perspective-1000">
        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "0px 40px"] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute inset-0 bg-grid-white opacity-[0.06] transform-gpu rotate-x-12 scale-150 origin-top"
        />
      </div>

      {/* Radial Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/8 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/6 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "1s" }} />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />
    </div>
  );
}

// ─── Pricing Card ──────────────────────────────────────────────

function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleBuy(packKey: string) {
    setLoading(packKey);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: packKey }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      window.location.href = "/login";
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
      {packs.map((pack, i) => {
        const isPopular = pack.popular;
        const Icon = pack.icon;

        return (
          <motion.div
            key={pack.key}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.15,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            whileHover={{ y: -4 }}
            className={`relative flex flex-col group ${isPopular ? "md:scale-105" : ""}`}
          >
            {/* Subtle Glow */}
            <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Card Border */}
            <div
              className={`relative flex flex-col h-full p-[1px] rounded-2xl ${
                isPopular
                  ? "bg-gradient-to-br from-violet-500/50 to-fuchsia-500/50"
                  : "bg-white/10"
              }`}
            >
              <div className="h-full bg-[#0A0A0A] rounded-[15px] p-6 flex flex-col relative overflow-hidden">
                {/* Corner Accents */}
                <div
                  className={`absolute top-3 left-3 w-6 h-6 border-l border-t ${
                    isPopular ? "border-violet-400/50" : "border-white/20"
                  } transition-colors`}
                />
                <div
                  className={`absolute bottom-3 right-3 w-6 h-6 border-r border-b ${
                    isPopular ? "border-violet-400/50" : "border-white/20"
                  } transition-colors`}
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${pack.color} group-hover:scale-105 transition-transform duration-300`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    {isPopular && (
                      <span className="px-2 py-1 rounded-md bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[9px] font-mono font-bold uppercase tracking-wider">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-xl font-bold mb-2 tracking-tight text-white">
                    {pack.name}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4 min-h-[32px]">
                    {pack.description}
                  </p>

                  {/* Pricing */}
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-black text-white tracking-tighter">
                        ${pack.price}
                      </span>
                      <span className="text-gray-500 font-mono text-xs">one-time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-base font-bold ${
                          isPopular ? "text-violet-400" : "text-emerald-400"
                        }`}
                      >
                        {pack.creditsDisplay}
                      </span>
                      {pack.bonus && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md font-mono text-[10px] font-bold border border-emerald-500/30">
                          {pack.bonus}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-[10px] mt-2 font-mono">
                      <span className="text-gray-600">{"// "}</span>
                      Credits never expire
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {pack.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-xs text-gray-300">
                        <Check
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isPopular ? "text-violet-400" : "text-gray-600"
                          }`}
                          strokeWidth={2.5}
                        />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleBuy(pack.key)}
                    disabled={loading !== null}
                    className={`relative w-full py-3 font-mono text-xs font-bold tracking-wider uppercase transition-all overflow-hidden group/btn rounded-lg ${
                      isPopular ? "text-black" : "text-white"
                    }`}
                  >
                    {/* Background */}
                    <div
                      className={`absolute inset-0 transition-all duration-300 ${
                        isPopular
                          ? "bg-gradient-to-r from-violet-400 to-fuchsia-400 group-hover/btn:from-violet-300 group-hover/btn:to-fuchsia-300"
                          : "bg-white/5 group-hover/btn:bg-white/10 border border-white/10 group-hover/btn:border-white/20"
                      }`}
                    />

                    {/* Shine */}
                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />

                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading === pack.key ? "Redirecting..." : "Buy Now"}
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative selection:bg-violet-500/30 selection:text-white">
      <PricingBackground />

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-28 sm:pt-36 pb-10 sm:pb-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/5 border border-violet-500/15 text-violet-400 text-[11px] font-mono font-bold tracking-wider uppercase mb-5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Simple Pricing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-3"
          >
            One-time credit packs.
            <span className="block mt-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Never expires.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed"
          >
            Buy once, use forever. All 105+ models included. No subscriptions, no hidden fees.
          </motion.p>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="relative pb-12 sm:pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <PricingCards />
        </div>
      </section>

      {/* ── Trust Highlights ── */}
      <section className="relative pb-20 sm:pb-28 px-4 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto pt-16 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {highlights.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:from-white/[0.06] hover:to-white/[0.03] hover:border-violet-500/20 transition-all duration-500 text-center overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
                </div>

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Icon className="w-6 h-6 text-violet-400 group-hover:text-violet-300 transition-colors" strokeWidth={2} />
                  </div>
                  <p className="text-base font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">{label}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>

                {/* Corner accent */}
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/10 group-hover:border-violet-500/30 transition-colors" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section className="relative py-20 sm:py-28 px-4 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent">
              Why Hapuppy?
            </h2>
            <p className="text-sm text-zinc-400">
              Compare against direct API access.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden backdrop-blur-sm"
          >
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            {/* Header row */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono font-bold">Feature</span>
              <div className="flex items-center justify-center gap-2">
                <X className="w-3.5 h-3.5 text-red-400" strokeWidth={2.5} />
                <span className="text-xs text-red-400 uppercase tracking-wider font-mono font-bold">Direct API</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
                <span className="text-xs text-emerald-400 uppercase tracking-wider font-mono font-bold">Hapuppy</span>
              </div>
            </div>

            {comparisonRows.map((row, i) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-[1.5fr_1fr_1fr] gap-4 px-6 py-4 border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.03] transition-all duration-300 group"
              >
                <span className="text-sm text-zinc-200 font-medium group-hover:text-white transition-colors">{row.feature}</span>
                <span className="text-center text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors">{row.direct}</span>
                <span className="text-center text-xs text-emerald-400 font-semibold group-hover:text-emerald-300 transition-colors">{row.hapuppy}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative py-20 sm:py-28 px-4 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm text-zinc-400 text-center mb-12"
          >
            Everything you need to know about Hapuppy
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-6">
            {FAQS.map((f, i) => (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative p-6 rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent hover:border-violet-500/20 hover:bg-white/[0.04] transition-all duration-300"
              >
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 left-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-sm font-bold text-white mb-3 group-hover:text-violet-300 transition-colors leading-snug">
                    {f.q}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                    {f.a}
                  </p>
                </div>

                {/* Corner decoration */}
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/10 group-hover:border-violet-500/30 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative py-16 sm:py-24 px-4 border-t border-white/[0.04]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="relative rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.08] via-fuchsia-500/[0.05] to-transparent p-10 sm:p-16 overflow-hidden backdrop-blur-sm">
            {/* Animated gradient border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent" />

            {/* Glowing orbs */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-violet-500/20 rounded-full blur-[80px] animate-pulse-slow" />
            <div className="absolute -bottom-24 right-1/4 w-40 h-40 bg-fuchsia-500/15 rounded-full blur-[70px] animate-pulse-slow" style={{ animationDelay: "1s" }} />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-mono font-bold tracking-wider uppercase mb-6"
              >
                <Sparkles className="w-3 h-3" />
                Start Building Today
              </motion.div>

              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent leading-tight">
                Ready to build?
              </h2>
              <p className="text-sm text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed">
                Get your API key in seconds. No credit card required to start.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-bold hover:from-violet-400 hover:to-fuchsia-400 transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/models"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/[0.15] bg-white/[0.05] hover:bg-white/[0.10] hover:border-white/[0.25] text-white text-sm font-semibold transition-all duration-300 backdrop-blur-sm"
                >
                  <span>Browse Models</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] pt-12 pb-0 overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" width={18} height={18} className="rounded" />
            <span className="font-medium text-zinc-500">Hapuppy</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <Link href="/login" className="hover:text-zinc-400 transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-zinc-400 transition-colors">Register</Link>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
            <a href="mailto:support@hapuppy.com" className="hover:text-zinc-400 transition-colors">Email</a>
            <a href="https://discord.gg/YWayJmZKCu" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">Discord</a>
          </div>
          <span>&copy; {new Date().getFullYear()} Hapuppy</span>
        </div>
        <p className="max-w-2xl mx-auto px-4 text-center text-[10px] text-zinc-700 mb-8 leading-relaxed">
          Hapuppy is an independent product and is not affiliated with Anthropic, OpenAI, Google, xAI, Meta, Mistral, DeepSeek, or any other AI provider.
        </p>
        <div className="relative text-center select-none overflow-hidden h-28 sm:h-40">
          <div
            className="absolute inset-x-0 bottom-0 text-[80px] sm:text-[120px] md:text-[160px] font-black leading-none tracking-tighter text-transparent pointer-events-none"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.04)",
              background: "linear-gradient(to bottom, rgba(124,58,237,0.15), transparent)",
              WebkitBackgroundClip: "text",
            }}
          >
            hapuppy
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
