export const MOCK_API_KEY = "sk-hapuppy-demo-1234567890abcdef";
export const MOCK_PLAN_KEY = "standard"; // "free" | "lite" | "standard" | "pro"

export const MOCK_DAILY_CREDITS = 4_000_000;
export const MOCK_USED_TODAY = 183_472;
export const MOCK_REQUESTS_TODAY = 42;
export const MOCK_VAULT_BALANCE = 15_000_000;

export const MOCK_MODELS = [
  // Anthropic Claude
  "claude-3-5-haiku-20241022", "claude-3-7-sonnet-20250219", "claude-sonnet-4-20250514",
  "claude-opus-4-20250514", "claude-opus-4-1-20250805", "claude-opus-4-5-20251101",
  "claude-sonnet-4-5-20250929", "claude-sonnet-4-5", "claude-haiku-4-5-20251001",
  "claude-opus-4-6", "claude-opus-4-7", "claude-sonnet-4-6",
  
  // OpenAI
  "gpt-4o-mini", "gpt-4o", "gpt-4.1-nano", "gpt-4.1-mini", "gpt-4.1",
  "chatgpt-4o-latest", "gpt-5-nano", "gpt-5.4-nano", "gpt-5-mini", "gpt-5.4-mini",
  "gpt-5", "gpt-5.1", "gpt-5.2", "gpt-5.3-chat-latest", "gpt-5.4",
  "gpt-5-codex", "gpt-5.1-codex", "gpt-5.2-codex", "gpt-5.3-codex",
  "o1", "o3-mini", "o3", "o4-mini",
  
  // Google Gemini
  "gemini-2.0-flash", "gemini-2.5-flash-lite-preview-06-17", "gemini-2.5-flash",
  "gemini-2.5-pro", "gemini-3.1-pro-preview", "gemini-3-flash-preview",
  "gemini-3.1-flash-lite-preview", "gemma-3n-e4b-it",
  
  // DeepSeek
  "r1-1776", "deepseek-v3", "deepseek-v3.1", "deepseek-v3.2",
  "deepseek-r1", "deepseek-r1t2-chimera",
  
  // Mistral AI
  "magistral-medium-latest", "magistral-small-latest", "mistral-large-latest",
  "mistral-medium-latest", "mistral-small-latest", "ministral-3b-latest", "ministral-8b-latest",
  
  // Meta Llama
  "llama-4-scout-17b-16e-instruct", "llama-4-maverick-17b-128e-instruct",
  
  // Qwen
  "qwq-32b", "qwen3-235b-a22b-instruct", "qwen3-coder-480b-a35b-instruct",
  
  // Zhipu AI
  "glm-5", "glm-5.1", "glm-4.7", "glm-4.6", "glm-4.5-air", "glm-4.5",
  
  // Moonshot AI
  "kimi-k2-instruct", "kimi-k2.5",
  
  // Perplexity AI
  "sonar", "sonar-pro", "sonar-reasoning", "sonar-reasoning-pro", "sonar-deep-research",
  
  // Other
  "umbra", "mimo-v2-flash",
];

export const MODEL_SPECS: Record<string, { context: string; description: string }> = {
  // Anthropic Claude
  "claude-3-5-haiku-20241022": {
    context: "200K",
    description: "Fast, efficient model optimized for quick responses and high throughput"
  },
  "claude-3-7-sonnet-20250219": {
    context: "200K",
    description: "First hybrid reasoning model with strong coding capabilities"
  },
  "claude-sonnet-4-20250514": {
    context: "1M",
    description: "Enhanced Sonnet with improved reasoning and coding abilities"
  },
  "claude-opus-4-20250514": {
    context: "1M",
    description: "Powerful model with advanced reasoning and complex task handling"
  },
  "claude-opus-4-1-20250805": {
    context: "1M",
    description: "Upgraded Opus with enhanced performance across all benchmarks"
  },
  "claude-opus-4-5-20251101": {
    context: "1M",
    description: "Top-tier model with extended thinking and strongest capabilities"
  },
  "claude-sonnet-4-5-20250929": {
    context: "200K",
    description: "Balanced performance with strong coding and reasoning (1M beta)"
  },
  "claude-sonnet-4-5": {
    context: "1M",
    description: "Latest Sonnet with improved efficiency and 1M context window"
  },
  "claude-haiku-4-5-20251001": {
    context: "200K",
    description: "Fast, efficient model optimized for quick responses"
  },
  "claude-opus-4-6": {
    context: "1M",
    description: "Top-tier model with extended thinking, strongest coding and reasoning"
  },
  "claude-opus-4-7": {
    context: "1M",
    description: "Latest flagship with breakthrough reasoning and coding capabilities"
  },
  "claude-sonnet-4-6": {
    context: "1M",
    description: "Balanced performance with strong coding, computer use, and reasoning"
  },
  
  // OpenAI
  "gpt-4o-mini": {
    context: "128K",
    description: "Fast, affordable model for everyday tasks and quick responses"
  },
  "gpt-4o": {
    context: "128K",
    description: "Multimodal flagship with strong vision and text capabilities"
  },
  "gpt-4.1-nano": {
    context: "1M",
    description: "Ultra-efficient model with large context window"
  },
  "gpt-4.1-mini": {
    context: "1M",
    description: "Compact model balancing speed and capability"
  },
  "gpt-4.1": {
    context: "128K",
    description: "Enhanced GPT-4 with improved reasoning and accuracy"
  },
  "chatgpt-4o-latest": {
    context: "128K",
    description: "Latest ChatGPT model with conversational optimizations"
  },
  "gpt-5-nano": {
    context: "128K",
    description: "Efficient GPT-5 variant for high-speed inference"
  },
  "gpt-5.4-nano": {
    context: "400K",
    description: "Ultra-fast model with extended context capabilities"
  },
  "gpt-5-mini": {
    context: "128K",
    description: "Compact GPT-5 with strong general capabilities"
  },
  "gpt-5.4-mini": {
    context: "400K",
    description: "Fast, efficient model with strong coding and computer use"
  },
  "gpt-5": {
    context: "128K",
    description: "Frontier model with advanced reasoning and problem solving"
  },
  "gpt-5.1": {
    context: "128K",
    description: "Enhanced GPT-5 with improved performance across benchmarks"
  },
  "gpt-5.2": {
    context: "128K",
    description: "Refined model with better accuracy and reliability"
  },
  "gpt-5.3-chat-latest": {
    context: "128K",
    description: "Conversational model with extended context handling"
  },
  "gpt-5.4": {
    context: "512K",
    description: "Frontier model optimized for complex professional work and coding"
  },
  "gpt-5-codex": {
    context: "128K",
    description: "Specialized for code generation and software development"
  },
  "gpt-5.1-codex": {
    context: "128K",
    description: "Enhanced coding model with improved accuracy"
  },
  "gpt-5.2-codex": {
    context: "128K",
    description: "Advanced coding model with better debugging capabilities"
  },
  "gpt-5.3-codex": {
    context: "128K",
    description: "Latest Codex with superior code understanding and generation"
  },
  "o1": {
    context: "200K",
    description: "Reasoning model with extended thinking for complex problems"
  },
  "o3-mini": {
    context: "200K",
    description: "Compact reasoning model for efficient problem solving"
  },
  "o3": {
    context: "200K",
    description: "Advanced reasoning model with tool access and visual understanding"
  },
  "o4-mini": {
    context: "200K",
    description: "Latest compact reasoning model with improved efficiency"
  },
  
  // Google Gemini
  "gemini-2.0-flash": {
    context: "1M",
    description: "Fast, efficient model with multimodal capabilities"
  },
  "gemini-2.5-flash-lite-preview-06-17": {
    context: "1M",
    description: "Lightweight variant optimized for speed and cost"
  },
  "gemini-2.5-flash": {
    context: "1M",
    description: "Enhanced Flash with improved performance and efficiency"
  },
  "gemini-2.5-pro": {
    context: "1M",
    description: "Pro-tier model with advanced reasoning and multimodal understanding"
  },
  "gemini-3.1-pro-preview": {
    context: "1M",
    description: "Advanced multimodal model with deep reasoning and agentic capabilities"
  },
  "gemini-3-flash-preview": {
    context: "1M",
    description: "Next-gen Flash with breakthrough speed and capability"
  },
  "gemini-3.1-flash-lite-preview": {
    context: "1M",
    description: "Ultra-efficient variant for high-throughput applications"
  },
  "gemma-3n-e4b-it": {
    context: "128K",
    description: "Open model optimized for instruction following"
  },
  
  // DeepSeek
  "r1-1776": {
    context: "128K",
    description: "Reasoning-focused model optimized for complex problem solving"
  },
  "deepseek-v3": {
    context: "128K",
    description: "Open-weights model with efficient sparse attention"
  },
  "deepseek-v3.1": {
    context: "128K",
    description: "Enhanced version with improved reasoning capabilities"
  },
  "deepseek-v3.2": {
    context: "128K",
    description: "Latest version with efficient sparse attention for long contexts"
  },
  "deepseek-r1": {
    context: "128K",
    description: "Reasoning model with strong problem-solving abilities"
  },
  "deepseek-r1t2-chimera": {
    context: "128K",
    description: "Hybrid reasoning model with enhanced capabilities"
  },
  
  // Mistral AI
  "magistral-medium-latest": {
    context: "128K",
    description: "Mid-tier model with balanced performance and efficiency"
  },
  "magistral-small-latest": {
    context: "128K",
    description: "Compact model optimized for speed and cost"
  },
  "mistral-large-latest": {
    context: "128K",
    description: "Flagship model with strong reasoning and coding abilities"
  },
  "mistral-medium-latest": {
    context: "128K",
    description: "Balanced model for general-purpose tasks"
  },
  "mistral-small-latest": {
    context: "128K",
    description: "Efficient model for everyday applications"
  },
  "ministral-3b-latest": {
    context: "128K",
    description: "Ultra-compact model for edge deployment"
  },
  "ministral-8b-latest": {
    context: "128K",
    description: "Small but capable model for resource-constrained environments"
  },
  
  // Meta Llama
  "llama-4-scout-17b-16e-instruct": {
    context: "128K",
    description: "Efficient Llama 4 MoE variant optimized for instruction following"
  },
  "llama-4-maverick-17b-128e-instruct": {
    context: "128K",
    description: "Advanced Llama 4 MoE with enhanced reasoning capabilities"
  },
  
  // Qwen
  "qwq-32b": {
    context: "32K",
    description: "Reasoning-focused model with strong problem-solving abilities"
  },
  "qwen3-235b-a22b-instruct": {
    context: "128K",
    description: "Large-scale MoE model with strong multilingual and coding capabilities"
  },
  "qwen3-coder-480b-a35b-instruct": {
    context: "128K",
    description: "Specialized coding MoE model with superior code generation"
  },
  
  // Zhipu AI
  "glm-5": {
    context: "128K",
    description: "Advanced reasoning model with efficient attention mechanisms"
  },
  "glm-5.1": {
    context: "128K",
    description: "Enhanced version with improved long-horizon task capabilities"
  },
  "glm-4.7": {
    context: "128K",
    description: "Latest GLM-4 with strong general capabilities"
  },
  "glm-4.6": {
    context: "128K",
    description: "Balanced model with good reasoning and coding abilities"
  },
  "glm-4.5-air": {
    context: "128K",
    description: "Lightweight variant optimized for efficiency"
  },
  "glm-4.5": {
    context: "128K",
    description: "Mid-tier model with strong multilingual support"
  },
  
  // Moonshot AI
  "kimi-k2-instruct": {
    context: "256K",
    description: "Long-context specialist with strong reasoning and tool use"
  },
  "kimi-k2.5": {
    context: "256K",
    description: "Enhanced multimodal version with native vision capabilities"
  },
  
  // Perplexity AI
  "sonar": {
    context: "128K",
    description: "Search-optimized model with real-time information access"
  },
  "sonar-pro": {
    context: "128K",
    description: "Advanced search model with enhanced accuracy and depth"
  },
  "sonar-reasoning": {
    context: "128K",
    description: "Reasoning-focused search model for complex queries"
  },
  "sonar-reasoning-pro": {
    context: "128K",
    description: "Premium reasoning model with deep research capabilities"
  },
  "sonar-deep-research": {
    context: "128K",
    description: "Specialized for comprehensive research and analysis"
  },
  
  // Other
  "umbra": {
    context: "128K",
    description: "Efficient general-purpose model for diverse tasks"
  },
  "mimo-v2-flash": {
    context: "256K",
    description: "Fast, open-source MoE model with 309B parameters"
  },
};

function todayOffset(daysAgo: number): number {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
  return Math.floor(d.getTime() / 1000);
}

export function buildMockLogs(count = 20) {
  return Array.from({ length: count }).map((_, i) => ({
    model: MOCK_MODELS[i % MOCK_MODELS.length],
    promptTokens: 1_200 + Math.floor(Math.random() * 8_000),
    completionTokens: 400 + Math.floor(Math.random() * 3_000),
    cacheTokens: Math.random() > 0.5 ? Math.floor(Math.random() * 5_000) : 0,
    credits: 100 + Math.floor(Math.random() * 9_000),
    createdAt: todayOffset(Math.floor(i / 6)),
  }));
}

export function buildMockHistory(days: number) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const out: { date: string; requests: number; tokens: number; credits: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    out.push({
      date: `${months[d.getMonth()]} ${d.getDate()}`,
      requests: 30 + Math.floor(Math.random() * 120),
      tokens: 50_000 + Math.floor(Math.random() * 800_000),
      credits: 80_000 + Math.floor(Math.random() * 400_000),
    });
  }
  return out;
}

export function buildModelBreakdown() {
  return MOCK_MODELS.slice(0, 8).map((model) => ({
    model,
    credits: 5_000 + Math.floor(Math.random() * 50_000),
  })).sort((a, b) => b.credits - a.credits);
}

export function nextResetAt(): string {
  const next = new Date();
  next.setUTCHours(16, 0, 0, 0);
  if (next <= new Date()) next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString();
}
