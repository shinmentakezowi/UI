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
} from "lucide-react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase", met: /[A-Z]/.test(password) },
  ];
  if (!password) return null;
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-1 space-y-0.5">
      {requirements.map((req, i) => (
        <div key={i} className="flex items-center gap-1.5 text-[10px]">
          {req.met ? <Check className="w-2.5 h-2.5 text-violet-400" /> : <X className="w-2.5 h-2.5 text-gray-500" />}
          <span className={req.met ? "text-violet-400" : "text-gray-500"}>{req.label}</span>
        </div>
      ))}
    </motion.div>
  );
}

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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center">
          <h1 className="text-base font-semibold text-zinc-100 mb-1">{t("verifyHuman")}</h1>
          <p className="text-sm text-zinc-500 mb-8">{t("completeCheck")}</p>
          <Turnstile siteKey={TURNSTILE_SITE_KEY} onSuccess={(token) => { setTurnstileToken(token); setVerified(true); }} onExpire={() => setTurnstileToken(null)} options={{ theme: "dark", size: "normal" }} />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[400px] text-center">
          <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/10">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-base font-semibold text-zinc-100 mb-2">{t("checkEmail")}</h2>
            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">{t("confirmationSent")} <span className="text-zinc-300">{email}</span>.<br />{t("clickToActivate")}</p>
            <Link href="/login"><button className="w-full h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-sm font-medium transition-colors cursor-pointer">{t("backToSignIn")}</button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#050505] selection:bg-emerald-500/30 selection:text-white">
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

          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
              Access 105+ AI models <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-violet-400">through one API.</span>
            </h2>
            <p className="text-gray-400 text-base mb-5 font-light">
              Join thousands of developers building with transparent, pay-per-token pricing.
            </p>
            <div className="space-y-2.5 font-mono text-sm">
              {["Instant API key generation", "Access to GPT-4, Claude, Gemini & more", "Real-time usage analytics", "Pay only for what you use"].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-4 h-4 rounded bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-200 transition-colors text-xs">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm w-fit">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-gradient-to-br from-violet-700 to-blue-900" />
              ))}
            </div>
            <p className="text-gray-400 text-[10px] font-mono"><span className="text-white font-bold">10,000+</span> DEVELOPERS BUILDING</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 lg:hidden bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_40%)]" />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px] relative z-10">
          <div className="lg:hidden mb-6 flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/favicon.svg" alt="" width={20} height={20} className="rounded" />
              <span className="text-lg font-bold text-white">Hapuppy</span>
            </Link>
          </div>

          <div className="mb-6 p-6 rounded-2xl bg-[#0A0A0A] border border-white/10">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">{t("registerTitle")}</h1>
            <p className="text-gray-400 text-sm">{t("registerSubtitle")}</p>

            <button
              onClick={handleGithubLogin}
              disabled={githubLoading}
              className="w-full flex items-center justify-center gap-2.5 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-medium text-gray-300 mt-5 mb-5 cursor-pointer disabled:opacity-50"
            >
              <GithubIcon />
              {githubLoading ? tc("redirecting") : t("continueGithub")}
            </button>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-mono">
                <span className="px-4 bg-[#0A0A0A] text-gray-600">{tc("or")}</span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-gray-400 uppercase">{tc("username")}</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                  <input ref={nameRef} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t("usernamePlaceholder")} required maxLength={20} autoComplete="name" className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-gray-400 uppercase">{tc("email")}</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailPlaceholder")} required autoComplete="email" className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-gray-400 uppercase">{tc("password")}</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("createPassword")} required minLength={8} autoComplete="new-password" className="w-full h-10 pl-10 pr-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all text-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-gray-400 uppercase">{t("confirmPassword")}</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("confirmPasswordPlaceholder")} required minLength={8} autoComplete="new-password" className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all text-sm" />
                </div>
                {confirmPassword && password !== confirmPassword && <p className="text-[10px] text-red-400">{t("passwordMismatch")}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-gray-400 uppercase">{t("inviteCode")}</label>
                <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder={t("inviteCodePlaceholder")} className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all text-sm" />
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                <span className="text-xs text-gray-500">{t("agreeToTerms")} <Link href="/terms" target="_blank" className="text-violet-400 hover:text-violet-300 transition-colors">{t("termsOfService")}</Link> {t("and")} <Link href="/privacy" target="_blank" className="text-violet-400 hover:text-violet-300 transition-colors">{t("privacyPolicy")}</Link></span>
              </label>

              {error && error !== "EMAIL_EXISTS" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                </motion.div>
              )}
              {error === "EMAIL_EXISTS" && (
                <p className="text-xs text-red-400 bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2">{t("emailRegistered")} <Link href="/login" className="underline text-red-300 hover:text-red-200">{t("signInInstead")}</Link></p>
              )}

              <button
                type="submit"
                disabled={loading || !agreed || (confirmPassword !== "" && password !== confirmPassword)}
                className="w-full h-10 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-bold rounded-lg hover:from-violet-600 hover:to-fuchsia-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] text-sm cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("createAccount")}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500">{t("hasAccount")} <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">{tc("signIn")}</Link></p>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-700 font-mono">SECURE API GATEWAY &bull; 256-BIT ENCRYPTION &bull; SOC 2 COMPLIANT</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function RegisterPageFallback() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px] flex flex-col items-center gap-4">
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
