"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import { Turnstile } from "@marsidev/react-turnstile";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Loader2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Zap,
  Shield,
  Globe,
  Sparkles,
} from "lucide-react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase", met: /[A-Z]/.test(password) },
  ];
  const metCount = requirements.filter((r) => r.met).length;
  if (!password) return null;
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {requirements.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < metCount
                ? metCount === 3
                  ? "bg-emerald-500"
                  : metCount === 2
                  ? "bg-amber-500"
                  : "bg-red-500"
                : "bg-white/[0.06]"
            }`}
          />
        ))}
      </div>
      <div className="space-y-0.5">
        {requirements.map((req, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px]">
            {req.met ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <X className="w-2.5 h-2.5 text-gray-600" />}
            <span className={req.met ? "text-emerald-400/80" : "text-gray-600"}>{req.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const features = [
  { icon: Zap, title: "Instant API Keys", desc: "Generate keys in seconds" },
  { icon: Sparkles, title: "105+ AI Models", desc: "GPT-4, Claude, Gemini & more" },
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 & GDPR compliant" },
  { icon: Globe, title: "Global Edge", desc: "Low-latency worldwide" },
];

function RegisterPageContent() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();
  const inviteCodeFromUrl = searchParams.get("invite") || "";

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState(inviteCodeFromUrl);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [verified, setVerified] = useState(!TURNSTILE_SITE_KEY);
  const [showPassword, setShowPassword] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  async function handleGithubLogin() {
    setGithubLoading(true);
    const supabase = createClient();
    const callbackUrl = new URL(`${window.location.origin}/auth/callback`);
    if (inviteCode.trim()) callbackUrl.searchParams.set("invite", inviteCode.trim());
    await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo: callbackUrl.toString() } });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password.length < 8) { setError(t("passwordMinError")); setLoading(false); return; }
    if (password !== confirmPassword) { setError(t("passwordMismatch")); setLoading(false); return; }
    if (!agreed) { setError(t("agreeRequired")); setLoading(false); return; }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username, turnstileToken, inviteCode: inviteCode.trim() || undefined }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || t("registrationFailed")); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  }

  if (!verified && TURNSTILE_SITE_KEY) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-violet-400" />
          </div>
          <h1 className="text-base font-semibold text-zinc-100 mb-1">{t("verifyHuman")}</h1>
          <p className="text-sm text-zinc-500 mb-8">{t("completeCheck")}</p>
          <Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={(token) => { setTurnstileToken(token); setVerified(true); }} onExpire={() => setTurnstileToken(null)} options={{ theme: "dark", size: "normal" }} />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[420px] text-center"
        >
          <div className="p-8 rounded-2xl bg-[#0A0A0A]/80 border border-white/[0.08] backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.5)]">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-zinc-100 mb-2">{t("checkEmail")}</h2>
            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">{t("confirmationSent")} <span className="text-zinc-300 font-medium">{email}</span>.<br />{t("clickToActivate")}</p>
            <Link href="/login"><button className="w-full h-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-sm font-medium transition-all cursor-pointer">{t("backToSignIn")}</button></Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#030303] selection:bg-violet-500/30 selection:text-white">
      {/* Left Panel - Brand Experience */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#000000]">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-transparent to-blue-600/10" />
        <div className="absolute inset-0 bg-gradient-to-tl from-fuchsia-600/8 via-transparent to-transparent" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_60%,transparent_100%)]" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-600/10 blur-[100px] animate-orb-drift" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-blue-600/10 blur-[80px] animate-orb-drift-slow" />
        <div className="absolute top-2/3 left-1/3 w-32 h-32 rounded-full bg-fuchsia-600/8 blur-[60px] animate-orb-drift-reverse" />

        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-white/[0.06] rounded-tl-3xl" />
        <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-white/[0.06] rounded-br-3xl" />
        <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-violet-500/40" />
        <div className="absolute bottom-8 left-8 w-3 h-3 rounded-full bg-blue-500/40" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/favicon.svg" alt="" width={24} height={24} className="rounded" />
            <span className="text-xl font-bold tracking-tighter text-white">Hapuppy</span>
          </Link>

          {/* Center content */}
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-[28px] xl:text-[32px] font-bold text-white mb-3 tracking-tight leading-[1.2]">
                Start building with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                  every AI model
                </span>
                {" "}in minutes.
              </h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-md">
                Join thousands of developers using transparent, pay-per-token pricing with one unified API.
              </p>
            </motion.div>

            {/* Feature grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="grid grid-cols-2 gap-3"
            >
              {features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/15 transition-colors">
                    <feat.icon className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold mb-0.5">{feat.title}</p>
                    <p className="text-gray-600 text-[10px] font-mono">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4 mt-8 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit"
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-black bg-gradient-to-br from-violet-700 to-blue-900" />
                ))}
              </div>
              <p className="text-gray-500 text-[10px] font-mono"><span className="text-white font-bold">10,000+</span> DEVELOPERS BUILDING</p>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end text-[10px] font-mono text-gray-700">
            <span>EST. 2026</span>
            <span>ENTERPRISE-GRADE INFRASTRUCTURE</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
        {/* Background accents */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(139,92,246,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(59,130,246,0.04),transparent_50%)]" />

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-[420px] relative z-10 my-auto">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/favicon.svg" alt="" width={22} height={22} className="rounded" />
              <span className="text-lg font-bold text-white">Hapuppy</span>
            </Link>
          </div>

          {/* Main card */}
          <div className="mb-6 p-7 rounded-2xl bg-[#0A0A0A]/80 border border-white/[0.08] backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.5)]">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">{t("registerTitle")}</h1>
              <p className="text-gray-500 text-sm">{t("registerSubtitle")}</p>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={handleGithubLogin}
                disabled={githubLoading}
                className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all text-xs font-medium text-gray-300 cursor-pointer disabled:opacity-50 group"
              >
                <GithubIcon />
                <span className="group-hover:text-white transition-colors">{githubLoading ? tc("redirecting") : "GitHub"}</span>
              </button>
              <button
                disabled
                className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-gray-500 cursor-not-allowed opacity-50"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-mono">
                <span className="px-4 bg-[#0A0A0A] text-gray-600">{tc("or")}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-gray-500 uppercase tracking-wider">{tc("username")}</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
                  <input ref={nameRef} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t("usernamePlaceholder")} required maxLength={20} autoComplete="name" className="w-full h-11 pl-10 pr-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-gray-700 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-gray-500 uppercase tracking-wider">{tc("email")}</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailPlaceholder")} required autoComplete="email" className="w-full h-11 pl-10 pr-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-gray-700 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-gray-500 uppercase tracking-wider">{tc("password")}</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("createPassword")} required minLength={8} autoComplete="new-password" className="w-full h-11 pl-10 pr-11 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-gray-700 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all text-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-gray-500 uppercase tracking-wider">{t("confirmPassword")}</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-violet-400 transition-colors" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("confirmPasswordPlaceholder")} required minLength={8} autoComplete="new-password" className="w-full h-11 pl-10 pr-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-gray-700 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all text-sm" />
                </div>
                {confirmPassword && password !== confirmPassword && <p className="text-[10px] text-red-400 mt-1">{t("passwordMismatch")}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-gray-500 uppercase tracking-wider">{t("inviteCode")}</label>
                <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder={t("inviteCodePlaceholder")} className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-gray-700 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all text-sm" />
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.03] text-violet-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-violet-500" />
                <span className="text-xs text-gray-500 leading-relaxed">{t("agreeToTerms")} <Link href="/terms" target="_blank" className="text-violet-400 hover:text-violet-300 transition-colors">{t("termsOfService")}</Link> {t("and")} <Link href="/privacy" target="_blank" className="text-violet-400 hover:text-violet-300 transition-colors">{t("privacyPolicy")}</Link></span>
              </label>

              {error && error !== "EMAIL_EXISTS" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/[0.08] border border-red-500/15 text-red-400 text-sm font-mono">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                </motion.div>
              )}
              {error === "EMAIL_EXISTS" && (
                <p className="text-xs text-red-400 bg-red-500/[0.06] border border-red-500/15 rounded-xl px-3 py-2.5">{t("emailRegistered")} <Link href="/login" className="underline text-red-300 hover:text-red-200">{t("signInInstead")}</Link></p>
              )}

              <button
                type="submit"
                disabled={loading || !agreed || (confirmPassword !== "" && password !== confirmPassword)}
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(139,92,246,0.25),0_0_40px_rgba(139,92,246,0.1)] hover:shadow-[0_4px_30px_rgba(139,92,246,0.35),0_0_60px_rgba(139,92,246,0.15)] text-sm cursor-pointer active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("createAccount")}
              </button>
            </form>
          </div>

          {/* Sign in link */}
          <p className="text-center text-sm text-gray-500">{t("hasAccount")} <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-semibold">{tc("signIn")}</Link></p>

          {/* Footer badges */}
          <div className="mt-8 pt-5 border-t border-white/[0.04] flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-700 font-mono">
              <Shield className="w-3 h-3" />
              <span>256-BIT</span>
            </div>
            <div className="w-px h-3 bg-white/[0.06]" />
            <div className="flex items-center gap-1.5 text-[10px] text-gray-700 font-mono">
              <Lock className="w-3 h-3" />
              <span>SOC 2</span>
            </div>
            <div className="w-px h-3 bg-white/[0.06]" />
            <div className="flex items-center gap-1.5 text-[10px] text-gray-700 font-mono">
              <Globe className="w-3 h-3" />
              <span>GDPR</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function RegisterPageFallback() {
  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[420px] flex flex-col items-center gap-4">
        <img src="/favicon.svg" alt="Hapuppy" width={48} height={48} className="rounded-xl opacity-80" />
        <p className="text-sm text-zinc-500">Loading&hellip;</p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterPageFallback />}>
      <RegisterPageContent />
    </Suspense>
  );
}
