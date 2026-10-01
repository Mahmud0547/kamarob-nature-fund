import { parseBlocks, parseInline } from "@/lib/markdown";

function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((part, i) => {
        if (part.type === "strong") return <strong key={i}>{part.text}</strong>;
        if (part.type === "em") return <em key={i}>{part.text}</em>;
        if (part.type === "link") {
          const external = /^https?:/i.test(part.href);
          return <a key={i} href={part.href} {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}>{part.text}</a>;
        }
        return <span key={i}>{part.text}</span>;
      })}
    </>
  );
}

/** Renders post text. React escapes every string, so the output can contain only these elements. */
export function Markdown({ source }: { source: string }) {
  return (
    <>
      {parseBlocks(source).map((block, i) => {
        switch (block.type) {
          case "h2": return <h2 key={i}><Inline text={block.text} /></h2>;
          case "h3": return <h3 key={i}><Inline text={block.text} /></h3>;
          case "quote": return <blockquote key={i}><Inline text={block.text} /></blockquote>;
          case "ul": return <ul key={i}>{block.items.map((item, j) => <li key={j}><Inline text={item} /></li>)}</ul>;
          case "ol": return <ol key={i}>{block.items.map((item, j) => <li key={j}><Inline text={item} /></li>)}</ol>;
          default: return <p key={i}><Inline text={block.text} /></p>;
        }
      })}
    </>
  );
}
