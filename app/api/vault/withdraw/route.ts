import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { amount } = await request.json().catch(() => ({ amount: 0 }));
  if (!amount || amount < 1000) {
    return NextResponse.json({ error: "Minimum withdrawal is 1,000 credits" }, { status: 400 });
  }
  return NextResponse.json({ success: true, withdrawn: amount });
}
