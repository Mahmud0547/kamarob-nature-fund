/**
 * A small Markdown subset for news posts: ## and ### headings, paragraphs, - and 1. lists, > quotes,
 * **bold**, *italic* and [links](https://…). It produces data, not HTML, so editor text can never inject markup.
 */

export type Inline = { type: "text" | "strong" | "em"; text: string } | { type: "link"; text: string; href: string };
export type Block =
  | { type: "h2" | "h3" | "p" | "quote"; text: string }
  | { type: "ul" | "ol"; items: string[] };

export function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of source.replace(/\r\n/g, "\n").split(/\n{2,}/)) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    const first = lines[0]!;
    if (first.startsWith("### ")) blocks.push({ type: "h3", text: first.slice(4) });
    else if (first.startsWith("## ")) blocks.push({ type: "h2", text: first.slice(3) });
    else if (lines.every((l) => /^[-*] /.test(l))) blocks.push({ type: "ul", items: lines.map((l) => l.slice(2)) });
    else if (lines.every((l) => /^\d+\. /.test(l))) blocks.push({ type: "ol", items: lines.map((l) => l.replace(/^\d+\. /, "")) });
    else if (lines.every((l) => l.startsWith(">"))) blocks.push({ type: "quote", text: lines.map((l) => l.replace(/^>\s?/, "")).join(" ") });
    else blocks.push({ type: "p", text: lines.join(" ") });
  }
  return blocks;
}

const SAFE_HREF = /^(https?:\/\/|mailto:|\/(?!\/))/i;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) out.push({ type: "text", text: text.slice(last, index) });
    if (match[1] !== undefined) out.push({ type: "strong", text: match[1] });
    else if (match[2] !== undefined) out.push({ type: "em", text: match[2] });
    else if (match[3] !== undefined) {
      const href = match[4] ?? "";
      out.push(SAFE_HREF.test(href) ? { type: "link", text: match[3], href } : { type: "text", text: match[3] });
    }
    last = index + match[0].length;
  }
  if (last < text.length) out.push({ type: "text", text: text.slice(last) });
  return out;
}
