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
} from "lucide-react";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
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
    <div className="min-h-screen flex bg-[#050505] selection:bg-violet-500/30 selection:text-white">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#000000]">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-blue-600/10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-white/10 rounded-tl-3xl" />
        <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-white/10 rounded-br-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/favicon.svg" alt="" width={22} height={22} className="rounded" />
            <span className="text-xl font-bold tracking-tighter text-white">Hapuppy</span>
          </Link>

          <div className="max-w-lg">
            <blockquote className="text-2xl font-medium text-white leading-relaxed mb-5 tracking-tight">
              &quot;One API key for every AI model. Simple, transparent, and powerful.&quot;
            </blockquote>
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm w-fit">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-blue-500/30 border border-white/10" />
              <div>
                <p className="text-white font-bold text-sm">Alex Chen</p>
                <p className="text-gray-400 text-xs font-mono">AI Engineer @ StartupLabs</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end text-xs font-mono text-gray-600">
            <span>EST. 2026</span>
            <span>105+ MODELS &bull; 99.9% UPTIME</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 lg:hidden bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_40%)]" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px] relative z-10"
        >
          <div className="lg:hidden mb-6 flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/favicon.svg" alt="" width={20} height={20} className="rounded" />
              <span className="text-lg font-bold text-white">Hapuppy</span>
            </Link>
          </div>

          <div className="mb-6 p-6 rounded-2xl bg-[#0A0A0A] border border-white/10">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">{t("loginTitle")}</h1>
            <p className="text-gray-400 text-sm">{t("loginSubtitle")}</p>

            <button
              onClick={handleGithubLogin}
              disabled={githubLoading}
              className="w-full flex items-center justify-center gap-2.5 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-medium text-gray-300 mt-5 mb-5 cursor-pointer disabled:opacity-50"
            >
              <GithubIcon />
              {githubLoading ? tc("redirecting") : t("continueGithub")}
            </button>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-mono">
                <span className="px-4 bg-[#0A0A0A] text-gray-600">{tc("or")}</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-gray-400 uppercase">{tc("email")}</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    required
                    autoComplete="email"
                    className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-medium text-gray-400 uppercase">{tc("password")}</label>
                  <Link href="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-mono">{t("forgotPassword")}</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    required
                    autoComplete="current-password"
                    className="w-full h-10 pl-10 pr-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-bold rounded-lg hover:from-violet-600 hover:to-fuchsia-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] text-sm cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : tc("signIn")}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">{t("signUp")}</Link>
          </p>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-700 font-mono">SECURE API GATEWAY &bull; 256-BIT ENCRYPTION &bull; SOC 2 COMPLIANT</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
