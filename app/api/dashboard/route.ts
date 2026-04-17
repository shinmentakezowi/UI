import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_API_KEY, MOCK_PLAN_KEY, MOCK_DAILY_CREDITS, MOCK_USED_TODAY,
  MOCK_REQUESTS_TODAY, buildMockLogs, buildMockHistory, buildModelBreakdown,
  nextResetAt,
} from "@/lib/mock-data";
import { PLAN_TIERS } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const days = [1, 3, 7].includes(Number(params.get("days"))) ? Number(params.get("days")) : 1;
  const logsPageSize = Math.min(100, Math.max(1, Number(params.get("logsPageSize")) || 10));

  const planConfig = PLAN_TIERS[MOCK_PLAN_KEY];
  const dailyCredits = MOCK_DAILY_CREDITS;
  const subTotal = dailyCredits;
  const subUsed = MOCK_USED_TODAY;

  const keys = { apiKey: MOCK_API_KEY };

  const history = buildMockHistory(days);
  const promptTokens = 52_341;
  const completionTokens = 18_922;

  const usage = {
    today: {
      requests: MOCK_REQUESTS_TODAY,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      credits: subUsed,
    },
    history,
    credits: {
      used: subUsed,
      daily: dailyCredits,
      remaining: Math.max(0, subTotal - subUsed),
      subTotal,
      subUsed,
    },
    limits: { rpm: planConfig?.rpm || 100 },
    plan: {
      name: planConfig?.name || "Standard",
      tier: MOCK_PLAN_KEY,
    },
    reservoir: dailyCredits > 0 ? { dailyAccrual: dailyCredits, nextResetAt: nextResetAt() } : null,
    modelBreakdown: buildModelBreakdown(),
  };

  const logs = buildMockLogs(logsPageSize);

  return NextResponse.json({ keys, usage, logs });
}
