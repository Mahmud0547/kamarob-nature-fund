import { NextResponse, type NextRequest } from "next/server";
import { contentSecurityPolicy } from "@/lib/csp";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { updateSession } from "@/lib/supabase/proxy";

/** Picks a language for "/" from Accept-Language: Russian and Tajik speakers land on their version. */
function preferredLocale(request: NextRequest): Locale {
  for (const part of (request.headers.get("accept-language") ?? "").split(",")) {
    const code = part.trim().slice(0, 2).toLowerCase();
    if (code === "tg") return "tj";
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  // "/" shows the home page in the visitor's language without a redirect, so crawlers (and Search Console
  // verification) get a real page at the site root.
  const rewriteRoot = pathname === "/";
  if (!rewriteRoot && !isLocale(first) && !pathname.startsWith("/auth/") && !pathname.startsWith("/api/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}${pathname}`;
    return NextResponse.redirect(url);
  }

  const nonce = btoa(crypto.randomUUID());
  const csp = contentSecurityPolicy(nonce, process.env.NODE_ENV === "development");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = await updateSession(request, requestHeaders, rewriteRoot ? `/${preferredLocale(request)}` : undefined);
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|media/|favicon|icon|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|webp|mp4|ico|pdf)$).*)",
      missing: [{ type: "header", key: "next-router-prefetch" }, { type: "header", key: "purpose", value: "prefetch" }],
    },
  ],
};
