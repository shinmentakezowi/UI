// Model type definitions and provider detection.

export interface Model {
  id: string;
  provider: string;
}

export interface ModelPricing {
  id: string;
  inputWeight: number;
  outputWeight: number;
  cost_type: "per_token" | "fixed";
  base_cost: number;
}

export interface ModelsData {
  models: Model[];
  pricing: Map<string, ModelPricing>;
}

export const PROVIDER_DISPLAY: Record<string, string> = {
  ANTHROPIC:  "Anthropic",
  OPENAI:     "OpenAI",
  GOOGLE:     "Google Gemini",
  XAI:        "xAI",
  MISTRAL:    "Mistral AI",
  META:       "Meta Llama",
  DEEPSEEK:   "DeepSeek",
  ALIBABA:    "Qwen",
  ZHIPU:      "Zhipu AI",
  MOONSHOT:   "Moonshot AI",
  COHERE:     "Cohere",
  PERPLEXITY: "Perplexity AI",
  OTHER:      "Other",
};

export const PROVIDER_ORDER = [
  "ANTHROPIC", "OPENAI", "GOOGLE", "XAI",
  "DEEPSEEK", "MISTRAL", "META", "ALIBABA",
  "ZHIPU", "MOONSHOT", "COHERE", "PERPLEXITY", "OTHER",
];

export type ModelType = "chat" | "image" | "embedding" | "speech" | "transcription" | "moderation" | "other";

export const MODEL_TYPE_DISPLAY: Record<ModelType, string> = {
  chat: "Chat",
  image: "Image",
  embedding: "Embedding",
  speech: "Speech",
  transcription: "Transcription",
  moderation: "Moderation",
  other: "Other",
};

export const MODEL_TYPE_ORDER: ModelType[] = [
  "chat", "image", "embedding", "speech", "transcription", "moderation", "other",
];

export function detectModelType(id: string): ModelType {
  const l = id.toLowerCase();
  if (l.includes("embedding") || l.startsWith("text-embedding")) return "embedding";
  if (l.includes("tts") || l === "tts-1" || l === "tts-1-hd") return "speech";
  if (l.includes("whisper") || l.includes("transcribe")) return "transcription";
  if (l.includes("moderation") || l.startsWith("omni-moderation")) return "moderation";
  if (
    l.includes("imagen") || l.includes("gpt-image") ||
    l.includes("flux-") || l.includes("midjourney") ||
    l.includes("recraft") || l.includes("dall-e")
  ) return "image";
  return "chat";
}

export function detectProvider(id: string): string {
  const l = id.toLowerCase();
  if (l.includes("claude")) return "ANTHROPIC";
  if (
    l.includes("gpt") || l.includes("chatgpt") ||
    l.startsWith("o1") || l.startsWith("o3") || l.startsWith("o4") ||
    l.includes("codex")
  ) return "OPENAI";
  if (l.includes("gemini") || l.includes("gemma") || l.includes("imagen")) return "GOOGLE";
  if (l.includes("grok")) return "XAI";
  if (l.includes("deepseek") || l.includes("r1-1776")) return "DEEPSEEK";
  if (l.includes("mistral") || l.includes("codestral") || l.includes("ministral") || l.includes("pixtral") || l.includes("magistral")) return "MISTRAL";
  if (l.includes("llama") || l.includes("meta-llama")) return "META";
  if (l.includes("qwen") || l.includes("qwq") || l.includes("qvq")) return "ALIBABA";
  if (l.includes("glm") || l.includes("chatglm") || l.includes("zhipu")) return "ZHIPU";
  if (l.includes("moonshot") || l.includes("kimi")) return "MOONSHOT";
  if (l.includes("command") || l.includes("cohere")) return "COHERE";
  if (l.includes("sonar") || l.includes("perplexity")) return "PERPLEXITY";
  return "OTHER";
}

export async function fetchModelsData(): Promise<ModelsData> {
  const { MOCK_MODELS } = await import("./mock-data");
  const models: Model[] = MOCK_MODELS.map((id) => ({ id, provider: detectProvider(id) }));
  const pricing = new Map<string, ModelPricing>(
    MOCK_MODELS.map((id) => [id, {
      id,
      inputWeight: 1,
      outputWeight: 3,
      cost_type: "per_token" as const,
      base_cost: 0,
    }])
  );
  return { models, pricing };
}

/** Groups models by provider key, in canonical order. */
export function groupByProvider(models: Model[]): Array<{ key: string; name: string; models: Model[] }> {
  const map = new Map<string, Model[]>();
  for (const m of models) {
    const list = map.get(m.provider) ?? [];
    list.push(m);
    map.set(m.provider, list);
  }

  return PROVIDER_ORDER
    .filter(p => map.has(p))
    .map(p => ({
      key:    p,
      name:   PROVIDER_DISPLAY[p] ?? p,
      models: map.get(p)!,
    }));
}
