"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setChecking(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(t("passwordMinError"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (checking) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[360px] text-center">
          <div className="bg-[#111111] border border-zinc-800/80 rounded-2xl p-8">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-zinc-100 mb-2">{t("passwordUpdated")}</h2>
            <p className="text-sm text-zinc-500 mb-6">
              {t("passwordResetSuccess")}
            </p>
            <Link href="/dashboard">
              <button className="w-full h-10 rounded-lg bg-white hover:bg-zinc-100 text-black text-sm font-semibold transition-colors cursor-pointer">
                {t("goToDashboard")}
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
            {t("resetTitle")}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {t("resetSubtitle")}
          </p>
        </div>

        <div className="bg-[#111111] border border-zinc-800/80 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">{t("newPassword")}</label>
              <Input
                type="password"
                placeholder={t("minChars")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-10 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-0"
              />
              <p className="text-[10px] text-zinc-600">{t("passwordMinLength")}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">{t("confirmPassword")}</label>
              <Input
                type="password"
                placeholder={t("confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="h-10 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-0"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[10px] text-red-400">{t("passwordMismatch")}</p>
              )}
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-400/8 border border-red-400/15 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword || password !== confirmPassword}
              className="w-full h-10 rounded-lg bg-white hover:bg-zinc-100 text-black text-sm font-semibold transition-colors duration-150 cursor-pointer disabled:opacity-50"
            >
              {loading ? t("updating") : t("resetPassword")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
