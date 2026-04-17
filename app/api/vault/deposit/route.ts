import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { amount } = await request.json().catch(() => ({ amount: 0 }));
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Amount must be > 0" }, { status: 400 });
  }
  return NextResponse.json({ success: true, deposited: amount });
}
