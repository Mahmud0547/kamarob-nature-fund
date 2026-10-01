import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../env";

/**
 * Refreshes the Supabase session on every request (the official @supabase/ssr pattern): refreshed cookies are written
 * both to the request, so server components in this request see them, and to the response, so the browser stores them.
 */
export async function updateSession(request: NextRequest, requestHeaders: Headers): Promise<NextResponse> {
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  if (!SUPABASE_URL) return response;
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        requestHeaders.set("cookie", request.cookies.toString());
        response = NextResponse.next({ request: { headers: requestHeaders } });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}
