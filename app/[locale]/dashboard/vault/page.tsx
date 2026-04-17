"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { Landmark, Wallet, ArrowDownToLine, ArrowUpFromLine, Loader2, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatCompact } from "@/lib/format";
import { useTranslations } from "next-intl";

type Mode = "deposit" | "withdraw";

export default function VaultPage() {
  const t = useTranslations("vault");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [subscriptionRemaining, setSubscriptionRemaining] = useState(0);
  const [subscriptionUsed, setSubscriptionUsed] = useState(0);
  const [subscriptionTotal, setSubscriptionTotal] = useState(0);
  const [planTier, setPlanTier] = useState("");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<Mode>("deposit");
  const [submitting, setSubmitting] = useState(false);

  async function fetchData() {
    try {
      const [vaultRes, dashRes] = await Promise.all([
        fetch("/api/vault"),
        fetch("/api/dashboard?days=1"),
      ]);
      if (vaultRes.ok) {
        const v = await vaultRes.json();
        setVaultBalance(v.balance ?? 0);
      }
      if (dashRes.ok) {
        const d = await dashRes.json();
        setSubscriptionRemaining(d.usage?.credits?.remaining ?? 0);
        setSubscriptionUsed(d.usage?.credits?.subUsed ?? 0);
        setSubscriptionTotal(d.usage?.credits?.subTotal ?? 0);
        setPlanTier(d.usage?.plan?.tier ?? "");
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

  const isUnlimited = subscriptionTotal === 0 || planTier === "pro";
  // Unlimited plans: withdraw up to wallet balance; limited plans: withdraw up to consumed quota
  const maxWithdraw = isUnlimited ? vaultBalance : Math.min(vaultBalance, subscriptionUsed);
  const maxDeposit = subscriptionRemaining;

  async function handleMax() {
    if (mode === "deposit") {
      setAmount(String(maxDeposit));
      return;
    }
    try {
      const res = await fetch("/api/vault/max-withdraw");
      if (res.ok) {
        const data = await res.json();
        setAmount(String(data.max ?? 0));
      }
    } catch {
      // fallback to local calculation
      setAmount(String(maxWithdraw));
    }
  }

  async function handleSubmit() {
    const val = parseInt(amount);
    if (!val || val < 1) {
      toast.error(mode === "deposit" ? t("depositInvalid") : t("minWithdrawal"));
      return;
    }
    setSubmitting(true);
    try {
      const endpoint = mode === "deposit" ? "/api/vault/deposit" : "/api/vault/withdraw";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: val }),
      });
      const data = await res.json();
      if (res.ok) {
        if (mode === "deposit") {
          toast.success(`${t("deposited")} ${formatCompact(val)} credits`);
        } else {
          toast.success(`${t("withdrawn")} ${formatCompact(val)} ${t("creditsToAccount")}`);
        }
        setAmount("");
        fetchData();
      } else {
        toast.error(data.error || (mode === "deposit" ? t("depositFailed") : t("withdrawFailed")));
      }
    } catch {
      toast.error(mode === "deposit" ? t("depositFailed") : t("withdrawFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">{t("title")}</h1>
        <p className="text-xs text-zinc-500 mt-1">{t("subtitle")}</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-500 font-medium">{t("currentBalance")}</span>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-36" />
          ) : (
            <p className="text-2xl font-bold text-emerald-400 tabular-nums">
              {subscriptionRemaining.toLocaleString()}
            </p>
          )}
          <p className="text-[11px] text-zinc-600 mt-1">{t("resetsDaily")}</p>
        </div>

        <div className="rounded-[14px] border border-violet-500/10 bg-[#111111] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Landmark className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-zinc-500 font-medium">{t("vaultBalance")}</span>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-36" />
          ) : (
            <p className="text-2xl font-bold text-violet-400 tabular-nums">
              {vaultBalance.toLocaleString()}
            </p>
          )}
          <p className="text-[11px] text-zinc-600 mt-1">{t("persistsForever")}</p>
        </div>
      </div>

      {/* Transfer Credits */}
      <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-5 h-5 rounded-full border border-white/[0.1] flex items-center justify-center">
            <ArrowDownToLine className="w-3 h-3 text-zinc-400" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-200">{t("transferCredits")}</h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 mb-5 bg-white/[0.03] rounded-lg p-1 w-fit">
          <button
            onClick={() => { setMode("deposit"); setAmount(""); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              mode === "deposit"
                ? "bg-white/[0.08] text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <ArrowDownToLine className="w-3 h-3" />
            {t("deposit")}
          </button>
          <button
            onClick={() => { setMode("withdraw"); setAmount(""); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              mode === "withdraw"
                ? "bg-white/[0.08] text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <ArrowUpFromLine className="w-3 h-3" />
            {t("withdraw")}
          </button>
        </div>

        {/* Amount */}
        <div className="space-y-3">
          <label className="text-xs text-zinc-500 font-medium">{t("amount")}</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t("minCredits")}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
              className="flex-1 h-10 rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.15] tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={handleMax}
              className="h-10 px-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              MAX
            </button>
          </div>
          <p className="text-[11px] text-zinc-600">
            {mode === "deposit"
              ? `${t("subscriptionAvailable")} ${maxDeposit.toLocaleString()} credits`
              : `${t("available")} ${maxWithdraw.toLocaleString()} credits`}
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`mt-4 h-10 px-5 rounded-lg text-sm font-medium border transition-colors cursor-pointer flex items-center gap-2 ${
            mode === "deposit"
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25"
              : "bg-violet-500/15 text-violet-400 border-violet-500/20 hover:bg-violet-500/25"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {submitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : mode === "deposit" ? (
            <ArrowDownToLine className="w-3.5 h-3.5" />
          ) : (
            <ArrowUpFromLine className="w-3.5 h-3.5" />
          )}
          {mode === "deposit" ? t("depositToVault") : t("withdrawToAccount")}
        </button>
      </div>

      {/* How the Vault Works */}
      <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.01] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-zinc-500" />
          <h3 className="text-xs font-semibold text-zinc-300">{t("howItWorks")}</h3>
        </div>
        <ul className="space-y-2.5 text-[12px] text-zinc-500">
          <li className="flex items-start gap-2">
            <span className="text-zinc-600 mt-0.5">•</span>
            <span>{t("howIt1")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-600 mt-0.5">•</span>
            <span>{t("howIt2")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-600 mt-0.5">•</span>
            <span>{t("howIt3")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-600 mt-0.5">•</span>
            <span>{t("howIt4")}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
