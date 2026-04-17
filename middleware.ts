import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse, type NextRequest } from "next/server";

function detectLocaleFromIP(request: NextRequest): string | null {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");
  if (!country) return null;
  return country === "CN" ? "zh" : "en";
}

const intlMiddleware = createIntlMiddleware({
  ...routing,
  localeDetection: false,
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/") || pathname.startsWith("/auth/")) {
    return NextResponse.next();
  }

  const hasLocaleCookie = request.cookies.has("NEXT_LOCALE");
  const hasLocalePrefix = /^\/(zh|en)(\/|$)/.test(pathname);
  if (!hasLocaleCookie && !hasLocalePrefix) {
    const ipLocale = detectLocaleFromIP(request);
    if (ipLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${ipLocale}${pathname === "/" ? "" : pathname}`;
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.cookies.set("NEXT_LOCALE", ipLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
      return redirectResponse;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|auth|_next|favicon|.*\\..*).*)"],
};
