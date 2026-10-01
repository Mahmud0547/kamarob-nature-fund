import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { updateSession } from "@/lib/supabase/proxy";

/** Picks a language for "/" from Accept-Language: Russian and Tajik speakers land on their version. */
function preferredLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.trim().slice(0, 2).toLowerCase();
    if (code === "tg") return "tj";
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (!isLocale(first) && !pathname.startsWith("/auth/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }
  return updateSession(request, NextResponse.next({ request }));
}

export const config = {
  // Everything except static files and images.
  matcher: ["/((?!_next/static|_next/image|media/|favicon|icon|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|webp|mp4|ico)$).*)"],
};
