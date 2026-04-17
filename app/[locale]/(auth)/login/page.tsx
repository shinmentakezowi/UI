"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";

const LOGO = "/favicon.svg";

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[360px]">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src={LOGO}
            alt="Hapuppy"
            width={48}
            height={48}
            className="rounded-xl mb-4"
            unoptimized
          />
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
            {t("loginTitle")}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {t("loginSubtitle")}
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
          <form onSubmit={handleLogin} className="space-y-3">
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-400">{tc("password")}</label>
                <Link href="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  {t("forgotPassword")}
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? t("signingIn") : tc("signIn")}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-zinc-600 mt-5">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-zinc-300 hover:text-white transition-colors">
            {t("signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}
