import { NextResponse } from "next/server";
import { MOCK_API_KEY, MOCK_PLAN_KEY } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ apiKey: MOCK_API_KEY, plan: MOCK_PLAN_KEY });
}

export async function POST() {
  return NextResponse.json({ apiKey: MOCK_API_KEY });
}

export async function DELETE() {
  return NextResponse.json({ deleted: true });
}
