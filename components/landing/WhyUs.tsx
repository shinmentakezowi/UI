import { Code2, Globe, Zap, Shield, Wrench, MessageSquare } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { getTranslations } from "next-intl/server";

export async function WhyUs() {
  const t = await getTranslations("whyUs");
  const tc = await getTranslations("common");

  const WHY_US = [
    {
      icon: <Code2 className="w-5 h-5" />,
      title: t("feature1Title"),
      desc: t("feature1Desc"),
      link: "#quickstart",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: t("feature2Title"),
      desc: t("feature2Desc"),
      link: "#models",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: t("feature3Title"),
      desc: t("feature3Desc"),
      link: null,
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: t("feature4Title"),
      desc: t("feature4Desc"),
      link: null,
    },
    {
      icon: <Wrench className="w-5 h-5" />,
      title: t("feature5Title"),
      desc: t("feature5Desc"),
      link: null,
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: t("feature6Title"),
      desc: t("feature6Desc"),
      link: "#pricing",
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 border-t border-white/[0.04]">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-zinc-400">
            <Zap className="w-3 h-3 text-violet-400" />
            {t("badge")}
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3">
          {t("titleStart")}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">{t("titleHighlight")}</span>
        </h2>
        <p className="text-sm text-zinc-500 text-center mb-12 max-w-md mx-auto">
          {t("subtitle")}
        </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WHY_US.map((f, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="h-full p-5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-violet-500/25 hover:bg-violet-500/[0.03] hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-zinc-400 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-2">{f.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-3">{f.desc}</p>
                {f.link && (
                  <a href={f.link} className="text-xs text-violet-400 hover:text-violet-300 transition-colors cursor-pointer">
                    {tc("learnMore")}
                  </a>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
