import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { credits } = await request.json().catch(() => ({ credits: 0 }));
  if (!credits || credits <= 0) {
    return NextResponse.json({ error: "Invalid credits" }, { status: 400 });
  }
  return NextResponse.json({ success: true, transferred: credits });
}
