"use client";

import { useEffect, useState, useTransition } from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  LayoutDashboard,
  Menu,
  X,
  Globe,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/models", label: t("models"), isRoute: true },
    { href: "/pricing", label: t("pricing"), isRoute: true },
    { href: "/#faq", label: t("faq"), isRoute: false },
    { href: "https://docs.hapuppy.com", label: t("docs"), isRoute: false, external: true },
  ];

  return (
    <>
      {/* Desktop + Mobile Navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
      >
        <nav
          className={`relative w-full max-w-5xl h-14 flex items-center justify-between px-2 sm:px-5 rounded-2xl transition-all duration-500 ${
            scrolled
              ? "bg-[#0A0A0A]/90 backdrop-blur-xl border border-violet-500/15 shadow-2xl shadow-black/60 ring-1 ring-white/5"
              : "bg-zinc-900/40 backdrop-blur-lg border border-white/[0.08] shadow-[0_2px_20px_rgba(0,0,0,0.3)]"
          }`}
        >
          {/* Corner Brackets */}
          <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-violet-500/20 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-violet-500/20 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-violet-500/20 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-violet-500/20 rounded-br-sm pointer-events-none" />
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image src="/favicon.svg" alt="" width={22} height={22} className="rounded" />
              <span className="text-sm font-bold tracking-tight text-zinc-100 hidden sm:block">
                Hapuppy
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div
              className="hidden md:flex items-center gap-0.5 ml-2"
              onMouseLeave={() => setHoveredPath(null)}
            >
              {navLinks.map((item) => {
                const linkContent = (
                  <span className="relative px-3.5 py-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-100 transition-colors rounded-xl z-10">
                    {hoveredPath === item.href && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white/[0.08] border border-white/[0.06] rounded-xl -z-10"
                        transition={{
                          type: "spring",
                          bounce: 0.15,
                          duration: 0.5,
                        }}
                      />
                    )}
                    {item.label}
                  </span>
                );

                if (item.external) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setHoveredPath(item.href)}
                      className="relative"
                    >
                      {linkContent}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href as string}
                    onMouseEnter={() => setHoveredPath(item.href)}
                    className="relative"
                  >
                    {linkContent}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Locale + Auth */}
          <div className="flex items-center gap-2">
            {/* Locale Switcher */}
            <div className="relative hidden sm:flex items-center h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] p-0.5">
              <motion.div
                className="absolute top-0.5 h-[22px] w-[34px] rounded-[6px] bg-white/[0.10] border border-white/[0.10]"
                animate={{
                  x: locale === "en" ? 35 : 2,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              {(["zh", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() =>
                    startTransition(() => router.replace(pathname, { locale: l }))
                  }
                  className={`relative z-10 w-[34px] h-6 text-[11px] font-semibold tracking-wide rounded-[5px] transition-colors duration-200 cursor-pointer ${
                    locale === l
                      ? "text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Auth */}
            {!ready ? (
              <div className="w-20 h-8 rounded-lg bg-white/[0.04] animate-pulse" />
            ) : user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-violet-500/5 border border-violet-500/20 hover:bg-violet-500/10 hover:border-violet-500/40 transition-all group"
              >
                <div className="relative w-7 h-7 rounded-full flex items-center justify-center overflow-hidden border border-violet-500/30 group-hover:border-violet-400 transition-colors">
                  <div className="absolute inset-0 bg-violet-500/20" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/50 to-fuchsia-600/50 mix-blend-overlay" />
                  <span className="relative z-10 text-[10px] font-bold text-violet-300">
                    {user.email ? user.email[0].toUpperCase() : "U"}
                  </span>
                </div>
                <span className="text-xs font-medium text-zinc-300 max-w-[80px] truncate hidden sm:block group-hover:text-violet-300 transition-colors">
                  {tc("dashboard")}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-500 hidden sm:block" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:block text-[13px] font-medium text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-2"
                >
                  {tc("signIn")}
                </Link>
                <Link
                  href="/login"
                  className="relative inline-flex items-center gap-1.5 h-8 px-4 rounded-lg text-[13px] font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/25 hover:bg-violet-500/20 hover:border-violet-500/50 shadow-[0_0_12px_rgba(139,92,246,0.08)] hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] transition-all duration-300 overflow-hidden group"
                >
                  <span className="relative z-10">{tc("getApiKey")}</span>
                  <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </nav>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 bottom-0 left-0 w-[80%] max-w-[300px] bg-[#0A0A0A]/95 backdrop-blur-2xl border-r border-violet-500/10 z-[70] md:hidden shadow-2xl flex flex-col"
            >
              {/* Sidebar Corner Brackets */}
              <div className="absolute top-4 left-4 w-5 h-5 border-l-2 border-t-2 border-violet-500/20 rounded-tl pointer-events-none" />
              <div className="absolute top-4 right-4 w-5 h-5 border-r-2 border-t-2 border-violet-500/20 rounded-tr pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-5 h-5 border-l-2 border-b-2 border-violet-500/20 rounded-bl pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-r-2 border-b-2 border-violet-500/20 rounded-br pointer-events-none" />

              {/* Decorative line */}
              <div className="absolute top-1/3 left-0 w-[2px] h-20 bg-gradient-to-b from-transparent via-violet-500/30 to-transparent pointer-events-none" />
              {/* Sidebar Header */}
              <div className="p-5 flex items-center justify-between border-b border-white/5">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <Image src="/favicon.svg" alt="" width={22} height={22} className="rounded" />
                  <span className="text-sm font-bold text-zinc-100">
                    Hapuppy
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex-1 py-6 px-4 space-y-1">
                {navLinks.map((item, i) => {
                  const content = (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-300 hover:text-violet-300 hover:bg-violet-500/10 rounded-xl transition-colors border border-transparent hover:border-violet-500/20"
                    >
                      <Globe className="w-4 h-4 text-zinc-500" />
                      {item.label}
                      {item.external && (
                        <ArrowRight className="w-3.5 h-3.5 ml-auto text-zinc-600" />
                      )}
                    </motion.div>
                  );

                  if (item.external) {
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileOpen(false)}
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href as string}
                      onClick={() => setMobileOpen(false)}
                    >
                      {content}
                    </Link>
                  );
                })}

                {/* Locale in mobile */}
                <div className="pt-4 mt-4 border-t border-white/5">
                  <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-2">
                    Language
                  </p>
                  <div className="flex gap-2 px-4">
                    {(["zh", "en"] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          startTransition(() =>
                            router.replace(pathname, { locale: l })
                          );
                          setMobileOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          locale === l
                            ? "bg-violet-500/15 border-violet-500/30 text-violet-300"
                            : "bg-white/5 border-white/10 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-5 border-t border-violet-500/10 bg-violet-500/[0.02]">
                {!ready ? (
                  <div className="h-10 rounded-xl bg-white/[0.04] animate-pulse" />
                ) : user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-500/5 border border-violet-500/20 text-sm font-medium text-zinc-200 hover:bg-violet-500/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-violet-500/20 border border-violet-500/30">
                      <span className="text-xs font-bold text-violet-300">
                        {user.email ? user.email[0].toUpperCase() : "U"}
                      </span>
                    </div>
                    <LayoutDashboard className="w-4 h-4 text-violet-400" />
                    {tc("dashboard")}
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:border-white/20 transition-colors"
                    >
                      {tc("signIn")}
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/25 text-sm font-medium text-violet-300 hover:bg-violet-500/20 hover:border-violet-500/50 transition-all"
                    >
                      {tc("getApiKey")}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
