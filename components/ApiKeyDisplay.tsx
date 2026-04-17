"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Eye, EyeOff, RefreshCw, Key, Check } from "lucide-react";

interface ApiKeyDisplayProps {
  apiKey: string;
  baseUrl: string;
  onRegenerate: () => Promise<void>;
}

export function ApiKeyDisplay({
  apiKey,
  baseUrl,
  onRegenerate,
}: ApiKeyDisplayProps) {
  const [revealed, setRevealed] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState<"key" | "url" | null>(null);

  function maskKey(key: string) {
    const prefix = "sk-hapuppy-";
    if (key.length <= prefix.length + 4) return key;
    return prefix + "\u2022".repeat(8) + key.slice(-4);
  }

  async function copyToClipboard(text: string, type: "key" | "url") {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleRegenerate() {
    if (!confirm("Are you sure? Your current API key will be invalidated.")) {
      return;
    }
    setRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <Card className="border-violet-500/15 shadow-[0_0_20px_rgba(124,58,237,0.06)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/[0.08] border border-violet-500/15 flex items-center justify-center">
            <Key className="w-3.5 h-3.5 text-violet-400" />
          </div>
          API Credentials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key */}
        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
            API Key
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center rounded-lg border border-zinc-800 bg-[#0c0c10] px-4 py-2.5 font-mono text-sm text-zinc-300 overflow-hidden">
              <span className="flex-1 truncate select-all">
                {revealed ? apiKey : maskKey(apiKey)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRevealed(!revealed)}
              title={revealed ? "Hide" : "Reveal"}
            >
              {revealed ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(apiKey, "key")}
              title="Copy"
            >
              {copied === "key" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerating}
              title="Regenerate"
            >
              <RefreshCw
                className={`w-4 h-4 ${regenerating ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Base URL */}
        <div>
          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Base URL
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-zinc-800 bg-[#0c0c10] px-4 py-2.5 font-mono text-sm text-zinc-300 truncate">
              {baseUrl}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(baseUrl, "url")}
              title="Copy"
            >
              {copied === "url" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
