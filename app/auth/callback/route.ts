import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/dashboard";
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value ?? "zh";
  const localizedNext = next.startsWith("/") ? `/${locale}${next}` : next;
  return NextResponse.redirect(`${origin}${localizedNext}`);
}
