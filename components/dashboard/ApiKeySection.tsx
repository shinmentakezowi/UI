"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import {
  CreditCard,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { maskKey } from "@/lib/format";
import type { KeyData } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hapuppy.com";

type SetupTab = "claude-code" | "curl";

interface ApiKeySectionProps {
  loading: boolean;
  keyData: KeyData | null;
  onKeyChange: (data: KeyData | null) => void;
}

export function ApiKeySection({ loading, keyData, onKeyChange }: ApiKeySectionProps) {
  const t = useTranslations("apiKeySection");
  const tc = useTranslations("common");
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<SetupTab>("claude-code");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  async function copyText(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleRegenerate() {
    setResetDialogOpen(false);
    setRegenerating(true);
    try {
      const res = await fetch("/api/keys", { method: "POST" });
      if (res.ok) {
        onKeyChange(await res.json());
        toast.success("API key regenerated");
      } else {
        toast.error("Failed to regenerate key");
      }
    } catch {
      toast.error("Failed to regenerate key");
    } finally {
      setRegenerating(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/keys/provision", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.apiKey) {
        onKeyChange(keyData ? { ...keyData, apiKey: data.apiKey } : { apiKey: data.apiKey, plan: "free" });
        toast.success("API key generated");
      } else {
        toast.error(data.detail || data.error || "Failed to generate key");
      }
    } catch {
      toast.error("Failed to generate key");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete() {
    setDeleteDialogOpen(false);
    setDeleting(true);
    try {
      const res = await fetch("/api/keys", { method: "DELETE" });
      if (res.ok) {
        onKeyChange(keyData ? { ...keyData, apiKey: "" } : null);
        setRevealed(false);
        toast.success("API key deleted");
      } else {
        toast.error("Failed to delete key");
      }
    } catch {
      toast.error("Failed to delete key");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 w-16" />
          <div className="flex items-center gap-1">
            <Skeleton className="w-7 h-7 rounded-md" />
            <Skeleton className="w-7 h-7 rounded-md" />
            <Skeleton className="w-7 h-7 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-10 w-full rounded-[10px] mb-3" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    );
  }

  const hasSubscription = !!keyData?.plan;
  const hasKey = !!keyData?.apiKey;

  if (!hasSubscription) {
    return (
      <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5 flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
          <CreditCard className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-zinc-200">{t("noSubscription")}</p>
          <p className="text-[12px] text-zinc-500 mt-0.5">{t("noSubscriptionDesc")}</p>
        </div>
        <Link
          href="/dashboard/billing"
          className="flex-shrink-0 px-3.5 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[12px] font-medium hover:bg-violet-500/20 transition-colors whitespace-nowrap"
        >
          {t("subscribe")}
        </Link>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5 flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-zinc-200">{t("subscriptionActive")}</p>
          <p className="text-[12px] text-zinc-500 mt-0.5">{t("subscriptionActiveDesc")}</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex-shrink-0 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[12px] font-medium hover:bg-emerald-500/20 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin inline" /> : t("generateKey")}
        </button>
      </div>
    );
  }

  const maskedKey = maskKey(keyData.apiKey);
  const snippets: Record<SetupTab, { label: string; displayCode: string; copyCode: string }> = {
    "claude-code": {
      label: "Claude Code",
      displayCode: `export ANTHROPIC_AUTH_TOKEN=${maskedKey}\nexport ANTHROPIC_BASE_URL=${BASE_URL}`,
      copyCode: `export ANTHROPIC_AUTH_TOKEN=${keyData.apiKey}\nexport ANTHROPIC_BASE_URL=${BASE_URL}`,
    },
    curl: {
      label: "cURL",
      displayCode: `curl ${BASE_URL}/v1/chat/completions \\\n  -H "Authorization: Bearer ${maskedKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model":"claude-sonnet-4-6","messages":[{"role":"user","content":"Hello"}]}'`,
      copyCode: `curl ${BASE_URL}/v1/chat/completions \\\n  -H "Authorization: Bearer ${keyData.apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model":"claude-sonnet-4-6","messages":[{"role":"user","content":"Hello"}]}'`,
    },
  };

  return (
    <>
      <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-semibold text-zinc-200">{t("apiKey")}</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setRevealed(!revealed)}
              className="p-1.5 rounded-md hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              title={revealed ? tc("hide") : tc("reveal")}
            >
              {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => copyText(keyData.apiKey, "key")}
              className="p-1.5 rounded-md hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              title={tc("copy")}
            >
              {copied === "key" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setResetDialogOpen(true)}
              disabled={regenerating}
              className="p-1.5 rounded-md hover:bg-amber-500/10 text-amber-400/70 hover:text-amber-400 border border-amber-500/20 transition-colors cursor-pointer disabled:opacity-40"
              title={t("regenerateKey")}
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

        <div className="rounded-[10px] border border-white/[0.04] bg-[#0c0c0e] px-4 py-2.5 font-mono text-[13px] text-zinc-400 tracking-wide mb-3 select-all">
          {revealed ? keyData.apiKey : maskedKey}
        </div>

        <div className="flex gap-5 border-b border-white/[0.04] mb-3">
          {(Object.keys(snippets) as SetupTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCopied(null); }}
              className={`pb-2 text-[12px] font-medium cursor-pointer transition-colors ${
                activeTab === tab
                  ? "text-zinc-200 border-b-2 border-violet-400"
                  : "text-zinc-600 border-b-2 border-transparent hover:text-zinc-400"
              }`}
            >
              {snippets[tab].label}
            </button>
          ))}
        </div>

        <div className="relative group">
          <pre className="rounded-lg border border-white/[0.04] bg-[#0a0a0c] px-4 py-3 text-[12px] font-mono leading-relaxed overflow-x-auto text-zinc-400">
            {revealed ? snippets[activeTab].copyCode : snippets[activeTab].displayCode}
          </pre>
          <button
            onClick={() => copyText(snippets[activeTab].copyCode, "code")}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-white/[0.03] hover:bg-white/[0.06] text-zinc-600 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            title={tc("copy")}
          >
            {copied === "code" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

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
              Cancel
            </button>
            <button
              onClick={handleRegenerate}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              Regenerate
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Key Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API Key?</DialogTitle>
            <DialogDescription>
              Your key will be permanently deleted. You can generate a new one at any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              Delete Key
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
