import { SUPABASE_URL } from "./env";

/**
 * Content-Security-Policy for one response. Scripts run only with this request's nonce (Next.js adds it to its own
 * scripts); the browser may talk only to this site and the Supabase project (REST, Storage and Realtime websockets).
 * Inline style attributes stay allowed because next/image and React set them; scripts are what an attacker needs.
 */
export function contentSecurityPolicy(nonce: string, dev: boolean): string {
  const supabase = SUPABASE_URL ? new URL(SUPABASE_URL) : null;
  const api = supabase ? `${supabase.origin} wss://${supabase.host}` : "";
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' blob: data: ${supabase?.origin ?? ""}`,
    "media-src 'self'",
    "font-src 'self'",
    `connect-src 'self' ${api}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}
