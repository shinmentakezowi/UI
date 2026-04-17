import { NextResponse } from "next/server";
import { MOCK_VAULT_BALANCE } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ balance: MOCK_VAULT_BALANCE });
}
