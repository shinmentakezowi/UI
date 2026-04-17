import { NextResponse } from "next/server";
import { MOCK_API_KEY } from "@/lib/mock-data";

export async function POST() {
  return NextResponse.json({ apiKey: MOCK_API_KEY });
}
