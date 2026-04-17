import { Link } from "@/i18n/routing";
import { PricingCard } from "@/components/PricingCard";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ArrowRight, Check, X, CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function PricingPage() {
  const t = await getTranslations("pricingPage");
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");
  const tl = await getTranslations("landingPricing");

  const FAQS = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
    { q: t("faq5Q"), a: t("faq5A") },
    { q: t("faq6Q"), a: t("faq6A") },
    { q: t("faq7Q"), a: t("faq7A") },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 overflow-x-hidden">

      {/* ── Navbar (floating card, same as landing) ── */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-3xl flex items-center justify-between px-4 h-12 rounded-xl border border-white/[0.08] bg-[#111111]/90 backdrop-blur-xl shadow-xl shadow-black/40">
          <Link href="/" className="flex items-center">
            <span className="text-sm font-semibold text-zinc-100">Hapuppy</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-400">
            {[["/#models","Models"],["/#faq","FAQ"]].map(([href,label])=>(
              <Link key={href} href={href as string} className="px-3 py-1.5 rounded-lg hover:bg-white/[0.05] hover:text-zinc-100 transition-colors">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block text-xs text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-1.5">
              {tc("signIn")}
            </Link>
            <Link href="/login" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-100 text-xs font-medium transition-colors">
              {tc("getApiKey")}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section className="pt-40 sm:pt-52 pb-20 sm:pb-28 text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4 max-w-2xl mx-auto">
          {t("heroTitle1")}{" "}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            {t("heroTitle2")}
          </span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 max-w-md mx-auto leading-relaxed">
          {t("heroSubtitle")}
        </p>
      </section>

      {/* ── Pricing card ── */}
      <section className="pb-12 sm:pb-16 px-4 flex justify-center max-w-6xl mx-auto">
        <PricingCard />
      </section>

      {/* ── Trust badges ── */}
      <div className="pb-20 sm:pb-28 flex flex-wrap justify-center gap-3 px-4">
        {[tl("trustBadge1"), tl("trustBadge2"), tl("trustBadge3")].map((label) => (
          <div key={label} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-zinc-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {label}
          </div>
        ))}
      </div>

      {/* ── Comparison ── */}
      <section className="py-20 sm:py-28 px-4 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            {t("whyTitle")}
          </h2>
          <p className="text-sm text-zinc-500 text-center mb-10">
            {t("whySubtitle")}
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {/* Direct API */}
            <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/[0.03]">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3 font-medium">Direct API Access</p>
              <p className="text-2xl font-bold text-red-400 mb-1">{t("directPrice")}</p>
              <p className="text-xs text-zinc-600 mb-4">{t("directPriceDesc")}</p>
              <ul className="space-y-2">
                {[t("directFeature1"),t("directFeature2"),t("directFeature3"),t("directFeature4")].map(f=>(
                  <li key={f} className="flex items-center gap-2 text-xs text-zinc-500">
                    <X className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hapuppy */}
            <div className="relative p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-[10px] font-bold text-black uppercase tracking-wider">RECOMMENDED</span>
              </div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3 font-medium">Hapuppy</p>
              <p className="text-2xl font-bold text-emerald-400 mb-1">From $9.99</p>
              <p className="text-xs text-zinc-600 mb-4">/month flat rate</p>
              <ul className="space-y-2">
                {[t("hapuppyFeature1"),t("hapuppyFeature2"),t("hapuppyFeature3"),t("hapuppyFeature4")].map(f=>(
                  <li key={f} className="flex items-center gap-2 text-xs text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 sm:py-28 px-4 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10">{t("faqTitle")}</h2>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
            {FAQS.map(f => (
              <div key={f.q}>
                <h3 className="text-sm font-semibold text-zinc-100 mb-2">{f.q}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] pt-12 pb-0 overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-xs text-zinc-600">
          <div className="flex items-center">
            <span className="font-medium text-zinc-500">Hapuppy</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-zinc-400 transition-colors">{tc("home")}</Link>
            <Link href="/login" className="hover:text-zinc-400 transition-colors">{tf("signIn")}</Link>
            <Link href="/register" className="hover:text-zinc-400 transition-colors">{tf("register")}</Link>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">{tf("privacy")}</Link>
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">{tf("terms")}</Link>
            <a href="mailto:support@hapuppy.com" className="hover:text-zinc-400 transition-colors">{tf("email")}</a>
            <a href="https://discord.gg/YWayJmZKCu" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">{tf("discord")}</a>
          </div>
          <span>&copy; {new Date().getFullYear()} Hapuppy</span>
        </div>

        {/* Big brand text */}
        <div className="relative text-center select-none overflow-hidden h-28 sm:h-40">
          <div
            className="absolute inset-x-0 bottom-0 text-[80px] sm:text-[120px] md:text-[160px] font-black leading-none tracking-tighter text-transparent pointer-events-none"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.04)",
              background: "linear-gradient(to bottom, rgba(124,58,237,0.15), transparent)",
              WebkitBackgroundClip: "text",
            }}
          >
            hapuppy
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
