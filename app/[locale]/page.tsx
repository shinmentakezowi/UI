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
import { HeroBackground } from "@/components/HeroBackground";
import { HeroCTAButtons } from "@/components/landing/HeroCTAButtons";
import { HeroHeadline } from "@/components/landing/HeroHeadline";
import { HeroTerminal } from "@/components/landing/HeroTerminal";
import { HUDOverlay } from "@/components/landing/HUDOverlay";
import { HeroScrollIndicator } from "@/components/landing/HeroScrollIndicator";
import { HeroSubtitle } from "@/components/landing/HeroSubtitle";
import { HeroTrustBar } from "@/components/landing/HeroTrustBar";
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
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 overflow-x-hidden selection:bg-violet-500/30 selection:text-white">
      <Navbar />

      {/* Hero — 2-column layout like wiwi */}
      <section className="w-full min-h-screen flex items-center relative px-4 pt-20 overflow-hidden bg-[#050505]">
        <HeroBackground />
        <HUDOverlay />

        {/* Mobile terminal bg (faded behind text on small screens) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 lg:hidden pointer-events-none">
          <div className="w-full max-w-[90%] scale-75 sm:scale-90">
            <HeroTerminal />
          </div>
        </div>

        {/* 2-column grid */}
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
          {/* Left — Text content */}
          <HeroLeftContent
            line1={t("heroLine1")}
            line2={t("heroLine2")}
            subtitleRich={t.rich("subtitle", {
              price: (chunks) => `{{price}}${chunks}{{/price}}`,
            }) as string}
            getApiKeyLabel={tc("getApiKey")}
            quickStartLabel={tc("quickStart")}
          />

          {/* Right — Interactive Terminal (desktop only) */}
          <div className="relative hidden lg:block -mt-16">
            <HeroTerminal />
          </div>
        </div>

        <HeroScrollIndicator />
      </section>

      {/* Stats */}
      <section id="stats" className="py-20 sm:py-28 px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        <FadeIn>
          <AnimatedStats />
        </FadeIn>
      </section>

      {/* Provider ticker */}
      <div className="relative border-y border-white/[0.05] overflow-hidden py-4 select-none">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />
        <div className="flex" style={{ animation: "ticker 35s linear infinite" }}>
          {[0, 1].map(i => (
            <div key={i} aria-hidden={i === 1} className="flex shrink-0">
              {providers.map(name => (
                <span key={name} className="px-10 text-[13px] text-zinc-500 font-medium whitespace-nowrap tracking-wide">
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

function HeroLeftContent({
  line1,
  line2,
  subtitleRich,
  getApiKeyLabel,
  quickStartLabel,
}: {
  line1: string;
  line2: string;
  subtitleRich: string;
  getApiKeyLabel: string;
  quickStartLabel: string;
}) {
  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
      <HeroHeadline line1={line1} line2={line2} />
      <HeroSubtitle subtitleRich={subtitleRich} />
      <HeroCTAButtons
        getApiKeyLabel={getApiKeyLabel}
        quickStartLabel={quickStartLabel}
      />
      <HeroTrustBar />
    </div>
  );
}
