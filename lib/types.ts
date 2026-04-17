export interface KeyData {
  apiKey: string;
  plan: string;
}

export interface UsageData {
  today: {
    requests: number;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    credits: number;
  };
  credits: { used: number; daily: number; remaining: number; subTotal?: number; subUsed?: number };
  limits: { rpm: number };
  modelBreakdown: { model: string; credits: number }[];
  history?: { date: string; requests: number; tokens: number; credits: number }[];
  plan?: { name: string; tier: string } | null;
  reservoir?: { dailyAccrual: number; nextResetAt: string } | null;
}

export interface LogEntry {
  model: string;
  promptTokens: number;
  completionTokens: number;
  cacheTokens: number;
  credits: number;
  createdAt: number;
}
