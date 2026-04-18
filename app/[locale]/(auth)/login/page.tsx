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
  ArrowRight,
} from "lucide-react";
import {
  AnthropicIcon,
  OpenAIIcon,
  MoonshotIcon,
  GoogleIcon as GeminiIcon,
} from "@/components/icons/providers";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const providerLogos = [
  { Icon: OpenAIIcon, label: "OpenAI" },
  { Icon: AnthropicIcon, label: "Claude" },
  { Icon: MoonshotIcon, label: "Kimi" },
  { Icon: GeminiIcon, label: "Gemini" },
];

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
      {/* Left Panel - Hero-style Brand */}
      <div className="hidden lg:flex lg:w-[52%] relative bg-[#020202]">
        {/* Hero radial gradient */}
        <div className="absolute inset-0 bg-hero-radial" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_40%,transparent_100%)]" />

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
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#22c55e] animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500/60">ONLINE</span>
            </div>
          </div>

          {/* Center content - Hero-style headline */}
          <div className="max-w-lg">
            <div className="space-y-2 mb-6">
              <h2 className="text-4xl xl:text-5xl font-bold tracking-tighter leading-[0.9] text-white">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="inline-block"
                >
                  Welcome back,
                </motion.span>
                <br />
                <span className="glitch-wrapper inline-block">
                  <span className="glitch relative inline-block text-white text-4xl xl:text-5xl font-black" data-text="developer.">
                    developer.
                  </span>
                </span>
              </h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-lg text-zinc-400 max-w-md font-light leading-relaxed mb-10"
            >
              Access <span className="text-white font-medium">105+ AI models</span> through
              a single, unified API with transparent pricing.
            </motion.p>

            {/* Powered by */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="pt-6 border-t border-white/5 flex items-center gap-5"
            >
              <span className="uppercase tracking-widest text-[10px] font-mono text-zinc-600 flex-shrink-0">POWERED BY</span>
              <div className="flex items-center gap-4">
                {providerLogos.map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 opacity-50 hover:opacity-80 transition-opacity">
                    <Icon size={16} />
                    <span className="text-[10px] font-mono text-zinc-500 hidden xl:inline">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <div className="flex justify-between items-end text-[10px] font-mono text-white/15">
            <span>API.GATEWAY // ACTIVE</span>
            <span>99.9% UPTIME</span>
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

          {/* Login card */}
          <div className="p-6 rounded-2xl bg-[#0A0A0A]/80 border border-white/[0.08] backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
                <h1 className="text-xl font-bold text-white tracking-tight">{t("loginTitle")}</h1>
              </div>
              <p className="text-zinc-600 text-xs pl-[18px]">{t("loginSubtitle")}</p>
            </div>

            {/* GitHub login */}
            <button
              onClick={handleGithubLogin}
              disabled={githubLoading}
              className="w-full flex items-center justify-center gap-2.5 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-violet-500/30 transition-all text-sm font-medium text-gray-300 cursor-pointer disabled:opacity-50 group mb-5 hover:shadow-[0_0_20px_rgba(139,92,246,0.06)]"
            >
              <GithubIcon />
              <span className="group-hover:text-white transition-colors">
                {githubLoading ? tc("redirecting") : t("continueGithub")}
              </span>
            </button>

            {/* Divider */}
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-mono">
                <span className="px-4 bg-[#0A0A0A] text-gray-700">{tc("or")}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-medium text-gray-600 uppercase tracking-[0.15em]">{tc("email")}</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700 group-focus-within:text-violet-400 transition-colors duration-300" />
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    required
                    autoComplete="email"
                    className="w-full h-10 pl-9 pr-4 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder:text-gray-800 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.06),0_0_20px_rgba(139,92,246,0.04)] transition-all duration-300 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono font-medium text-gray-600 uppercase tracking-[0.15em]">{tc("password")}</label>
                  <Link href="/forgot-password" className="text-[10px] text-violet-500/70 hover:text-violet-400 transition-colors font-mono tracking-wider">{t("forgotPassword")}</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700 group-focus-within:text-violet-400 transition-colors duration-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    required
                    autoComplete="current-password"
                    className="w-full h-10 pl-9 pr-10 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder:text-gray-800 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.06),0_0_20px_rgba(139,92,246,0.04)] transition-all duration-300 text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-500 transition-colors">
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/[0.06] border border-red-500/10 text-red-400 text-xs font-mono">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.98] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] group relative overflow-hidden"
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
          </div>

          {/* Sign up link */}
          <p className="text-center text-xs text-gray-600 mt-5">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">{t("signUp")}</Link>
          </p>

          {/* Bottom security bar */}
          <div className="mt-8 pt-3 border-t border-white/[0.03]">
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
