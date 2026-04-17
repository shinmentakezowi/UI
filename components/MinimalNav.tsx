import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export async function MinimalNav() {
  const tc = await getTranslations("common");

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-3xl flex items-center justify-between px-5 h-12 rounded-xl border border-white/[0.10] bg-zinc-900/50 backdrop-blur-lg shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
        <Link href="/" className="text-sm font-semibold text-zinc-100">Hapuppy</Link>
        <Link
          href="/"
          className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          {tc("home")}
        </Link>
      </div>
    </nav>
  );
}
