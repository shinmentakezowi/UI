"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import {
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Zap,
  CreditCard,
  ExternalLink,
  Shield,
  Globe,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PromptGenerator from "@/components/dashboard/PromptGenerator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { maskKey } from "@/lib/format";
import type { KeyData } from "@/lib/types";
import { useTranslations } from "next-intl";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://beta.hapuppy.com";

type SnippetTab = "claude-code" | "curl" | "python";

export default function KeysPage() {
  const t = useTranslations("keys");
  const tc = useTranslations("common");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [keyData, setKeyData] = useState<KeyData | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<SnippetTab>("claude-code");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const SNIPPET_TABS: { key: SnippetTab; label: string }[] = [
    { key: "claude-code", label: t("claudeCode") },
    { key: "curl", label: t("curl") },
    { key: "python", label: t("python") },
  ];

  const fetchKeyData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const res = await fetch("/api/keys");
      if (res.ok) setKeyData(await res.json());
    } catch {
      toast.error(t("failedGenerate"));
    } finally {
      setLoading(false);
    }
  }, [router, t]);

  useEffect(() => { fetchKeyData(); }, [fetchKeyData]);

  async function copyText(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success(tc("copied"));
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/keys/provision", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.apiKey) {
        setKeyData(keyData ? { ...keyData, apiKey: data.apiKey } : { apiKey: data.apiKey, plan: "free" });
        toast.success(t("keyGenerated"));
      } else {
        toast.error(data.detail || data.error || t("failedGenerate"));
      }
    } catch {
      toast.error(t("failedGenerate"));
    } finally {
      setGenerating(false);
    }
  }

  async function handleRegenerate() {
    setResetDialogOpen(false);
    setRegenerating(true);
    try {
      const res = await fetch("/api/keys", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setKeyData((prev) => prev ? { ...prev, apiKey: data.apiKey } : data);
        toast.success(t("keyRegenerated"));
      } else {
        toast.error(t("failedRegenerate"));
      }
    } catch {
      toast.error(t("failedRegenerate"));
    } finally {
      setRegenerating(false);
    }
  }

  async function handleDelete() {
    setDeleteDialogOpen(false);
    setDeleting(true);
    try {
      const res = await fetch("/api/keys", { method: "DELETE" });
      if (res.ok) {
        setKeyData(keyData ? { ...keyData, apiKey: "" } : null);
        setRevealed(false);
        toast.success(t("keyDeleted"));
      } else {
        toast.error(t("failedDelete"));
      }
    } catch {
      toast.error(t("failedDelete"));
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-6 w-32 mb-1" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-48 w-full rounded-[14px]" />
        <Skeleton className="h-64 w-full rounded-[14px]" />
      </div>
    );
  }

  const hasSubscription = !!keyData?.plan;
  const hasKey = !!keyData?.apiKey;
  const maskedKey = hasKey ? maskKey(keyData!.apiKey) : "";

  function getSnippets(apiKey: string, masked: string) {
    return {
      "claude-code": {
        displayCode: `export ANTHROPIC_AUTH_TOKEN=${masked}\nexport ANTHROPIC_BASE_URL=${BASE_URL}`,
        copyCode: `export ANTHROPIC_AUTH_TOKEN=${apiKey}\nexport ANTHROPIC_BASE_URL=${BASE_URL}`,
      },
      curl: {
        displayCode: `curl ${BASE_URL}/v1/chat/completions \\\n  -H "Authorization: Bearer ${masked}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model":"claude-sonnet-4-6",\n       "messages":[{"role":"user","content":"Hello"}]}'`,
        copyCode: `curl ${BASE_URL}/v1/chat/completions \\\n  -H "Authorization: Bearer ${apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model":"claude-sonnet-4-6","messages":[{"role":"user","content":"Hello"}]}'`,
      },
      python: {
        displayCode: `from openai import OpenAI\n\nclient = OpenAI(\n    api_key="${masked}",\n    base_url="${BASE_URL}/v1"\n)\n\nresponse = client.chat.completions.create(\n    model="claude-sonnet-4-6",\n    messages=[{"role": "user", "content": "Hello"}]\n)`,
        copyCode: `from openai import OpenAI\n\nclient = OpenAI(\n    api_key="${apiKey}",\n    base_url="${BASE_URL}/v1"\n)\n\nresponse = client.chat.completions.create(\n    model="claude-sonnet-4-6",\n    messages=[{"role": "user", "content": "Hello"}]\n)`,
      },
    };
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">{t("title")}</h1>
        <p className="text-xs text-zinc-500 mt-0.5">{t("subtitle")}</p>
      </div>

      {/* No subscription */}
      {!hasSubscription && (
        <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="text-[15px] font-semibold text-zinc-200 mb-1">{t("noSubscription")}</h2>
          <p className="text-[13px] text-zinc-500 mb-4 max-w-sm mx-auto">
            {t("noSubscriptionDesc")}
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[13px] font-medium hover:bg-violet-500/20 transition-colors"
          >
            {t("viewPlans")} <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Has subscription but no key */}
      {hasSubscription && !hasKey && (
        <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-[15px] font-semibold text-zinc-200 mb-1">{t("generateTitle")}</h2>
          <p className="text-[13px] text-zinc-500 mb-4 max-w-sm mx-auto">
            {t("generateDesc")}
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[13px] font-medium hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
            {generating ? tc("generating") : t("generateButton")}
          </button>
        </div>
      )}

      {/* Has key — full management */}
      {hasKey && (
        <>
          {/* Key card */}
          <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Key className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-[13px] font-semibold text-zinc-200">{t("defaultKey")}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-zinc-500">{tc("active")}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRevealed(!revealed)}
                  className="p-1.5 rounded-md hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  title={revealed ? tc("hide") : tc("reveal")}
                >
                  {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => copyText(keyData!.apiKey, "key")}
                  className="p-1.5 rounded-md hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  title={t("copyKey")}
                >
                  {copied === "key" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setResetDialogOpen(true)}
                  disabled={regenerating}
                  className="p-1.5 rounded-md hover:bg-amber-500/10 text-amber-400/70 hover:text-amber-400 border border-amber-500/20 transition-colors cursor-pointer disabled:opacity-40"
                  title={t("regenerate")}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={deleting}
                  className="p-1.5 rounded-md hover:bg-red-500/10 text-red-400/70 hover:text-red-400 border border-red-500/20 transition-colors cursor-pointer disabled:opacity-40"
                  title={t("deleteKey")}
                >
                  {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span className="text-[11px] font-medium px-0.5">✕</span>}
                </button>
              </div>
            </div>

            {/* Key display */}
            <div className="rounded-[10px] border border-white/[0.04] bg-[#0c0c0e] px-4 py-2.5 font-mono text-[13px] text-zinc-400 tracking-wide select-all">
              {revealed ? keyData!.apiKey : maskedKey}
            </div>
          </div>

          {/* API Endpoint info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-zinc-500 font-medium">{t("baseUrl")}</p>
                <p className="text-[12px] text-zinc-300 font-mono truncate">{BASE_URL}</p>
              </div>
              <button
                onClick={() => copyText(BASE_URL, "base-url")}
                className="p-1.5 rounded-md hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer flex-shrink-0"
              >
                {copied === "base-url" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-zinc-500 font-medium">{t("compatibility")}</p>
                <p className="text-[12px] text-zinc-300">{t("compatibilityDesc")}</p>
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5">
            <h2 className="text-[13px] font-semibold text-zinc-200 mb-4">{tc("quickStart")}</h2>

            <div className="flex gap-5 border-b border-white/[0.04] mb-4">
              {SNIPPET_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setCopied(null); }}
                  className={`pb-2 text-[12px] font-medium cursor-pointer transition-colors ${
                    activeTab === tab.key
                      ? "text-zinc-200 border-b-2 border-violet-400"
                      : "text-zinc-600 border-b-2 border-transparent hover:text-zinc-400"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative group">
              <pre className="rounded-lg border border-white/[0.04] bg-[#0a0a0c] px-4 py-3 text-[12px] font-mono leading-relaxed overflow-x-auto text-zinc-400">
                {revealed
                  ? getSnippets(keyData!.apiKey, maskedKey)[activeTab].copyCode
                  : getSnippets(keyData!.apiKey, maskedKey)[activeTab].displayCode
                }
              </pre>
              <button
                onClick={() => copyText(getSnippets(keyData!.apiKey, maskedKey)[activeTab].copyCode, "code")}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-white/[0.03] hover:bg-white/[0.06] text-zinc-600 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                title={tc("copy")}
              >
                {copied === "code" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Prompt Generator */}
          <PromptGenerator apiKey={keyData!.apiKey} />
        </>
      )}

      {/* Regenerate Key Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("regenerateTitle")}</DialogTitle>
            <DialogDescription>
              {t("regenerateDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <button
              onClick={() => setResetDialogOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer"
            >
              {tc("cancel")}
            </button>
            <button
              onClick={handleRegenerate}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              {t("regenerate")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Key Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("deleteDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer"
            >
              {tc("cancel")}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              {t("deleteKey")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
