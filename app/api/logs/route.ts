import { NextRequest, NextResponse } from "next/server";
import { buildMockLogs } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const pageSize = Math.min(100, Math.max(1, Number(params.get("pageSize")) || 10));
  return NextResponse.json({ logs: buildMockLogs(pageSize) });
}
