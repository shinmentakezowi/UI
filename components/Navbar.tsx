"use client";

import { useEffect, useState, useTransition } from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [ready, setReady] = useState(false);
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setReady(true);
    });
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="w-full max-w-3xl flex items-center justify-between px-5 h-12 rounded-xl border border-white/[0.10] bg-zinc-900/50 backdrop-blur-lg shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/favicon.svg" alt="" width={22} height={22} className="rounded" />
          <span className="text-sm font-semibold text-zinc-100">Hapuppy</span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-0.5 text-xs text-zinc-400">
          {[["#models", t("models")],["#pricing", t("pricing")],["#faq", t("faq")],["https://docs.hapuppy.com", t("docs")]].map(([href,label])=>(
            <a key={href} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="px-3 py-1.5 rounded-lg hover:bg-white/[0.10] hover:text-zinc-100 transition-colors cursor-pointer">
              {label}
            </a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] p-0.5">
            <div
              className={`absolute top-0.5 h-[22px] w-[34px] rounded-[6px] bg-white/[0.12] border border-white/[0.10] transition-transform duration-200 ${locale === 'en' ? 'translate-x-[35px]' : 'translate-x-0.5'}`}
            />
            {(['zh', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => startTransition(() => router.replace(pathname, { locale: l }))}
                className={`relative z-10 w-[34px] h-6 text-[11px] font-medium tracking-wide rounded-[5px] transition-colors duration-200 cursor-pointer ${locale === l ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          {!ready ? (
            <div className="w-20 h-7 rounded-lg bg-white/[0.04] animate-pulse" />
          ) : user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.15] bg-white/[0.08] hover:bg-white/[0.13] text-zinc-100 text-xs font-medium transition-colors"
            >
              <LayoutDashboard className="w-3 h-3" />
              {tc("dashboard")}
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block text-xs text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-1.5">
                {tc("signIn")}
              </Link>
              <Link href="/login" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/[0.18] bg-white/[0.07] hover:bg-white/[0.12] text-zinc-100 text-xs font-medium transition-colors">
                {tc("getApiKey")}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
