import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { latestPosts } from "@/lib/data";
import { getMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/news">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).news.title } : {};
}

export default async function NewsPage({ params }: PageProps<"/[locale]/news">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale).news;
  const posts = await latestPosts(30);
  return (
    <div className="container-page py-16 lg:py-24">
      <h1 className="font-serif text-[clamp(34px,5vw,52px)] font-semibold">{t.title}</h1>
      <p className="mt-3 text-lg text-soft">{t.lead}</p>
      {posts.length ? (
        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <PostCard key={p.id} post={p} locale={locale} />)}</div>
      ) : (
        <p className="mt-10 text-soft">{t.empty}</p>
      )}
    </div>
  );
}
