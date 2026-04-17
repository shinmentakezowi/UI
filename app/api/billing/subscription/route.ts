import { NextResponse } from "next/server";
import { MOCK_PLAN_KEY } from "@/lib/mock-data";

export async function GET() {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setMonth(expiresAt.getMonth() + 1);
  return NextResponse.json({
    plan: MOCK_PLAN_KEY,
    status: "active",
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: expiresAt.toISOString(),
  });
}
