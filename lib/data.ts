/** Read queries. Row Level Security decides what the current visitor may see; these functions never filter by role. */

import { SUPABASE_URL } from "./env";
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
