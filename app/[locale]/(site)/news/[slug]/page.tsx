import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SampleTag } from "@/components/DemoBanner";
import { Markdown } from "@/components/Markdown";
import { PostCard } from "@/components/PostCard";
import { ShareButtons } from "@/components/ShareButtons";
import { readingMinutes, relatedPosts } from "@/lib/content";
import { latestPosts, mediaUrl, postBySlug } from "@/lib/data";
import { SITE_URL } from "@/lib/env";
import { formatDate } from "@/lib/format";
import { format, getMessages, isLocale, localized, path } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/news/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await postBySlug(slug);
  return post ? { title: localized(post.title, locale), description: localized(post.summary, locale) } : {};
}

export default async function PostPage({ params }: PageProps<"/[locale]/news/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = await postBySlug(slug);
  if (!post) notFound();
  const m = getMessages(locale);
  const cover = mediaUrl(post.cover_path);
  const body = localized(post.body, locale);
  const title = localized(post.title, locale);
  const related = relatedPosts(post, await latestPosts(30));
  return (
    <article className="container-page max-w-3xl py-16 lg:py-24">
      <Link href={path(locale, "/news")} className="font-semibold text-juniper">← {m.news.back}</Link>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {post.is_sample && <SampleTag label={m.demo.sample} />}
        {post.visibility === "members" && <span className="text-sm font-semibold text-rust">{m.news.membersOnly}</span>}
      </div>
      <h1 className="mt-3 font-serif text-[clamp(32px,5vw,48px)] font-semibold leading-tight">{title}</h1>
      <p className="mt-3 text-soft">
        {format(m.news.published, { date: formatDate(post.published_at, locale) })} · {format(m.news.readTime, { minutes: readingMinutes(body) })}
      </p>
      {cover && <Image src={cover} alt="" width={1200} height={750} sizes="(min-width: 768px) 768px, 100vw" className="mt-8 aspect-[16/10] w-full rounded-3xl object-cover" />}
      <div className="prose-body mt-8 text-lg leading-relaxed">
        <Markdown source={body} />
      </div>
      <div className="mt-12 border-t border-line pt-6">
        <ShareButtons url={`${SITE_URL}${path(locale, `/news/${post.slug}`)}`} title={title} labels={m.news} />
      </div>
      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-16">
          <h2 id="related" className="font-serif text-2xl font-semibold">{m.news.related}</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{related.map((p) => <PostCard key={p.id} post={p} locale={locale} />)}</div>
        </section>
      )}
    </article>
  );
}
