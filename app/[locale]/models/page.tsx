import { Suspense } from "react";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { ScrollToTop } from "@/components/ScrollToTop";
import { MinimalNav } from "@/components/MinimalNav";
import { CopyModelId } from "@/components/CopyModelId";
import { fetchModelsData, groupByProvider } from "@/lib/models";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "All Models — Hapuppy",
  description: "Browse all AI models available through Hapuppy — Claude, GPT-4o, Gemini, Grok, DeepSeek, Mistral, Llama and more.",
};

const PROVIDER_COLORS: Record<string, string> = {
  ANTHROPIC:  "bg-violet-500/15 text-violet-400 border-violet-500/20",
  OPENAI:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  GOOGLE:     "bg-blue-500/15 text-blue-400 border-blue-500/20",
  XAI:        "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  DEEPSEEK:   "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  MISTRAL:    "bg-orange-500/15 text-orange-400 border-orange-500/20",
  META:       "bg-sky-500/15 text-sky-400 border-sky-500/20",
  ALIBABA:    "bg-red-500/15 text-red-400 border-red-500/20",
  ZHIPU:      "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/20",
  MOONSHOT:   "bg-slate-500/15 text-slate-400 border-slate-500/20",
  COHERE:     "bg-teal-500/15 text-teal-400 border-teal-500/20",
  PERPLEXITY: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  OTHER:      "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

const PROVIDER_DOT: Record<string, string> = {
  ANTHROPIC:  "bg-violet-400",
  OPENAI:     "bg-emerald-400",
  GOOGLE:     "bg-blue-400",
  XAI:        "bg-zinc-400",
  DEEPSEEK:   "bg-cyan-400",
  MISTRAL:    "bg-orange-400",
  META:       "bg-sky-400",
  ALIBABA:    "bg-red-400",
  ZHIPU:      "bg-fuchsia-400",
  MOONSHOT:   "bg-slate-400",
  COHERE:     "bg-teal-400",
  PERPLEXITY: "bg-indigo-400",
  OTHER:      "bg-zinc-400",
};

function ModelsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-24 space-y-12">
      {[1, 2, 3, 4].map(i => (
        <section key={i} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-24 rounded-md bg-white/[0.04] animate-pulse" />
            <div className="h-4 w-16 rounded bg-white/[0.03] animate-pulse" />
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.01]">
                <div className="w-1.5 h-1.5 rounded-full bg-white/[0.06] animate-pulse" />
                <div className="h-3.5 flex-1 rounded bg-white/[0.04] animate-pulse" />
                <div className="h-3 w-16 rounded bg-white/[0.03] animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

async function ModelsContent() {
  const t = await getTranslations("models");
  const tc = await getTranslations("common");
  const { models, pricing } = await fetchModelsData();
  const grouped = groupByProvider(models);

  if (models.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 pb-24 text-center py-20">
        <p className="text-sm text-zinc-500">{t("failedToLoad")}</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Header dynamic parts ── */}
      <section className="pb-12 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {t("allModels")}{" "}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            {models.length} {t("modelsLabel")}
          </span>
        </h1>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-8">
          {grouped.length} {t("subtitle")}
        </p>

        {/* Provider quick-jump */}
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-4">
          {grouped.map(({ key, name, models: ms }) => (
            <a
              key={key}
              href={`#${key.toLowerCase()}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium transition-opacity hover:opacity-80 cursor-pointer ${PROVIDER_COLORS[key] ?? PROVIDER_COLORS.OTHER}`}
            >
              {name}
              <span className="opacity-60">{ms.length}</span>
            </a>
          ))}
        </div>

        {/* Multiplier legend */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-[10px] text-zinc-500">
          <span className="text-violet-400/80 font-mono">×input</span>
          <span className="text-zinc-700">/</span>
          <span className="text-pink-400/80 font-mono">×output</span>
          <span className="ml-1">— {t("creditMultipliers")}</span>
          <Link href="/credits" className="ml-1 text-violet-400/80 hover:text-violet-300 transition-colors underline underline-offset-2">
            {t("howCreditsWork")}
          </Link>
        </div>
      </section>

      {/* ── Model groups ── */}
      <div className="max-w-4xl mx-auto px-4 pb-24 space-y-12">
        {grouped.map(({ key, name, models: ms }) => (
          <section key={key} id={key.toLowerCase()} className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold uppercase tracking-wider ${PROVIDER_COLORS[key] ?? PROVIDER_COLORS.OTHER}`}>
                {name}
              </span>
              <span className="text-xs text-zinc-600">{ms.length} {t("modelsCount")}</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ms.map(m => {
                const px = pricing.get(m.id);
                return (
                  <CopyModelId key={m.id} modelId={m.id}>
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.10] transition-all cursor-pointer"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${PROVIDER_DOT[key] ?? "bg-zinc-400"}`} />
                      <code className="text-xs text-zinc-300 font-mono flex-1 truncate">{m.id}</code>
                      {px && px.cost_type === "per_token" && (
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-violet-400/80 font-mono">×{px.inputWeight}</span>
                          <span className="text-[10px] text-zinc-700">/</span>
                          <span className="text-[10px] text-pink-400/80 font-mono">×{px.outputWeight}</span>
                        </div>
                      )}
                      {px && px.cost_type === "fixed" && (
                        <span className="text-[10px] text-amber-400/80 font-mono shrink-0">
                          {px.base_cost.toLocaleString()} credits/req
                        </span>
                      )}
                    </div>
                  </CopyModelId>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-white/[0.04] py-16 px-4 text-center">
        <p className="text-sm text-zinc-500 mb-6">
          {t("accessAll")} {models.length}{t("modelsWithOneKey")}
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-colors shadow-lg cursor-pointer"
        >
          {tc("getStarted")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
}

export default async function ModelsPage() {
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 overflow-x-hidden">
      <MinimalNav />

      <section className="pt-36 sm:pt-44">
      </section>

      <Suspense fallback={
        <>
          {/* Skeleton header */}
          <section className="pb-12 px-4 text-center">
            <div className="h-12 w-64 mx-auto rounded-lg bg-white/[0.04] animate-pulse mb-4" />
            <div className="h-4 w-48 mx-auto rounded bg-white/[0.03] animate-pulse mb-8" />
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-6 w-20 rounded-full bg-white/[0.04] animate-pulse" />
              ))}
            </div>
          </section>
          <ModelsSkeleton />
        </>
      }>
        <ModelsContent />
      </Suspense>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] py-8 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <div className="flex items-center">
            <span className="font-medium text-zinc-500">Hapuppy</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-zinc-400 transition-colors">{tc("home")}</Link>
            <Link href="/dashboard/billing" className="hover:text-zinc-400 transition-colors">{tc("pricing")}</Link>
            <Link href="/login" className="hover:text-zinc-400 transition-colors">{tf("signIn")}</Link>
          </div>
          <span>&copy; {new Date().getFullYear()} Hapuppy</span>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
