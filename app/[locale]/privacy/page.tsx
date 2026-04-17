import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

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
            <p>
              {t("s1Body")}{" "}
              <a href="mailto:support@hapuppy.com" className="text-violet-400 hover:text-violet-300 transition-colors">
                support@hapuppy.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s2Title")}</h2>
            <p>{t("s2Intro")}</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-zinc-200">{t("s2I1Label")}</strong> — {t("s2I1")}</li>
              <li><strong className="text-zinc-200">{t("s2I2Label")}</strong> — {t("s2I2")}</li>
              <li><strong className="text-zinc-200">{t("s2I3Label")}</strong> — {t("s2I3")}</li>
              <li><strong className="text-zinc-200">{t("s2I4Label")}</strong> — {t("s2I4")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s3Title")}</h2>
            <p>{t("s3Intro")}</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-zinc-200">{t("s3I1Label")}</strong> — {t("s3I1")}</li>
              <li><strong className="text-zinc-200">{t("s3I2Label")}</strong> — {t("s3I2")}</li>
              <li><strong className="text-zinc-200">{t("s3I3Label")}</strong> — {t("s3I3")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s4Title")}</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>{t("s4I1")}</li>
              <li>{t("s4I2")}</li>
              <li>{t("s4I3")}</li>
              <li>{t("s4I4")}</li>
              <li>{t("s4I5")}</li>
              <li>{t("s4I6")}</li>
            </ul>
            <p className="mt-2">{t("s4Note")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s5Title")}</h2>
            <p>
              {t("s5Body1")} <strong className="text-zinc-200">{t("s5Not")}</strong> {t("s5Body2")}
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s6Title")}</h2>
            <p>{t("s6Intro")}</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-zinc-200">{t("s6I1Label")}</strong> — {t("s6I1")}</li>
              <li><strong className="text-zinc-200">{t("s6I2Label")}</strong> — {t("s6I2")}</li>
              <li><strong className="text-zinc-200">{t("s6I3Label")}</strong> — {t("s6I3")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s7Title")}</h2>
            <p>{t("s7Body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s8Title")}</h2>
            <p>{t("s8Intro")}</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("s8I1")}</li>
              <li>{t("s8I2")}</li>
              <li>{t("s8I3")}</li>
              <li>{t("s8I4")}</li>
              <li>{t("s8I5")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s9Title")}</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-zinc-200">{t("s9I1Label")}</strong> — {t("s9I1")}</li>
              <li><strong className="text-zinc-200">{t("s9I2Label")}</strong> — {t("s9I2")}</li>
              <li><strong className="text-zinc-200">{t("s9I3Label")}</strong> — {t("s9I3")}</li>
              <li><strong className="text-zinc-200">{t("s9I4Label")}</strong> — {t("s9I4")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s10Title")}</h2>
            <p>{t("s10Body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-100 mb-3">{t("s11Title")}</h2>
            <p>{t("s11Intro")}</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-zinc-200">{t("s11I1Label")}</strong> — {t("s11I1")}</li>
              <li><strong className="text-zinc-200">{t("s11I2Label")}</strong> — {t("s11I2")}</li>
              <li><strong className="text-zinc-200">{t("s11I3Label")}</strong> — {t("s11I3")}</li>
              <li><strong className="text-zinc-200">{t("s11I4Label")}</strong> — {t("s11I4")}</li>
              <li><strong className="text-zinc-200">{t("s11I5Label")}</strong> — {t("s11I5")}</li>
              <li><strong className="text-zinc-200">{t("s11I6Label")}</strong> — {t("s11I6")}</li>
              <li><strong className="text-zinc-200">{t("s11I7Label")}</strong> — {t("s11I7")}</li>
            </ul>
            <p className="mt-2">
              {t("s11FooterPre")}{" "}
              <a href="mailto:support@hapuppy.com" className="text-violet-400 hover:text-violet-300 transition-colors">
                support@hapuppy.com
              </a>.{" "}
              {t("s11FooterPost")}
            </p>
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
            <p>
              {t("s14Body")}{" "}
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
