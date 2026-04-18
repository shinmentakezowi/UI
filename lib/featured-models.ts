export interface FeaturedModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  badge?: string;
  capabilities: string[];
  context: string;
}

export const FEATURED_MODELS: FeaturedModel[] = [
  {
    id: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    provider: "Anthropic",
    description:
      "Anthropic's most capable model. State-of-the-art coding, reasoning, and agentic performance.",
    badge: "MOST CAPABLE",
    capabilities: ["Coding", "Reasoning", "Agentic"],
    context: "1M",
  },
  {
    id: "gpt-5.4",
    name: "GPT-5.4",
    provider: "OpenAI",
    description:
      "OpenAI's latest frontier model with advanced reasoning, multimodal understanding, and tool use.",
    capabilities: ["Multimodal", "Reasoning", "Tool Use"],
    context: "1M",
  },
  {
    id: "gemini-3.1",
    name: "Gemini 3.1",
    provider: "Google",
    description:
      "Google's next-generation model with massive context window and native multimodal capabilities.",
    capabilities: ["Multimodal", "Long Context", "Code"],
    context: "1M",
  },
  {
    id: "glm-5",
    name: "GLM-5",
    provider: "Zhipu",
    description:
      "Zhipu AI's flagship model with strong bilingual capabilities and competitive coding performance.",
    capabilities: ["Bilingual", "Coding", "8h+ Tasks"],
    context: "200K",
  },
  {
    id: "grok-4.2",
    name: "grok-4.2",
    provider: "xAI",
    description:
      "xAI's most powerful model with real-time web access and breakthrough STEM reasoning.",
    capabilities: ["Web Access", "STEM", "Low Hallucination"],
    context: "2M",
  },
];
