"use client";

import { useState } from "react";
import { Ticket, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function RedeemPage() {
  const t = useTranslations("redeem");
  const [code, setCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  async function handleRedeem() {
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error(t("enterCode"));
      return;
    }
    setRedeeming(true);
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || t("success"));
        setCode("");
      } else {
        toast.error(data.error || t("failed"));
      }
    } catch {
      toast.error(t("failed"));
    } finally {
      setRedeeming(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">{t("title")}</h1>
        <p className="text-xs text-zinc-500 mt-1">{t("subtitle")}</p>
      </div>

      <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Ticket className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">{t("title")}</p>
            <p className="text-[11px] text-zinc-500">{t("creditsAdded")}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder={t("placeholder")}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleRedeem(); }}
            className="flex-1 h-10 rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 font-mono tracking-wider"
          />
          <button
            onClick={handleRedeem}
            disabled={redeeming || !code.trim()}
            className="h-10 px-5 rounded-lg bg-emerald-500/15 text-emerald-400 text-sm font-medium border border-emerald-500/20 hover:bg-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2"
          >
            {redeeming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ticket className="w-3.5 h-3.5" />}
            {t("redeem")}
          </button>
        </div>
      </div>

      <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.01] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-zinc-500" />
          <h3 className="text-xs font-semibold text-zinc-300">{t("howItWorks")}</h3>
        </div>
        <ul className="space-y-2.5 text-[12px] text-zinc-500">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">●</span>
            <span><span className="font-semibold text-zinc-300">{t("creditCodes")}</span> — {t("creditCodesDesc")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">●</span>
            <span><span className="font-semibold text-zinc-300">{t("planCodes")}</span> — {t("planCodesDesc")} <span className="font-semibold text-amber-400">{t("planCodesNote")}</span></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-600 mt-0.5">•</span>
            <span>{t("oneTimeUse")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-600 mt-0.5">•</span>
            <span>{t("neverExpire")}</span>
          </li>
        </ul>
      </div>

      {/* Discord CTA */}
      <a
        href="https://discord.com/invite/YWayJmZKCu"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 rounded-[14px] border border-[#5865F2]/20 bg-[#5865F2]/[0.06] p-5 hover:bg-[#5865F2]/[0.1] transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-[#5865F2]/15 border border-[#5865F2]/25 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{t("discordTitle")}</p>
          <p className="text-[11px] text-zinc-500">{t("discordDesc")}</p>
        </div>
        <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      </a>
    </div>
  );
}
