import { CopyLinkButton } from "./CopyLinkButton";

/** Share links that work without any third-party script: Telegram, WhatsApp, Facebook and "copy link". */
export function ShareButtons({ url, title, labels }: { url: string; title: string; labels: { share: string; copyLink: string; copied: string } }) {
  const u = encodeURIComponent(url);
  const text = encodeURIComponent(title);
  const targets = [
    ["Telegram", `https://t.me/share/url?url=${u}&text=${text}`],
    ["WhatsApp", `https://wa.me/?text=${text}%20${u}`],
    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${u}`],
  ] as const;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-soft">{labels.share}:</span>
      {targets.map(([name, href]) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-juniper hover:text-juniper">
          {name}
        </a>
      ))}
      <CopyLinkButton url={url} label={labels.copyLink} done={labels.copied} />
    </div>
  );
}
