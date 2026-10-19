/** Small pure helpers for content: search, reading time and related news. No database access here. */

export interface SearchItem {
  kind: "news" | "document" | "programme";
  title: string;
  text: string;
  href: string;
}

/** Lower case, "ё" as "е", any run of spaces as one: so "Ёлка" finds "елка" and extra spaces do not matter. */
export function normalize(text: string): string {
  return text.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
}

/**
 * Items that contain every word of the query, best first: a word in the title counts three times
 * more than a word in the text. An empty query finds nothing.
 */
export function search(items: SearchItem[], query: string, limit = 30): SearchItem[] {
  const words = normalize(query).split(" ").filter((w) => w.length > 1);
  if (words.length === 0) return [];
  const scored = items.flatMap((item) => {
    const title = normalize(item.title);
    const text = normalize(item.text);
    if (!words.every((w) => title.includes(w) || text.includes(w))) return [];
    const score = words.reduce((sum, w) => sum + (title.includes(w) ? 3 : 0) + (text.includes(w) ? 1 : 0), 0);
    return [{ item, score }];
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.item);
}

/** A short piece of `text` around the first query word, for the search results. */
export function snippet(text: string, query: string, length = 160): string {
  const clean = text.replace(/[#*_>`[\]()]/g, "").replace(/\s+/g, " ").trim();
  const first = normalize(query).split(" ").find((w) => w.length > 1) ?? "";
  const at = first ? normalize(clean).indexOf(first) : -1;
  const start = Math.max(0, at - 40);
  const piece = clean.slice(start, start + length);
  return `${start > 0 ? "…" : ""}${piece}${start + length < clean.length ? "…" : ""}`;
}

/** Minutes to read at 200 words a minute, at least one. */
export function readingMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Other posts that share the most tags with `post`; ties go to the newer one. */
export function relatedPosts<T extends { id: string; tags: string[]; published_at: string | null }>(post: T, others: T[], limit = 3): T[] {
  return others
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, shared: p.tags.filter((tag) => post.tags.includes(tag)).length }))
    .sort((a, b) => b.shared - a.shared || (b.p.published_at ?? "").localeCompare(a.p.published_at ?? ""))
    .slice(0, limit)
    .map((x) => x.p);
}

/** Sign-ups per week for the last `weeks` weeks, oldest first. `now` is passed in so tests are stable. */
export function weeklyCounts(dates: string[], weeks: number, now: Date): { start: Date; count: number }[] {
  const week = 7 * 24 * 60 * 60 * 1000;
  const end = now.getTime();
  const buckets = Array.from({ length: weeks }, (_, i) => ({ start: new Date(end - (weeks - i) * week), count: 0 }));
  for (const date of dates) {
    const age = end - Date.parse(date);
    if (Number.isNaN(age) || age < 0 || age >= weeks * week) continue;
    buckets[weeks - 1 - Math.floor(age / week)]!.count++;
  }
  return buckets;
}
