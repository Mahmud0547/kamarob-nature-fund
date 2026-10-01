import { describe, expect, it } from "vitest";
import { format, localized } from "@/lib/i18n";
import en from "@/messages/en.json";
import ru from "@/messages/ru.json";
import tj from "@/messages/tj.json";

function leaves(value: unknown, path = ""): [string, unknown][] {
  if (typeof value === "object" && value !== null) return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  return [[path, value]];
}
const placeholders = (text: unknown) => [...String(text).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const english = new Map(leaves(en));

describe.each([["ru", ru], ["tj", tj]])("messages/%s.json", (_name, dict) => {
  const entries = new Map(leaves(dict));
  it("has the same keys as English", () => expect([...entries.keys()].sort()).toEqual([...english.keys()].sort()));
  it("keeps every placeholder", () => {
    for (const [key, text] of entries) expect(placeholders(text), key).toEqual(placeholders(english.get(key)));
  });
  it("has no empty texts", () => {
    for (const [key, text] of entries) expect(String(text).trim(), key).not.toBe("");
  });
});

describe("localized", () => {
  it("falls back to English", () => {
    expect(localized({ en: "Hello", ru: "Привет" }, "tj")).toBe("Hello");
    expect(localized({ en: "Hello", ru: "Привет" }, "ru")).toBe("Привет");
    expect(localized(null, "en")).toBe("");
  });
});

it("format fills placeholders and leaves unknown ones", () => {
  expect(format("{a} and {b}", { a: 1 })).toBe("1 and {b}");
});

it("never presents invented facts from the old site", () => {
  const all = JSON.stringify([en, ru, tj]);
  for (const claim of ["12,000", "12 000", "320 volunteers", "48 villages", "17 springs"]) expect(all).not.toContain(claim);
});
