import { Link } from "@/i18n/routing";
import { ArrowRight, Zap } from "lucide-react";
import { ScrollToTop } from "@/components/ScrollToTop";
import { MinimalNav } from "@/components/MinimalNav";
import { fetchModelsData } from "@/lib/models";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "How Credits Work — Hapuppy",
  description: "Understand how Hapuppy credits are calculated for each model request.",
};

// Featured models shown in worked examples
const FEATURED = [
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", color: "violet" as const, badgeKey: "recommended" },
  { id: "claude-opus-4-6",   label: "Claude Opus 4.6",   color: "pink" as const,   badgeKey: "mostCapable" },
];

const EXAMPLE_TOKENS = { input: 1000, output: 1000 };

export default async function CreditsPage() {
  const t = await getTranslations("creditsPage");
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");
  const { pricing } = await fetchModelsData();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 overflow-x-hidden">
      <MinimalNav />

      {/* ── Header ── */}
      <section className="pt-36 sm:pt-44 pb-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/[0.06] text-violet-300 text-xs font-medium mb-5">
          <Zap className="w-3 h-3" />
          {t("title")}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {t("titleHow")}{" "}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            {t("titleCredits")}
          </span>{" "}
          {t("titleWork")}
        </h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
          {t("intro")}
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4 pb-24 space-y-16">

        {/* ── Formula ── */}
        <section>
          <h2 className="text-base font-semibold text-zinc-100 mb-4">{t("formulaTitle")}</h2>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 font-mono text-sm leading-relaxed">
            <p className="text-zinc-300">
              {t("formulaCredits")}
            </p>
            <p className="text-violet-400 mt-1 pl-4">
              {t("formulaInput")} <span className="text-zinc-100">{t("formulaInputMult")}</span>
            </p>
            <p className="text-pink-400 pl-4">
              {t("formulaPlus")} <span className="text-zinc-100">{t("formulaOutputMult")}</span>
            </p>
          </div>
          <p className="text-xs text-zinc-600 mt-3">
            <span className="text-violet-400/80">{t("formulaInputMult")}</span> = {t("formulaNote").split("·")[0].split("=")[1]?.trim()} &nbsp;·&nbsp;
            <span className="text-pink-400/80">{t("formulaOutputMult")}</span> = {t("formulaNote").split("·")[1]?.split("=")[1]?.trim()}
          </p>
        </section>

        {/* ── Featured model multipliers ── */}
        <section>
          <h2 className="text-base font-semibold text-zinc-100 mb-4">{t("multipliersTitle")}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {FEATURED.map((m) => {
              const px = pricing.get(m.id);
              if (!px) return null;
              return (
                <div
                  key={m.id}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{m.label}</p>
                      <code className="text-[11px] text-zinc-600 font-mono">{m.id}</code>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      m.color === "violet"
                        ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                        : "bg-pink-500/10 text-pink-400 border-pink-500/20"
                    }`}>
                      {t(m.badgeKey as "recommended" | "mostCapable")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-lg bg-white/[0.03] py-2.5 px-1">
                      <p className="text-base font-bold font-mono text-violet-400">×{px.inputWeight}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{t("input")}</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] py-2.5 px-1">
                      <p className="text-base font-bold font-mono text-pink-400">×{px.outputWeight}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{t("output")}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-zinc-600 mt-3">
            {t("viewAllModels")}{" "}
            <Link href="/models" className="text-violet-400/80 hover:text-violet-300 underline underline-offset-2">
              {t("modelsPage")}
            </Link>
            .
          </p>
        </section>

        {/* ── Worked examples ── */}
        <section>
          <h2 className="text-base font-semibold text-zinc-100 mb-1">{t("examplesTitle")}</h2>
          <p className="text-xs text-zinc-600 mb-4">
            {t("examplesBased")} {EXAMPLE_TOKENS.input.toLocaleString()} {t("examplesInputTokens")} {EXAMPLE_TOKENS.output.toLocaleString()} {t("examplesOutputTokens")}
          </p>

          <div className="space-y-3">
            {FEATURED.map((m) => {
              const px = pricing.get(m.id);
              if (!px) return null;
              const inputCredits = EXAMPLE_TOKENS.input * px.inputWeight;
              const outputCredits = EXAMPLE_TOKENS.output * px.outputWeight;
              const totalCredits = inputCredits + outputCredits;
              return (
                <div
                  key={m.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-200">{m.label}</p>
                    <p className="text-[11px] text-zinc-600 font-mono mt-0.5">
                      {EXAMPLE_TOKENS.input.toLocaleString()} × {px.inputWeight} + {EXAMPLE_TOKENS.output.toLocaleString()} × {px.outputWeight}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-zinc-100">{totalCredits.toLocaleString()}</p>
                    <p className="text-[10px] text-zinc-600">{tc("credits")}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Daily allowance ── */}
        <section>
          <h2 className="text-base font-semibold text-zinc-100 mb-4">{t("dailyAllowanceTitle")}</h2>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-zinc-100">Standard</p>
                <p className="text-xs text-zinc-600">$29.9/mo</p>
              </div>
              <div className="flex gap-6 text-right text-xs">
                <div>
                  <p className="text-zinc-100 font-mono font-medium">4,000,000</p>
                  <p className="text-zinc-600">{t("creditsPerDay")}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-zinc-700 mt-2">
            * {t("actualRequest")}
          </p>
        </section>

      </div>

      {/* ── CTA ── */}
      <div className="border-t border-white/[0.04] py-16 px-4 text-center">
        <p className="text-sm text-zinc-500 mb-6">
          {t("readyToStart")}
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-colors shadow-lg"
        >
          {tc("getApiKey")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] py-8 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <div className="flex items-center">
            <span className="font-medium text-zinc-500">Hapuppy</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-zinc-400 transition-colors">{tc("home")}</Link>
            <Link href="/models" className="hover:text-zinc-400 transition-colors">Models</Link>
            <Link href="/dashboard/billing" className="hover:text-zinc-400 transition-colors">{tc("pricing")}</Link>
          </div>
          <span>&copy; {new Date().getFullYear()} Hapuppy</span>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
