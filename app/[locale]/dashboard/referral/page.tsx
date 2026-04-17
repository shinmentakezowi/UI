"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { Users, Copy, Check, ArrowUpFromLine, Loader2, Info, Link2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatCompact } from "@/lib/format";
import { useTranslations } from "next-intl";

export default function ReferralPage() {
  const t = useTranslations("referral");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [referralCredits, setReferralCredits] = useState(0);
  const [referralHistoryCredits, setReferralHistoryCredits] = useState(0);
  const [amount, setAmount] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  async function fetchData() {
    try {
      const res = await fetch("/api/referral");
      if (res.ok) {
        const data = await res.json();
        setReferralCode(data.referralCode || "");
        setReferralCount(data.referralCount || 0);
        setReferralCredits(data.referralCredits || 0);
        setReferralHistoryCredits(data.referralHistoryCredits || 0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      fetchData();
    });
  }, [router]);

  function copyCode() {
    navigator.clipboard.writeText(referralCode);
    setCodeCopied(true);
    toast.success(t("copied"));
    setTimeout(() => setCodeCopied(false), 2000);
  }

  function copyLink() {
    const siteUrl = window.location.origin;
    navigator.clipboard.writeText(`${siteUrl}/register?invite=${referralCode}`);
    setLinkCopied(true);
    toast.success(t("copied"));
    setTimeout(() => setLinkCopied(false), 2000);
  }

  async function handleTransfer() {
    const val = parseInt(amount);
    if (!val || val < 1) {
      toast.error(t("insufficientQuota"));
      return;
    }
    if (val > referralCredits) {
      toast.error(t("insufficientQuota"));
      return;
    }
    setTransferring(true);
    try {
      const res = await fetch("/api/referral/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: val }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`${t("transferSuccess")} ${formatCompact(val)} credits`);
        setAmount("");
        fetchData();
      } else {
        toast.error(data.error || t("transferFailed"));
      }
    } catch {
      toast.error(t("transferFailed"));
    } finally {
      setTransferring(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">{t("title")}</h1>
        <p className="text-xs text-zinc-500 mt-1">{t("subtitle")}</p>
      </div>

      {/* Invite Code Card */}
      <div className="rounded-[14px] border border-amber-500/10 bg-[#111111] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-zinc-500 font-medium">{t("yourCode")}</span>
        </div>
        {loading ? (
          <Skeleton className="h-10 w-40" />
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-3xl font-mono font-bold text-amber-400 tracking-widest select-all">
              {referralCode}
            </span>
            <button
              onClick={copyCode}
              className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-colors cursor-pointer"
              title={t("copyCode")}
            >
              {codeCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
            </button>
            <button
              onClick={copyLink}
              className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-colors cursor-pointer"
              title={t("copyLink")}
            >
              {linkCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4 text-zinc-400" />}
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Invited Count */}
        <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5">
          <span className="text-xs text-zinc-500 font-medium">{t("invitedCount")}</span>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100 tabular-nums mt-2">
              {referralCount} <span className="text-sm font-normal text-zinc-500">{t("invitedUnit")}</span>
            </p>
          )}
        </div>

        {/* Available Quota */}
        <div className="rounded-[14px] border border-amber-500/10 bg-[#111111] p-5">
          <span className="text-xs text-zinc-500 font-medium">{t("availableQuota")}</span>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-2xl font-bold text-amber-400 tabular-nums mt-2">
              {referralCredits.toLocaleString()}
            </p>
          )}
        </div>

        {/* History Quota */}
        <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5">
          <span className="text-xs text-zinc-500 font-medium">{t("historyQuota")}</span>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-2xl font-bold text-zinc-300 tabular-nums mt-2">
              {referralHistoryCredits.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Transfer Section */}
      <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5">
        <h2 className="text-sm font-semibold text-zinc-200 mb-4">{t("transferToVault")}</h2>

        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder={t("transferAmount")}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
              className="w-full h-10 rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/30 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {referralCredits > 0 && (
              <button
                onClick={() => setAmount(String(referralCredits))}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer px-1.5 py-0.5 rounded bg-amber-500/10"
              >
                MAX
              </button>
            )}
          </div>
          <button
            onClick={handleTransfer}
            disabled={transferring || referralCredits === 0}
            className="h-10 px-5 rounded-lg bg-amber-500/15 text-amber-400 text-sm font-medium border border-amber-500/20 hover:bg-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2"
          >
            {transferring ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowUpFromLine className="w-3.5 h-3.5" />}
            {t("transfer")}
          </button>
        </div>
        <p className="text-[11px] text-zinc-600">
          {t("availableQuota")}: {referralCredits.toLocaleString()} credits
        </p>
      </div>

      {/* How It Works */}
      <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.01] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-zinc-500" />
          <h3 className="text-xs font-semibold text-zinc-300">{t("howItWorks")}</h3>
        </div>
        <ul className="space-y-2.5 text-[12px] text-zinc-500">
          <li className="flex items-start gap-2">
            <span className="text-zinc-600 mt-0.5">1.</span>
            <span>{t("howIt1")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-600 mt-0.5">2.</span>
            <span>{t("howIt2")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-600 mt-0.5">3.</span>
            <span>{t("howIt3")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-600 mt-0.5">4.</span>
            <span>{t("howIt4")}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
