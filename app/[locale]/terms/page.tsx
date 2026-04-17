import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <div className="w-full max-w-3xl flex items-center justify-between px-5 h-12 rounded-xl border border-white/[0.10] bg-zinc-900/50 backdrop-blur-lg shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
          <Link href="/" className="text-sm font-semibold text-zinc-100">Hapuppy</Link>
          <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors">{t("backToHome")}</Link>
        </div>
      </nav>

      <article className="max-w-2xl mx-auto px-4 pt-32 pb-20">
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-xs text-zinc-500 mb-10">{t("lastUpdated")}</p>

        <div className="space-y-8 text-sm text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s1Title")}</h2>
            <p>{t("s1Body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s2Title")}</h2>
            <p>{t("s2Intro")}</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">{t("s2ThTier")}</th>
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">{t("s2ThPrice")}</th>
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">{t("s2ThCredits")}</th>
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">{t("s2ThRpm")}</th>
                    <th className="text-left py-2 text-zinc-400 font-medium">{t("s2ThModels")}</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-2 pr-4">{t("s2Row0Tier")}</td>
                    <td className="py-2 pr-4">$0</td>
                    <td className="py-2 pr-4">100K {t("s2Daily")}</td>
                    <td className="py-2 pr-4">100</td>
                    <td className="py-2">{t("s2Row0Models")}</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-2 pr-4">Lite</td>
                    <td className="py-2 pr-4">$9.99 {t("s2OneTime")}</td>
                    <td className="py-2 pr-4">30M</td>
                    <td className="py-2 pr-4">100</td>
                    <td className="py-2">{t("s2Row1Models")}</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-2 pr-4">Standard</td>
                    <td className="py-2 pr-4">$19.99 {t("s2OneTime")}</td>
                    <td className="py-2 pr-4">120M</td>
                    <td className="py-2 pr-4">100</td>
                    <td className="py-2">{t("s2Row2Models")}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Pro</td>
                    <td className="py-2 pr-4">$36.99 {t("s2OneTime")}</td>
                    <td className="py-2 pr-4">240M</td>
                    <td className="py-2 pr-4">100</td>
                    <td className="py-2">{t("s2Row3Models")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="list-disc list-inside mt-4 space-y-1">
              <li>{t("s2I1")}</li>
              <li>{t("s2I2")}</li>
              <li>{t("s2I3")}</li>
              <li>{t("s2I4")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s3Title")}</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>{t("s3I1")}</li>
              <li>{t("s3I2")}</li>
              <li>{t("s3I3")}</li>
              <li>{t("s3I4")}</li>
              <li>{t("s3I5")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s4Title")}</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>{t("s4I1")}</li>
              <li>
                {t("s4I2")}{" "}
                <a href="mailto:support@hapuppy.com" className="text-violet-400 hover:text-violet-300 transition-colors">
                  support@hapuppy.com
                </a>.
              </li>
              <li>{t("s4I3")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s5Title")}</h2>
            <p>{t("s5Body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s6Title")}</h2>
            <p>{t("s6Intro")}</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("s6I1")}</li>
              <li>{t("s6I2")}</li>
              <li>{t("s6I3")}</li>
              <li>{t("s6I4")}</li>
              <li>{t("s6I5")}</li>
              <li>{t("s6I6")}</li>
              <li>{t("s6I7")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s7Title")}</h2>
            <p>{t("s7Body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s8Title")}</h2>
            <p>{t("s8Body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s9Title")}</h2>
            <p>{t("s9Body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s10Title")}</h2>
            <p>{t("s10Body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s11Title")}</h2>
            <p>{t("s11Body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s12Title")}</h2>
            <p>{t("s12Body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s13Title")}</h2>
            <p>{t("s13Body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s14Title")}</h2>
            <p>{t("s14Body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s15Title")}</h2>
            <p>
              {t("s15Body")}{" "}
              <a href="mailto:support@hapuppy.com" className="text-violet-400 hover:text-violet-300 transition-colors">
                support@hapuppy.com
              </a>{" "}
              or{" "}
              <a href="https://discord.gg/YWayJmZKCu" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 transition-colors">
                Discord
              </a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
