import { Link } from "@/i18n/routing";
import { ArrowRight, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { FadeIn } from "@/components/FadeIn";
import { AnimatedStats } from "@/components/AnimatedStats";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FeaturedModels } from "@/components/landing/FeaturedModels";
import { WhyUs } from "@/components/landing/WhyUs";
import { QuickStart } from "@/components/landing/QuickStart";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";
import { MeshBackground } from "@/components/MeshBackground";
import { fetchModelsData, PROVIDER_ORDER, PROVIDER_DISPLAY } from "@/lib/models";
import { getTranslations } from "next-intl/server";

export default async function LandingPage() {
  const { models } = await fetchModelsData();
  const providerSet = new Set(models.map(m => m.provider));
  const providers = PROVIDER_ORDER
    .filter(p => providerSet.has(p) && p in PROVIDER_DISPLAY)
    .map(p => PROVIDER_DISPLAY[p]);

  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 overflow-x-hidden">
      <MeshBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-40 sm:pt-52 pb-20 sm:pb-28 text-center px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-zinc-400 mb-8">
          <Star className="w-3 h-3 text-violet-400" />
          {t("badge")}
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto">
          {t("heroLine1")}{" "}
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            {t("heroLine2")}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-500 max-w-md mx-auto mb-10 leading-relaxed">
          {t.rich("subtitle", {
            price: (chunks) => <span className="text-zinc-300">{chunks}</span>,
          })}
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-colors shadow-lg cursor-pointer">
            {tc("getApiKey")}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#quickstart" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-sm font-medium transition-colors cursor-pointer">
            {tc("quickStart")}
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16 sm:pb-20 px-4">
        <FadeIn>
          <AnimatedStats />
        </FadeIn>
      </section>

      {/* Provider ticker */}
      <div className="border-y border-white/[0.05] overflow-hidden py-3.5 select-none">
        <div className="flex" style={{ animation: "ticker 35s linear infinite" }}>
          {[0, 1].map(i => (
            <div key={i} aria-hidden={i === 1} className="flex shrink-0">
              {providers.map(name => (
                <span key={name} className="px-8 text-[13px] text-zinc-600 font-medium whitespace-nowrap">
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <FeaturedModels />
      <WhyUs />
      <QuickStart />
      <LandingPricing />
      <FAQSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
