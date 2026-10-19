import { latestPosts } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { getMessages, htmlLang, isLocale, localized, path } from "@/lib/i18n";

const escapeXml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** News as an RSS feed, one per language. Only public posts: a feed reader is never logged in. */
export async function GET(_request: Request, { params }: RouteContext<"/[locale]/rss.xml">) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  const m = getMessages(locale);
  const posts = (await latestPosts(30)).filter((p) => p.visibility === "public");
  const items = posts
    .map((p) => {
      const link = `${SITE_URL}${path(locale, `/news/${p.slug}`)}`;
      return `    <item>
      <title>${escapeXml(localized(p.title, locale))}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(localized(p.summary, locale))}</description>
      ${p.published_at ? `<pubDate>${new Date(p.published_at).toUTCString()}</pubDate>` : ""}
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Kamarob · ${escapeXml(m.news.title)}</title>
    <link>${SITE_URL}${path(locale, "/news")}</link>
    <description>${escapeXml(m.news.lead)}</description>
    <language>${htmlLang[locale]}</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
}
