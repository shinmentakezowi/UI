import { Link } from "@/i18n/routing";
import { ArrowRight, Cpu, Star, Sparkles, Zap, Globe } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { FEATURED_MODELS } from "@/lib/featured-models";
import { getTranslations } from "next-intl/server";

const PROVIDER_ICON: Record<string, React.ReactNode> = {
  Anthropic: <Star className="w-4 h-4" />,
  OpenAI:    <Sparkles className="w-4 h-4" />,
  Google:    <Zap className="w-4 h-4" />,
  xAI:       <Globe className="w-4 h-4" />,
  Zhipu:     <Cpu className="w-4 h-4" />,
};

const PROVIDER_BADGE_COLOR: Record<string, string> = {
  Anthropic: "violet",
  OpenAI:    "emerald",
  Google:    "blue",
  Zhipu:     "rose",
  xAI:       "zinc",
};

const BADGE_COLORS: Record<string, string> = {
  violet:  "bg-violet-500/15 text-violet-400 border-violet-500/20",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  blue:    "bg-blue-500/15   text-blue-400   border-blue-500/20",
  zinc:    "bg-zinc-500/15   text-zinc-400   border-zinc-500/20",
  rose:    "bg-rose-500/15   text-rose-400   border-rose-500/20",
};

export async function FeaturedModels() {
  const t = await getTranslations("featuredModels");

  return (
    <section id="models" className="py-20 sm:py-28 px-4 scroll-mt-20">
      <FadeIn>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-zinc-400">
            <Star className="w-3 h-3 text-violet-400" />
            {t("badge")}
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3">
          {t("titleStart")}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            {t("titleHighlight")}
          </span>
        </h2>
        <p className="text-sm text-zinc-500 text-center mb-10 max-w-sm mx-auto">
          {t("subtitle")}
        </p>

        <div className="space-y-2">
          {FEATURED_MODELS.filter(m => m.badge).map(m => {
            const badgeColor = PROVIDER_BADGE_COLOR[m.provider] ?? "zinc";
            return (
            <Link key={m.id} href="/login" className="flex items-center gap-4 p-4 sm:p-5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 group cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-zinc-400 shrink-0 group-hover:border-white/[0.15] transition-colors">
                {PROVIDER_ICON[m.provider] ?? <Cpu className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-sm font-semibold text-zinc-100">{m.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${BADGE_COLORS[badgeColor]}`}>{m.provider.toUpperCase()}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium uppercase tracking-wider">{m.badge}</span>
                </div>
                <p className="text-xs text-zinc-500 truncate">{m.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
            );
          })}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FEATURED_MODELS.filter(m => !m.badge).map(m => {
              const badgeColor = PROVIDER_BADGE_COLOR[m.provider] ?? "zinc";
              return (
              <Link key={m.id} href="/login" className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.13] hover:-translate-y-0.5 hover:shadow-md hover:shadow-white/5 transition-all duration-300 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-zinc-400 shrink-0 group-hover:border-white/[0.14] transition-colors">
                  {PROVIDER_ICON[m.provider] ?? <Cpu className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className="text-sm font-semibold text-zinc-100 truncate">{m.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider shrink-0 ${BADGE_COLORS[badgeColor]}`}>{m.provider.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{m.description}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
              );
            })}
          </div>

          <Link href="/models" className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-white/[0.07] text-xs text-zinc-600 hover:text-zinc-300 hover:border-white/[0.15] hover:bg-white/[0.02] transition-all duration-300 cursor-pointer group">
            {t("viewAll")}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
      </FadeIn>
    </section>
  );
}
