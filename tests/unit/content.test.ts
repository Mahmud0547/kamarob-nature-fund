import { describe, expect, it } from "vitest";
import { normalize, readingMinutes, relatedPosts, search, snippet, weeklyCounts, type SearchItem } from "@/lib/content";

const item = (title: string, text: string): SearchItem => ({ kind: "news", title, text, href: `/${title}` });
const items = [item("Springs and water", "We map the springs of the gorge."), item("Trails", "Safe walking routes and water points."), item("Report", "Annual report.")];

describe("search", () => {
  it("finds items that contain every word, title matches first", () => {
    expect(search(items, "water").map((i) => i.title)).toEqual(["Springs and water", "Trails"]);
    expect(search(items, "water routes").map((i) => i.title)).toEqual(["Trails"]);
  });

  it("ignores case, extra spaces and ё", () => {
    expect(search([item("Ёлки у родника", "")], "  ЕЛКИ ")).toHaveLength(1);
  });

  it("finds nothing for an empty or one-letter query", () => {
    expect(search(items, "")).toEqual([]);
    expect(search(items, "a")).toEqual([]);
  });
});

describe("snippet", () => {
  it("shows text around the first word and strips Markdown", () => {
    const text = `${"word ".repeat(30)}**the spring** is here ${"more ".repeat(40)}`;
    const piece = snippet(text, "spring");
    expect(piece.startsWith("…")).toBe(true);
    expect(piece).toContain("the spring is here");
    expect(piece).not.toContain("*");
  });
});

it("normalize", () => expect(normalize(" Ёж  И\nЁлка ")).toBe("еж и елка"));

it("readingMinutes counts 200 words a minute, at least one", () => {
  expect(readingMinutes("one two")).toBe(1);
  expect(readingMinutes("w ".repeat(1000))).toBe(5);
});

describe("relatedPosts", () => {
  const post = (id: string, tags: string[], published_at: string) => ({ id, tags, published_at });
  const current = post("a", ["water", "trail"], "2026-09-01");
  it("prefers shared tags, then newer posts, and skips the post itself", () => {
    const others = [current, post("b", ["water"], "2026-09-02"), post("c", ["water", "trail"], "2026-08-01"), post("d", [], "2026-09-10")];
    expect(relatedPosts(current, others).map((p) => p.id)).toEqual(["c", "b", "d"]);
  });
});

describe("weeklyCounts", () => {
  it("puts each date in its week, oldest week first, and ignores old or future dates", () => {
    const now = new Date("2026-10-20T12:00:00Z");
    const counts = weeklyCounts(["2026-10-19T00:00:00Z", "2026-10-18T00:00:00Z", "2026-10-10T00:00:00Z", "2025-01-01T00:00:00Z", "2027-01-01T00:00:00Z"], 4, now);
    expect(counts.map((c) => c.count)).toEqual([0, 0, 1, 2]);
  });
});
