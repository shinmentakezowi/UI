export const MOCK_API_KEY = "sk-hapuppy-demo-1234567890abcdef";
export const MOCK_PLAN_KEY = "standard"; // "free" | "lite" | "standard" | "pro"

export const MOCK_DAILY_CREDITS = 4_000_000;
export const MOCK_USED_TODAY = 183_472;
export const MOCK_REQUESTS_TODAY = 42;
export const MOCK_VAULT_BALANCE = 15_000_000;

export const MOCK_MODELS = [
  "claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5",
  "gpt-5.4", "gpt-5.4-mini", "o4", "o3-pro",
  "gemini-3.1-pro", "gemini-3.1-flash",
  "grok-4.2", "grok-4.2-fast",
  "deepseek-v3.2", "deepseek-r1-1776",
  "qwen-3-max", "glm-5", "kimi-k2",
  "mistral-large-2510", "llama-4-405b",
  "command-a-plus", "sonar-pro",
];

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
