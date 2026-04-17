"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // used for GitHub OAuth only
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { Turnstile } from "@marsidev/react-turnstile";
import { useTranslations } from "next-intl";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
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
  const [verified, setVerified] = useState(!TURNSTILE_SITE_KEY); // skip if not configured

  async function handleGithubLogin() {
    setGithubLoading(true);
    const supabase = createClient();
    const callbackUrl = new URL(`${window.location.origin}/auth/callback`);
    if (inviteCode.trim()) callbackUrl.searchParams.set("invite", inviteCode.trim());
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: callbackUrl.toString() },
    });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError(t("passwordMinError"));
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      setLoading(false);
      return;
    }

    if (!agreed) {
      setError(t("agreeRequired"));
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username, turnstileToken, inviteCode: inviteCode.trim() || undefined }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || t("registrationFailed"));
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  // Full-screen Turnstile verification gate
  if (!verified && TURNSTILE_SITE_KEY) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center">
          <h1 className="text-base font-semibold text-zinc-100 mb-1">{t("verifyHuman")}</h1>
          <p className="text-sm text-zinc-500 mb-8">{t("completeCheck")}</p>
          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={(token) => {
              setTurnstileToken(token);
              setVerified(true);
            }}
            onExpire={() => setTurnstileToken(null)}
            options={{ theme: "dark", size: "normal" }}
          />
        </div>
      </div>
    );
  }

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
            <h2 className="text-base font-semibold text-zinc-100 mb-2">{t("checkEmail")}</h2>
            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
              {t("confirmationSent")}{" "}
              <span className="text-zinc-300">{email}</span>.
              <br />{t("clickToActivate")}
            </p>
            <Link href="/login">
              <Button variant="secondary" className="w-full h-10 text-sm">
                {t("backToSignIn")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[360px]">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/favicon.svg" alt="Hapuppy" width={48} height={48} className="rounded-xl mb-4" />
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
            {t("registerTitle")}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {t("registerSubtitle")}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-zinc-800/80 rounded-2xl p-6 space-y-4">

          {/* GitHub */}
          <button
            onClick={handleGithubLogin}
            disabled={githubLoading}
            className="w-full flex items-center justify-center gap-2.5 h-10 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-sm font-medium text-zinc-200 transition-colors duration-150 cursor-pointer disabled:opacity-50"
          >
            <GithubIcon />
            {githubLoading ? tc("redirecting") : t("continueGithub")}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-600">{tc("or")}</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Email form */}
          <form onSubmit={handleRegister} className="space-y-3">
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

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">{t("username")}</label>
              <Input
                type="text"
                placeholder={t("usernamePlaceholder")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                maxLength={20}
                className="h-10 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-0"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">{tc("password")}</label>
              <Input
                type="password"
                placeholder={t("createPassword")}
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

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">{t("inviteCode")}</label>
              <Input
                type="text"
                placeholder={t("inviteCodePlaceholder")}
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="h-10 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-0"
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded border-zinc-600 bg-zinc-900 text-violet-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-zinc-500">
                {t("agreeToTerms")}{" "}
                <Link href="/terms" target="_blank" className="text-violet-400 hover:text-violet-300 transition-colors">
                  {t("termsOfService")}
                </Link>{" "}
                {t("and")}{" "}
                <Link href="/privacy" target="_blank" className="text-violet-400 hover:text-violet-300 transition-colors">
                  {t("privacyPolicy")}
                </Link>
              </span>
            </label>

            {error && error !== "EMAIL_EXISTS" && (
              <p className="text-xs text-red-400 bg-red-400/8 border border-red-400/15 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {error === "EMAIL_EXISTS" && (
              <p className="text-xs text-red-400 bg-red-400/8 border border-red-400/15 rounded-lg px-3 py-2">
                {t("emailRegistered")}{" "}
                <Link href="/login" className="underline text-red-300 hover:text-red-200">
                  {t("signInInstead")}
                </Link>
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !agreed || (confirmPassword !== "" && password !== confirmPassword)}
              className="w-full h-10 rounded-lg bg-white hover:bg-zinc-100 text-black text-sm font-semibold transition-colors duration-150 cursor-pointer disabled:opacity-50"
            >
              {loading ? t("creatingAccount") : t("createAccount")}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-zinc-600 mt-5">
          {t("hasAccount")}{" "}
          <Link href="/login" className="text-zinc-300 hover:text-white transition-colors">
            {tc("signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}

function RegisterPageFallback() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[360px] flex flex-col items-center gap-4">
        <img src="/favicon.svg" alt="Hapuppy" width={48} height={48} className="rounded-xl opacity-80" />
        <p className="text-sm text-zinc-500">Loading…</p>
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
