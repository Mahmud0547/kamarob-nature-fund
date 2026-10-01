import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { SampleTag } from "@/components/DemoBanner";
import { mediaUrl, postBySlug } from "@/lib/data";
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
  return (
    <article className="container-page max-w-3xl py-16 lg:py-24">
      <Link href={path(locale, "/news")} className="font-semibold text-juniper">← {m.news.back}</Link>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {post.is_sample && <SampleTag label={m.demo.sample} />}
        {post.visibility === "members" && <span className="text-sm font-semibold text-rust">{m.news.membersOnly}</span>}
      </div>
      <h1 className="mt-3 font-serif text-[clamp(32px,5vw,48px)] font-semibold leading-tight">{localized(post.title, locale)}</h1>
      <p className="mt-3 text-soft">{format(m.news.published, { date: formatDate(post.published_at, locale) })}</p>
      {cover && <Image src={cover} alt="" width={1200} height={750} sizes="(min-width: 768px) 768px, 100vw" className="mt-8 aspect-[16/10] w-full rounded-3xl object-cover" />}
      <div className="prose-body mt-8 text-lg leading-relaxed">
        {/* react-markdown escapes raw HTML, so editor text can never inject markup or scripts. */}
        <Markdown>{localized(post.body, locale)}</Markdown>
      </div>
    </article>
  );
}
