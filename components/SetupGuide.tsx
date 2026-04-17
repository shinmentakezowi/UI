"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Terminal } from "lucide-react";

interface SetupGuideProps {
  apiKey: string;
  baseUrl: string;
}

type Tab = "claude-code" | "cursor";

export function SetupGuide({ apiKey, baseUrl }: SetupGuideProps) {
  const [activeTab, setActiveTab] = useState<Tab>("claude-code");
  const [copied, setCopied] = useState(false);

  const prefix = "sk-hapuppy-";
  const maskedKey = apiKey.length > prefix.length + 4
    ? prefix + "****" + apiKey.slice(-4)
    : apiKey;

  const snippets: Record<Tab, { label: string; displayCode: string; copyCode: string }> = {
    "claude-code": {
      label: "Claude Code",
      displayCode: `# Add to your shell profile (.bashrc, .zshrc, etc.)
export ANTHROPIC_BASE_URL=${baseUrl}
export ANTHROPIC_AUTH_TOKEN=${maskedKey}

# Then use Claude Code as normal
claude`,
      copyCode: `# Add to your shell profile (.bashrc, .zshrc, etc.)
export ANTHROPIC_BASE_URL=${baseUrl}
export ANTHROPIC_AUTH_TOKEN=${apiKey}

# Then use Claude Code as normal
claude`,
    },
    cursor: {
      label: "Cursor",
      displayCode: `# In Cursor Settings > Models > OpenAI API Key:
#
# API Key: ${maskedKey}
# Base URL: ${baseUrl}/v1
#
# Then select any Claude model from the model list.`,
      copyCode: `# In Cursor Settings > Models > OpenAI API Key:
#
# API Key: ${apiKey}
# Base URL: ${baseUrl}/v1
#
# Then select any Claude model from the model list.`,
    },
  };

  async function handleCopy() {
    await navigator.clipboard.writeText(snippets[activeTab].copyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/[0.08] border border-cyan-500/15 flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          Quick Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-[#0c0c10] border border-zinc-800/60 mb-4">
          {(Object.keys(snippets) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCopied(false);
              }}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {snippets[tab].label}
            </button>
          ))}
        </div>

        {/* Code block */}
        <div className="relative code-block">
          <pre className="p-5 text-sm font-mono leading-7 overflow-x-auto">
            <code className="text-zinc-300">{snippets[activeTab].displayCode}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 transition-all duration-200 cursor-pointer"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
