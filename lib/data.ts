/** Read queries. Row Level Security decides what the current visitor may see; these functions never filter by role. */

import { weeklyCounts, type SearchItem } from "./content";
import { SUPABASE_URL } from "./env";
import { getMessages, localized, path, type Locale } from "./i18n";
import { createClient } from "./supabase/server";

export async function latestPosts(limit = 6, kind?: "news" | "announcement") {
  const supabase = await createClient();
  let query = supabase.from("posts").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(limit);
  if (kind) query = query.eq("kind", kind);
  const { data } = await query;
  return data ?? [];
}

export async function postBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  return data;
}

export async function visibleDocuments() {
  const supabase = await createClient();
  const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

/** Public URL of an image in the "media" bucket, or a local file under /media. */
export function mediaUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("/")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/media/${path}`;
}

/** Everything the visitor may see, flattened for the site search (RLS still decides what comes back). */
export async function searchIndex(locale: Locale): Promise<SearchItem[]> {
  const supabase = await createClient();
  const [{ data: posts }, { data: documents }] = await Promise.all([
    supabase.from("posts").select("slug, title, summary, body").eq("status", "published").order("published_at", { ascending: false }).limit(200),
    supabase.from("documents").select("title, description, file_name, visibility").limit(200),
  ]);
  const programmes = getMessages(locale).programmes.items;
  return [
    ...(posts ?? []).map((p) => ({
      kind: "news" as const,
      title: localized(p.title, locale),
      text: `${localized(p.summary, locale)} ${localized(p.body, locale)}`,
      href: path(locale, `/news/${p.slug}`),
    })),
    ...(documents ?? []).map((d) => ({
      kind: "document" as const,
      title: localized(d.title, locale),
      text: `${localized(d.description, locale)} ${d.file_name}`,
      href: path(locale, d.visibility === "members" ? "/account/documents" : "/documents"),
    })),
    ...programmes.map((p) => ({ kind: "programme" as const, title: p.title, text: p.text, href: path(locale, "/programmes") })),
  ];
}

/** New member accounts per week for the admin chart (the demo admin only sees the sample members). */
export async function signupsByWeek(weeks = 8) {
  const now = new Date();
  const since = new Date(now.getTime() - weeks * 7 * 86_400_000).toISOString();
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("created_at").gte("created_at", since).limit(5000);
  return weeklyCounts((data ?? []).map((p) => p.created_at), weeks, now).map((w) => ({ start: w.start.toISOString(), count: w.count }));
}
