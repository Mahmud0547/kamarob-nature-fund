import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getMessages, localized, path, type Locale } from "@/lib/i18n";
import type { Post } from "@/lib/supabase/types";
import { SampleTag } from "./DemoBanner";

export function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const t = getMessages(locale);
  const cover = mediaUrl(post.cover_path);
  return (
    <article className="flex flex-col gap-3">
      {cover && (
        <Image src={cover} alt="" width={800} height={500} sizes="(min-width: 1024px) 384px, 100vw" className="aspect-[16/10] w-full rounded-2xl object-cover" />
      )}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-juniper">
        {post.kind === "announcement" ? t.news.announcement : post.tags[0]}
        {post.visibility === "members" && <span className="text-rust">· {t.news.membersOnly}</span>}
        {post.is_sample && <SampleTag label={t.demo.sample} />}
      </div>
      <h3 className="font-serif text-xl font-semibold leading-snug">
        <Link href={path(locale, `/news/${post.slug}`)} className="hover:underline">{localized(post.title, locale)}</Link>
      </h3>
      <p className="text-[15px] leading-relaxed text-soft">{localized(post.summary, locale)}</p>
      <p className="text-sm text-soft">{formatDate(post.published_at, locale)}</p>
    </article>
  );
}
