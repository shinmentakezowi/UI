"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, Loader2, Check, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex bg-[#050505] selection:bg-emerald-500/30 selection:text-white">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#000000]">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-blue-600/10" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-white/10 rounded-tl-3xl" />
          <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-white/10 rounded-br-3xl" />
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
          <div className="absolute inset-0 lg:hidden bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_40%)]" />
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px] relative z-10 text-center">
            <div className="lg:hidden mb-6 flex items-center">
              <Link href="/" className="flex items-center gap-2.5">
                <img src="/favicon.svg" alt="" width={20} height={20} className="rounded" />
                <span className="text-lg font-bold text-white">Hapuppy</span>
              </Link>
            </div>
            <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/10">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-base font-semibold text-zinc-100 mb-2">{t("checkEmail")}</h2>
              <p className="text-sm text-zinc-500 mb-6 leading-relaxed">{t("resetSent")} <span className="text-zinc-300">{email}</span>.<br />{t("clickToReset")}</p>
              <Link href="/login"><button className="w-full h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-sm font-medium transition-colors cursor-pointer">{t("backToSignIn")}</button></Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
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
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Secure account recovery.</h2>
            <p className="text-gray-400 text-base mb-5 font-light">We will send you a secure link to reset your password. Your data stays protected.</p>
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

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px] relative z-10">
          <div className="lg:hidden mb-6 flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/favicon.svg" alt="" width={20} height={20} className="rounded" />
              <span className="text-lg font-bold text-white">Hapuppy</span>
            </Link>
          </div>

          <div className="mb-6 p-6 rounded-2xl bg-[#0A0A0A] border border-white/10">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">{t("forgotTitle")}</h1>
            <p className="text-gray-400 text-sm">{t("forgotSubtitle")}</p>

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-gray-400 uppercase">{tc("email")}</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailPlaceholder")} required autoComplete="email" className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all text-sm" />
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-bold rounded-lg hover:from-violet-600 hover:to-fuchsia-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] text-sm cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("sendResetLink")}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500">{t("rememberPassword")} <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">{tc("signIn")}</Link></p>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-700 font-mono">SECURE API GATEWAY &bull; 256-BIT ENCRYPTION &bull; SOC 2 COMPLIANT</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
