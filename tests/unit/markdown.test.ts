import { describe, expect, it } from "vitest";
import { parseBlocks, parseInline } from "@/lib/markdown";

describe("parseBlocks", () => {
  it("reads headings, paragraphs, lists and quotes", () => {
    const blocks = parseBlocks("## Title\n\nFirst line\nsame paragraph\n\n- one\n- two\n\n1. a\n2. b\n\n> quote");
    expect(blocks.map((b) => b.type)).toEqual(["h2", "p", "ul", "ol", "quote"]);
    expect(blocks[1]).toMatchObject({ text: "First line same paragraph" });
    expect(blocks[2]).toMatchObject({ items: ["one", "two"] });
  });
});

describe("parseInline", () => {
  it("reads bold, italic and links", () => {
    expect(parseInline("a **b** *c* [d](https://e.org)")).toEqual([
      { type: "text", text: "a " },
      { type: "strong", text: "b" },
      { type: "text", text: " " },
      { type: "em", text: "c" },
      { type: "text", text: " " },
      { type: "link", text: "d", href: "https://e.org" },
    ]);
  });

  it("keeps HTML as plain text", () => {
    expect(parseInline("<script>alert(1)</script>")).toEqual([{ type: "text", text: "<script>alert(1)</script>" }]);
  });

  it("refuses javascript: and other unsafe links", () => {
    expect(parseInline("[x](javascript:alert(1))")).toEqual([{ type: "text", text: "x" }]);
    expect(parseInline("[x](/en/news)")).toEqual([{ type: "link", text: "x", href: "/en/news" }]);
  });
});
