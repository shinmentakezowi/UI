import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code } = await request.json().catch(() => ({ code: "" }));
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }
  // Pretend every code adds 1M credits to the vault.
  return NextResponse.json({
    success: true,
    type: "credits",
    credits: 1_000_000,
    message: "1,000,000 credits added to your vault",
  });
}
