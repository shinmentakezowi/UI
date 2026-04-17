"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Copy, Check, ChevronDown, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

type Tool = "claude-code" | "openclaw";
type OS = "macos" | "windows" | "linux";

interface AvailableModel {
  id: string;
  provider: string;
  providerName: string;
  inputWeight: number | null;
  outputWeight: number | null;
}

interface ModelSpec {
  contextWindow: number;
  maxTokens: number;
  reasoning: boolean;
  input: string[];
}

// Known model specifications
// contextWindow = max input context, maxTokens = max output tokens
const MODEL_SPECS: Record<string, ModelSpec> = {
  // Anthropic
  "claude-opus-4-6":              { contextWindow: 200000, maxTokens: 32000, reasoning: true, input: ["text", "image"] },
  "claude-sonnet-4-6":            { contextWindow: 200000, maxTokens: 16000, reasoning: true, input: ["text", "image"] },
  "claude-haiku-4-5-20251001":    { contextWindow: 200000, maxTokens: 8192, reasoning: false, input: ["text", "image"] },
  "claude-sonnet-4-5-20250514":   { contextWindow: 200000, maxTokens: 16000, reasoning: true, input: ["text", "image"] },
  // OpenAI
  "gpt-4.1":                      { contextWindow: 1047576, maxTokens: 32768, reasoning: false, input: ["text", "image"] },
  "gpt-4.1-mini":                 { contextWindow: 1047576, maxTokens: 32768, reasoning: false, input: ["text", "image"] },
  "gpt-4.1-nano":                 { contextWindow: 1047576, maxTokens: 32768, reasoning: false, input: ["text", "image"] },
  "gpt-4o":                       { contextWindow: 128000, maxTokens: 16384, reasoning: false, input: ["text", "image"] },
  "gpt-4o-mini":                  { contextWindow: 128000, maxTokens: 16384, reasoning: false, input: ["text", "image"] },
  "o1":                           { contextWindow: 200000, maxTokens: 100000, reasoning: true, input: ["text", "image"] },
  "o1-mini":                      { contextWindow: 128000, maxTokens: 65536, reasoning: true, input: ["text"] },
  "o1-pro":                       { contextWindow: 200000, maxTokens: 100000, reasoning: true, input: ["text", "image"] },
  "o3":                           { contextWindow: 200000, maxTokens: 100000, reasoning: true, input: ["text", "image"] },
  "o3-mini":                      { contextWindow: 200000, maxTokens: 100000, reasoning: true, input: ["text"] },
  "o3-pro":                       { contextWindow: 200000, maxTokens: 100000, reasoning: true, input: ["text", "image"] },
  "o4-mini":                      { contextWindow: 200000, maxTokens: 100000, reasoning: true, input: ["text", "image"] },
  "chatgpt-4o-latest":            { contextWindow: 128000, maxTokens: 16384, reasoning: false, input: ["text", "image"] },
  // Google Gemini
  "gemini-2.5-pro":               { contextWindow: 1048576, maxTokens: 65536, reasoning: true, input: ["text", "image"] },
  "gemini-2.5-flash":             { contextWindow: 1048576, maxTokens: 65536, reasoning: true, input: ["text", "image"] },
  "gemini-2.0-flash":             { contextWindow: 1048576, maxTokens: 8192, reasoning: false, input: ["text", "image"] },
  "gemini-2.5-pro-preview-06-05": { contextWindow: 1048576, maxTokens: 65536, reasoning: true, input: ["text", "image"] },
  "gemini-2.5-flash-preview-05-20": { contextWindow: 1048576, maxTokens: 65536, reasoning: true, input: ["text", "image"] },
  // xAI
  "grok-3":                       { contextWindow: 131072, maxTokens: 131072, reasoning: false, input: ["text"] },
  "grok-3-mini":                  { contextWindow: 131072, maxTokens: 131072, reasoning: true, input: ["text"] },
  "grok-3-fast":                  { contextWindow: 131072, maxTokens: 131072, reasoning: false, input: ["text"] },
  "grok-3-mini-fast":             { contextWindow: 131072, maxTokens: 131072, reasoning: true, input: ["text"] },
  // DeepSeek
  "deepseek-chat":                { contextWindow: 65536, maxTokens: 8192, reasoning: false, input: ["text"] },
  "deepseek-reasoner":            { contextWindow: 65536, maxTokens: 8192, reasoning: true, input: ["text"] },
  // Mistral
  "mistral-large-latest":         { contextWindow: 128000, maxTokens: 8192, reasoning: false, input: ["text"] },
  "mistral-small-latest":         { contextWindow: 128000, maxTokens: 8192, reasoning: false, input: ["text"] },
  "codestral-latest":             { contextWindow: 256000, maxTokens: 8192, reasoning: false, input: ["text"] },
  "magistral-medium-latest":      { contextWindow: 40000, maxTokens: 40000, reasoning: true, input: ["text"] },
  "magistral-small-latest":       { contextWindow: 40000, maxTokens: 40000, reasoning: true, input: ["text"] },
  // Qwen
  "qwen-max":                     { contextWindow: 32768, maxTokens: 8192, reasoning: false, input: ["text"] },
  "qwen-plus":                    { contextWindow: 131072, maxTokens: 8192, reasoning: false, input: ["text"] },
  "qwen-turbo":                   { contextWindow: 131072, maxTokens: 8192, reasoning: false, input: ["text"] },
  "qwq-plus":                     { contextWindow: 131072, maxTokens: 16384, reasoning: true, input: ["text"] },
  // Cohere
  "command-a":                    { contextWindow: 256000, maxTokens: 8192, reasoning: false, input: ["text"] },
  "command-r-plus":               { contextWindow: 128000, maxTokens: 4096, reasoning: false, input: ["text"] },
  "command-r":                    { contextWindow: 128000, maxTokens: 4096, reasoning: false, input: ["text"] },
  // Perplexity
  "sonar-pro":                    { contextWindow: 200000, maxTokens: 8192, reasoning: false, input: ["text"] },
  "sonar":                        { contextWindow: 128000, maxTokens: 8192, reasoning: false, input: ["text"] },
  "sonar-reasoning-pro":          { contextWindow: 200000, maxTokens: 8192, reasoning: true, input: ["text"] },
  "sonar-reasoning":              { contextWindow: 128000, maxTokens: 8192, reasoning: true, input: ["text"] },
};

// Fallback specs based on provider when exact model ID is not in the map
const PROVIDER_FALLBACK: Record<string, ModelSpec> = {
  ANTHROPIC:  { contextWindow: 200000, maxTokens: 8192, reasoning: false, input: ["text", "image"] },
  OPENAI:     { contextWindow: 128000, maxTokens: 16384, reasoning: false, input: ["text", "image"] },
  GOOGLE:     { contextWindow: 1048576, maxTokens: 8192, reasoning: false, input: ["text", "image"] },
  XAI:        { contextWindow: 131072, maxTokens: 131072, reasoning: false, input: ["text"] },
  DEEPSEEK:   { contextWindow: 65536, maxTokens: 8192, reasoning: false, input: ["text"] },
  MISTRAL:    { contextWindow: 128000, maxTokens: 8192, reasoning: false, input: ["text"] },
  META:       { contextWindow: 128000, maxTokens: 4096, reasoning: false, input: ["text"] },
  ALIBABA:    { contextWindow: 131072, maxTokens: 8192, reasoning: false, input: ["text"] },
  COHERE:     { contextWindow: 128000, maxTokens: 4096, reasoning: false, input: ["text"] },
  PERPLEXITY: { contextWindow: 128000, maxTokens: 8192, reasoning: false, input: ["text"] },
};

const DEFAULT_SPEC: ModelSpec = { contextWindow: 128000, maxTokens: 8192, reasoning: false, input: ["text"] };

function getModelSpec(id: string, provider: string): ModelSpec {
  if (MODEL_SPECS[id]) return MODEL_SPECS[id];
  for (const [key, spec] of Object.entries(MODEL_SPECS)) {
    if (id.startsWith(key) || key.startsWith(id)) return spec;
  }
  return PROVIDER_FALLBACK[provider] ?? DEFAULT_SPEC;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hapuppy.com";

interface ModelSlots {
  opus: string;
  sonnet: string;
  haiku: string;
}

interface SlotSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: AvailableModel[];
  placeholder: string;
  disabled?: boolean;
}

function SlotSelect({ value, onChange, options, placeholder, disabled }: SlotSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filtered = search
    ? options.filter((m) => m.id.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => { setOpen((v) => !v); setSearch(""); }}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] cursor-pointer hover:bg-white/[0.05] transition-colors disabled:opacity-50 ${
          value ? "text-zinc-300" : "text-zinc-600"
        }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`w-3 h-3 text-zinc-500 flex-shrink-0 ml-1 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[180px] rounded-lg border border-white/[0.06] bg-[#1a1a1c] shadow-xl overflow-hidden">
          <div className="p-1.5 border-b border-white/[0.04]">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                autoFocus
                className="w-full pl-6 pr-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.04] text-[11px] text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-violet-500/30"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-44 p-1">
            {/* Clear option */}
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); setSearch(""); }}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors ${
                !value ? "bg-violet-500/15 text-violet-300" : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-400"
              }`}
            >
              {placeholder}
            </button>
            {filtered.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => { onChange(m.id); setOpen(false); setSearch(""); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] cursor-pointer transition-colors flex items-center gap-1.5 ${
                  value === m.id
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-300"
                }`}
              >
                {value === m.id && <Check className="w-2.5 h-2.5 flex-shrink-0" />}
                <span className="truncate">{m.id}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-3 text-[11px] text-zinc-600 text-center">No models</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Build OpenClaw model entry JSON for a single model
function buildOCModelEntry(
  id: string,
  modelMap: Map<string, AvailableModel>,
): string {
  const m = modelMap.get(id);
  const spec = getModelSpec(id, m?.provider ?? "OTHER");
  const inputCost = m?.inputWeight ?? 0;
  const outputCost = m?.outputWeight ?? 0;
  const shortName = id.split("/").pop() ?? id;
  return JSON.stringify(
    {
      id,
      name: shortName,
      reasoning: spec.reasoning,
      input: spec.input,
      contextWindow: spec.contextWindow,
      maxTokens: spec.maxTokens,
      cost: { input: inputCost, output: outputCost, cacheRead: 0, cacheWrite: 0 },
    },
    null,
    2,
  ).replace(/^/gm, "        "); // indent inside the models array
}

function generatePrompt(
  tool: Tool,
  os: OS,
  models: string[],
  apiKey: string,
  locale: string,
  modelMap: Map<string, AvailableModel>,
  slots?: ModelSlots,
): string {
  const isZh = locale === "zh";
  const settingsDir = os === "windows" ? "%USERPROFILE%\\.claude" : "~/.claude";
  const settingsFile = `${settingsDir}/settings.json`;
  const openclawDir = os === "windows" ? "%USERPROFILE%\\.openclaw" : "~/.openclaw";
  const openclawConfig = `${openclawDir}/openclaw.json`;

  if (tool === "claude-code") {
    // Build slot env lines
    const slotLines: string[] = [];
    if (slots?.opus)   slotLines.push(`    "ANTHROPIC_DEFAULT_OPUS_MODEL": "${slots.opus}"`);
    if (slots?.sonnet) slotLines.push(`    "ANTHROPIC_DEFAULT_SONNET_MODEL": "${slots.sonnet}"`);
    if (slots?.haiku)  slotLines.push(`    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "${slots.haiku}"`);

    const envBlock = [
      `    "ANTHROPIC_AUTH_TOKEN": "${apiKey}"`,
      `    "ANTHROPIC_BASE_URL": "${BASE_URL}"`,
      ...slotLines,
    ].join(",\n");

    const exampleJson = `{
  "env": {
${envBlock}
  }
}`;

    if (isZh) {
      return `请帮我配置 Claude Code 使用 Hapuppy API 代理。

## 目标文件
${settingsFile}

## 操作说明
读取该文件（若不存在则创建），将 env 字段中的以下键值合并进去，保留文件中其他已有字段不变。

## 期望结果（仅展示 env 相关部分，其余字段照旧保留）
\`\`\`json
${exampleJson}
\`\`\`

## 注意事项
- 只修改 env 字段内的上述键，不删除 env 中其他已有环境变量
- 保持 JSON 格式合法，不要添加注释
- 写入完成后，输出最终的 settings.json 内容供我核对`;
    }

    return `Please help me configure Claude Code to use the Hapuppy API proxy.

## Target file
${settingsFile}

## Instructions
Read the file (create if missing), then merge the following keys into the env field, keeping all other existing fields intact.

## Expected result (showing only the env-relevant portion; keep everything else as-is)
\`\`\`json
${exampleJson}
\`\`\`

## Notes
- Only add/update the keys listed above inside env; do not remove other existing env variables
- Keep the JSON valid — no comments
- After writing, print the final contents of settings.json for me to verify`;
  }

  // OpenClaw
  const modelsEntries = models
    .map((id) => buildOCModelEntry(id, modelMap))
    .join(",\n");

  const aliasEntries = models
    .map((id) => {
      const short = id.split("/").pop() ?? id;
      // Generate a compact alias: strip version suffixes and shorten
      const alias = short
        .replace(/-\d{8}$/, "")       // remove date suffix like -20250514
        .replace(/-latest$/, "")      // remove -latest
        .replace(/^(claude|gemini|gpt)-/, "$1-") // keep prefix
        .slice(0, 24);
      return `    "hapuppy/${id}": { "alias": "${alias}" }`;
    })
    .join(",\n");

  const exampleJson = `{
  "models": {
    "providers": {
      "hapuppy": {
        "baseUrl": "${BASE_URL}/v1",
        "apiKey": "${apiKey}",
        "api": "openai-completions",
        "models": [
${modelsEntries}
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "models": {
${aliasEntries}
      }
    }
  }
}`;

  if (isZh) {
    return `请帮我配置 OpenClaw 使用 Hapuppy API 代理。

## 目标文件
${openclawConfig}

## 操作说明
读取该文件（若不存在则创建），将下方 JSON 示例中的内容**深度合并**进去：
- 在 models.providers 中新增 hapuppy provider（若已存在则更新）
- 在 agents.defaults.models 中新增各模型别名（若已存在则更新）
- **不要修改** agents.defaults.model 的 primary 或 fallbacks 字段
- 保留文件中所有其他已有字段

## 期望合并的内容（JSON 结构示例）
\`\`\`json
${exampleJson}
\`\`\`

## 注意事项
- models.providers.hapuppy.models 中每个模型的字段必须按示例完整填写
- JSON 必须合法，不要添加注释
- 写入完成后，输出最终的 openclaw.json 内容供我核对`;
  }

  return `Please help me configure OpenClaw to use the Hapuppy API proxy.

## Target file
${openclawConfig}

## Instructions
Read the file (create if missing), then **deep-merge** the content below:
- Add the hapuppy provider under models.providers (update if it already exists)
- Add model alias entries under agents.defaults.models (update if they exist)
- **Do NOT modify** agents.defaults.model primary or fallbacks
- Keep all other existing fields intact

## Content to merge (JSON structure example)
\`\`\`json
${exampleJson}
\`\`\`

## Notes
- Each model entry inside models.providers.hapuppy.models must include all fields shown above
- Keep the JSON valid — no comments
- After writing, print the final contents of openclaw.json for me to verify`;
}

export default function PromptGenerator({
  apiKey,
}: {
  apiKey: string;
}) {
  const t = useTranslations("promptGenerator");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [tool, setTool] = useState<Tool>("claude-code");
  const [os, setOS] = useState<OS>("macos");
  // selectedModels is only used by OpenClaw
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [slots, setSlots] = useState<ModelSlots>({ opus: "", sonnet: "", haiku: "" });
  const [models, setModels] = useState<AvailableModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const modelMap = useMemo(() => {
    const map = new Map<string, AvailableModel>();
    for (const m of models) map.set(m.id, m);
    return map;
  }, [models]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  useEffect(() => {
    fetch("/api/models/available")
      .then((r) => r.json())
      .then((data) => {
        if (data.models) setModels(data.models);
      })
      .catch(() => {})
      .finally(() => setLoadingModels(false));
  }, []);

  // Chat models only (used for CC slot options and OC model list)
  const chatModels = useMemo(() => {
    return models.filter(
      (m) =>
        !m.id.includes("embedding") &&
        !m.id.includes("tts") &&
        !m.id.includes("whisper") &&
        !m.id.includes("moderation") &&
        !m.id.includes("imagen") &&
        !m.id.includes("gpt-image") &&
        !m.id.includes("dall-e") &&
        !m.id.includes("flux-") &&
        !m.id.includes("midjourney") &&
        !m.id.includes("recraft"),
    );
  }, [models]);

  // Filtered + grouped for OpenClaw dropdown
  const filteredModels = useMemo(() => {
    if (!search) return chatModels;
    const q = search.toLowerCase();
    return chatModels.filter((m) => m.id.toLowerCase().includes(q));
  }, [chatModels, search]);

  const groupedModels = useMemo(() => {
    const map = new Map<string, AvailableModel[]>();
    for (const m of filteredModels) {
      const list = map.get(m.providerName) ?? [];
      list.push(m);
      map.set(m.providerName, list);
    }
    return Array.from(map.entries());
  }, [filteredModels]);

  function toggleModel(id: string) {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  }

  function removeModel(id: string) {
    setSelectedModels((prev) => prev.filter((m) => m !== id));
  }

  // CC: show prompt as long as any slot is set OR unconditionally (just env vars)
  // OC: show prompt only when models are selected
  const ccModelsForPrompt: string[] = []; // CC doesn't need a model list in the prompt
  const hasPrompt =
    tool === "claude-code"
      ? true
      : selectedModels.length > 0;

  const prompt = hasPrompt
    ? generatePrompt(
        tool,
        os,
        tool === "claude-code" ? ccModelsForPrompt : selectedModels,
        apiKey,
        locale,
        modelMap,
        tool === "claude-code" ? slots : undefined,
      )
    : "";

  async function handleCopy() {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success(tc("copied"));
    setTimeout(() => setCopied(false), 2000);
  }

  const toolOptions: { key: Tool; label: string }[] = [
    { key: "claude-code", label: "Claude Code" },
    { key: "openclaw", label: "OpenClaw" },
  ];

  const osOptions: { key: OS; label: string }[] = [
    { key: "macos", label: "macOS" },
    { key: "linux", label: "Linux" },
    { key: "windows", label: "Windows" },
  ];

  return (
    <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h2 className="text-[13px] font-semibold text-zinc-200">
            {t("title")}
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">{t("subtitle")}</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Tool selection */}
        <div>
          <label className="text-[11px] font-medium text-zinc-500 mb-1.5 block">
            {t("tool")}
          </label>
          <div className="flex gap-2">
            {toolOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setTool(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                  tool === opt.key
                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                    : "bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-400 hover:bg-white/[0.05]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* OS selection */}
        <div>
          <label className="text-[11px] font-medium text-zinc-500 mb-1.5 block">
            {t("os")}
          </label>
          <div className="flex gap-2">
            {osOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setOS(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                  os === opt.key
                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                    : "bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-400 hover:bg-white/[0.05]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Claude Code: slot mapping only */}
        {tool === "claude-code" && (
          <div>
            <label className="text-[11px] font-medium text-zinc-500 mb-1.5 block">
              {t("modelSlots")}
              <span className="ml-1 text-zinc-600 font-normal">{t("modelSlotsHint")}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["opus", "sonnet", "haiku"] as const).map((slot) => (
                <div key={slot}>
                  <div className="text-[10px] text-zinc-600 mb-1 uppercase tracking-wider">{slot}</div>
                  <SlotSelect
                    value={slots[slot]}
                    onChange={(v) => setSlots((prev) => ({ ...prev, [slot]: v }))}
                    options={chatModels}
                    placeholder={t("slotDefault")}
                    disabled={loadingModels}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OpenClaw: model multi-select */}
        {tool === "openclaw" && (
          <div>
            <label className="text-[11px] font-medium text-zinc-500 mb-1.5 block">
              {t("model")}
              {selectedModels.length > 0 && (
                <span className="ml-1.5 text-violet-400">
                  ({t("selected", { count: selectedModels.length })})
                </span>
              )}
            </label>

            {/* Selected model tags */}
            {selectedModels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedModels.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-[11px] text-violet-300"
                  >
                    {id}
                    <button
                      onClick={() => removeModel(id)}
                      className="hover:text-violet-100 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                disabled={loadingModels}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[12px] cursor-pointer hover:bg-white/[0.05] transition-colors disabled:opacity-50"
              >
                <span className="text-zinc-600">
                  {loadingModels ? t("loadingModels") : t("selectModel")}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/[0.06] bg-[#1a1a1c] shadow-xl max-h-64 overflow-hidden">
                  <div className="p-2 border-b border-white/[0.04]">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("searchModel")}
                        className="w-full pl-7 pr-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.04] text-[12px] text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-violet-500/30"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="overflow-y-auto max-h-48 p-1">
                    {groupedModels.length === 0 ? (
                      <div className="px-3 py-4 text-[11px] text-zinc-600 text-center">
                        {t("noModels")}
                      </div>
                    ) : (
                      groupedModels.map(([provider, providerModels]) => (
                        <div key={provider}>
                          <div className="px-3 py-1.5 text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                            {provider}
                          </div>
                          {providerModels.map((m) => {
                            const checked = selectedModels.includes(m.id);
                            return (
                              <button
                                key={m.id}
                                onClick={() => toggleModel(m.id)}
                                className={`w-full flex items-center gap-2 text-left px-3 py-1.5 rounded-md text-[12px] cursor-pointer transition-colors ${
                                  checked
                                    ? "bg-violet-500/15 text-violet-300"
                                    : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-300"
                                }`}
                              >
                                <span
                                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                                    checked
                                      ? "bg-violet-500/30 border-violet-500/50"
                                      : "border-white/[0.1]"
                                  }`}
                                >
                                  {checked && <Check className="w-2.5 h-2.5" />}
                                </span>
                                {m.id}
                              </button>
                            );
                          })}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generated prompt */}
        {hasPrompt && (
          <div className="mt-4">
            <label className="text-[11px] font-medium text-zinc-500 mb-1.5 block">
              {t("generatedPrompt")}
            </label>
            <div className="relative group">
              <pre className="rounded-lg border border-white/[0.04] bg-[#0a0a0c] px-4 py-3 text-[12px] font-mono leading-relaxed overflow-x-auto text-zinc-400 whitespace-pre-wrap">
                {prompt}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-white/[0.03] hover:bg-white/[0.06] text-zinc-600 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                title={tc("copy")}
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-zinc-600 mt-2">
              {t("hint")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
