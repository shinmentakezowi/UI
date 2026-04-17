import { FadeIn } from "@/components/FadeIn";
import { getTranslations } from "next-intl/server";

export async function FAQSection() {
  const t = await getTranslations("faq");

  const FAQS = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 border-t border-white/[0.04] scroll-mt-20">
      <FadeIn>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-10">{t("title")}</h2>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
          {FAQS.map(f => (
            <div key={f.q}>
              <h3 className="text-sm font-semibold text-zinc-100 mb-2">{f.q}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
      </FadeIn>
    </section>
  );
}
