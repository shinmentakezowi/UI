import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const tc = await getTranslations("common");

  return (
    <footer className="border-t border-white/[0.05] pt-20 sm:pt-28 pb-0 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-xs text-zinc-600">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="" width={18} height={18} className="rounded" />
          <span className="font-medium text-zinc-500">Hapuppy</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/dashboard/billing"  className="hover:text-zinc-400 transition-colors">{tc("pricing")}</Link>
          <Link href="/login"    className="hover:text-zinc-400 transition-colors">{t("signIn")}</Link>
          <Link href="/register" className="hover:text-zinc-400 transition-colors">{t("register")}</Link>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">{t("privacy")}</Link>
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">{t("terms")}</Link>
          <a href="mailto:support@hapuppy.com" className="hover:text-zinc-400 transition-colors">{t("email")}</a>
          <a href="https://discord.gg/YWayJmZKCu" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">{t("discord")}</a>
        </div>
        <span>&copy; {new Date().getFullYear()} Hapuppy</span>
      </div>

      <p className="max-w-2xl mx-auto px-4 text-center text-[10px] text-zinc-700 mb-8 leading-relaxed">
        {t("disclaimer")}
      </p>

      <div className="relative text-center select-none overflow-hidden h-28 sm:h-40">
        <div
          className="absolute inset-x-0 text-[80px] sm:text-[120px] md:text-[160px] font-black leading-none tracking-tighter text-transparent pointer-events-none"
          style={{
            bottom: "10%",
            WebkitTextStroke: "1px rgba(255,255,255,0.04)",
            background: "linear-gradient(to bottom, rgba(124,58,237,0.15), transparent)",
            WebkitBackgroundClip: "text",
          }}
        >
          hapuppy
        </div>
      </div>
    </footer>
  );
}
