import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    referralCode: "DEMO1234",
    referralCount: 3,
    referralCredits: 250_000,
    referralHistoryCredits: 1_200_000,
  });
}
