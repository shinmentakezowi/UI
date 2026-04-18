"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  Terminal,
  ArrowRight,
} from "lucide-react";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function TerminalTyper() {
  const lines = [
    { prompt: "~", cmd: "curl https://beta.hapuppy.com/v1/models", delay: 0 },
    { prompt: "", cmd: '{"models": ["gpt-4o", "claude-sonnet", "gemini-pro", ...105 more]}', delay: 1.2, isOutput: true },
    { prompt: "~", cmd: "export OPENAI_BASE_URL=https://beta.hapuppy.com/v1", delay: 2.5 },
    { prompt: "~", cmd: "echo $OPENAI_BASE_URL", delay: 3.8 },
    { prompt: "", cmd: "https://beta.hapuppy.com/v1", delay: 4.5, isOutput: true },
    { prompt: "~", cmd: "python app.py --model claude-sonnet-4-20250514", delay: 5.5 },
    { prompt: "", cmd: "Connected to Hapuppy Gateway  //  latency: 38ms", delay: 6.8, isOutput: true },
    { prompt: "", cmd: "Streaming response from anthropic/claude-sonnet ...", delay: 7.5, isOutput: true },
  ];

  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers = lines.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay * 1000)
    );
    const resetTimer = setTimeout(() => setVisibleLines(0), 10000);
    const restartTimer = setTimeout(() => {
      setVisibleLines(0);
      const newTimers = lines.map((line, i) =>
        setTimeout(() => setVisibleLines(i + 1), line.delay * 1000)
      );
      return () => newTimers.forEach(clearTimeout);
    }, 10500);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(resetTimer);
      clearTimeout(restartTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="font-mono text-[11px] leading-[1.8] text-gray-500">
      {lines.slice(0, visibleLines).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className={line.isOutput ? "text-gray-600 pl-0" : ""}
        >
          {line.prompt && (
            <span className="text-violet-500">{line.prompt}</span>
          )}
          {line.prompt && <span className="text-gray-700"> $ </span>}
          <span className={line.isOutput ? "text-emerald-500/70" : "text-gray-400"}>
            {line.cmd}
          </span>
        </motion.div>
      ))}
      {visibleLines < lines.length && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1.5 h-3.5 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"
        />
      )}
    </div>
  );
}

function FloatingModelBadges() {
  const models = [
    { name: "GPT-4o", color: "from-green-500/20 to-emerald-500/20 border-green-500/20" },
    { name: "Claude Sonnet", color: "from-orange-500/20 to-amber-500/20 border-orange-500/20" },
    { name: "Gemini Pro", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/20" },
    { name: "Llama 3.1", color: "from-purple-500/20 to-violet-500/20 border-purple-500/20" },
    { name: "Mistral", color: "from-pink-500/20 to-rose-500/20 border-pink-500/20" },
    { name: "DeepSeek", color: "from-teal-500/20 to-cyan-500/20 border-teal-500/20" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {models.map((model, i) => (
        <motion.div
          key={model.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
          className={`px-2.5 py-1 rounded-md bg-gradient-to-r ${model.color} border text-[10px] font-mono text-white/70`}
        >
          {model.name}
        </motion.div>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.replace("/dashboard");
  }

  async function handleGithubLogin() {
    setGithubLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen flex bg-[#050505] selection:bg-violet-500/30 selection:text-white overflow-hidden">
      {/* Left Panel - Live Terminal + Ambient Art */}
      <div className="hidden lg:flex lg:w-[52%] relative bg-[#020202]">
        {/* Layered backgrounds */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_40%,transparent_100%)]">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-fuchsia-900/15" />
        </div>

        {/* Animated neon scanline */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"
          />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-violet-600/8 blur-[120px] animate-orb-drift" />
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-fuchsia-600/6 blur-[100px] animate-orb-drift-reverse" />

        {/* HUD corners */}
        <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-white/[0.06] rounded-tl-2xl" />
        <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-white/[0.06] rounded-tr-2xl" />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-l-2 border-b-2 border-white/[0.06] rounded-bl-2xl" />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-white/[0.06] rounded-br-2xl" />

        {/* Vertical data lines */}
        <div className="absolute top-1/3 left-5 w-[1px] h-20 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-1/4 right-5 w-[1px] h-20 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full h-full">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/favicon.svg" alt="" width={22} height={22} className="rounded" />
              <span className="text-lg font-bold tracking-tighter text-white">Hapuppy</span>
            </Link>
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/20">
              <span>SYS.V.2.04</span>
              <span className="text-white/10">//</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#22c55e] animate-pulse" />
                <span className="text-emerald-500/60">ONLINE</span>
              </div>
            </div>
          </div>

          {/* Center - Terminal window */}
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl border border-white/[0.08] bg-[#0A0A0A]/80 backdrop-blur-sm overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            >
              {/* Terminal chrome */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-black/40">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/25">
                  <Terminal className="w-3 h-3" />
                  <span>hapuppy-gateway</span>
                </div>
              </div>
              {/* Terminal body */}
              <div className="p-5 min-h-[200px]">
                <TerminalTyper />
              </div>
              {/* Status bar */}
              <div className="px-4 py-1.5 border-t border-white/[0.04] bg-black/30 flex items-center justify-between text-[9px] font-mono text-white/20">
                <span>bash -- 80x24</span>
                <div className="flex items-center gap-3">
                  <span>UTF-8</span>
                  <span>105 models</span>
                  <span>p99: 42ms</span>
                </div>
              </div>
            </motion.div>

            {/* Model badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-6"
            >
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-3">Available Models</p>
              <FloatingModelBadges />
            </motion.div>
          </div>

          {/* Bottom bar */}
          <div className="flex justify-between items-end text-[10px] font-mono text-white/15">
            <span>API.GATEWAY // ACTIVE</span>
            <span>99.9% UPTIME &bull; 2.4B+ REQUESTS</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(139,92,246,0.05),transparent_60%)]" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/favicon.svg" alt="" width={20} height={20} className="rounded" />
              <span className="text-lg font-bold text-white tracking-tight">Hapuppy</span>
            </Link>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500/60">ONLINE</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
              <h1 className="text-2xl font-bold text-white tracking-tight">{t("loginTitle")}</h1>
            </div>
            <p className="text-gray-600 text-sm pl-3">{t("loginSubtitle")}</p>
          </div>

          {/* GitHub login */}
          <button
            onClick={handleGithubLogin}
            disabled={githubLoading}
            className="w-full flex items-center justify-center gap-2.5 h-11 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-violet-500/30 transition-all text-sm font-medium text-gray-300 cursor-pointer disabled:opacity-50 group mb-6 hover:shadow-[0_0_20px_rgba(139,92,246,0.06)]"
          >
            <GithubIcon />
            <span className="group-hover:text-white transition-colors">
              {githubLoading ? tc("redirecting") : t("continueGithub")}
            </span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-mono">
              <span className="px-4 bg-[#050505] text-gray-700">{tc("or")}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-medium text-gray-600 uppercase tracking-[0.15em]">{tc("email")}</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-violet-400 transition-colors duration-300" />
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  required
                  autoComplete="email"
                  className="w-full h-11 pl-10 pr-4 bg-white/[0.02] border border-white/[0.06] rounded-lg text-white placeholder:text-gray-800 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.04] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08),0_0_20px_rgba(139,92,246,0.06)] transition-all duration-300 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono font-medium text-gray-600 uppercase tracking-[0.15em]">{tc("password")}</label>
                <Link href="/forgot-password" className="text-[10px] text-violet-500/70 hover:text-violet-400 transition-colors font-mono tracking-wider">{t("forgotPassword")}</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-violet-400 transition-colors duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  required
                  autoComplete="current-password"
                  className="w-full h-11 pl-10 pr-11 bg-white/[0.02] border border-white/[0.06] rounded-lg text-white placeholder:text-gray-800 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.04] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08),0_0_20px_rgba(139,92,246,0.06)] transition-all duration-300 text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-500 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 rounded-lg bg-red-500/[0.06] border border-red-500/10 text-red-400 text-xs font-mono">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    {tc("signIn")}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">{t("signUp")}</Link>
          </p>

          {/* Bottom security bar */}
          <div className="mt-10 pt-4 border-t border-white/[0.03]">
            <div className="flex items-center justify-center gap-6 text-[9px] font-mono text-white/15 uppercase tracking-widest">
              <span>256-BIT SSL</span>
              <span className="text-violet-500/30">&bull;</span>
              <span>SOC 2</span>
              <span className="text-violet-500/30">&bull;</span>
              <span>GDPR</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
