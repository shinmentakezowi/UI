"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

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

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[360px] text-center">
          <div className="bg-[#111111] border border-zinc-800/80 rounded-2xl p-8">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-zinc-100 mb-2">{t("checkEmail")}</h2>
            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
              {t("resetSent")}{" "}
              <span className="text-zinc-300">{email}</span>.
              <br />{t("clickToReset")}
            </p>
            <Link href="/login">
              <button className="w-full h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm font-medium transition-colors cursor-pointer">
                {t("backToSignIn")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[360px]">
        <div className="flex flex-col items-center mb-8">
          <img src="/favicon.svg" alt="Hapuppy" width={48} height={48} className="rounded-xl mb-4" />
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
            {t("forgotTitle")}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {t("forgotSubtitle")}
          </p>
        </div>

        <div className="bg-[#111111] border border-zinc-800/80 rounded-2xl p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">{tc("email")}</label>
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-0"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-400/8 border border-red-400/15 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg bg-white hover:bg-zinc-100 text-black text-sm font-semibold transition-colors duration-150 cursor-pointer disabled:opacity-50"
            >
              {loading ? t("sending") : t("sendResetLink")}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-600 mt-5">
          {t("rememberPassword")}{" "}
          <Link href="/login" className="text-zinc-300 hover:text-white transition-colors">
            {tc("signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
