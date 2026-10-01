import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountNav } from "@/components/AccountShell";
import { PostCard } from "@/components/PostCard";
import { requireMember } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { format, getMessages, isLocale, path } from "@/lib/i18n";

export const metadata: Metadata = { robots: { index: false } };

export default async function AccountPage({ params, searchParams }: PageProps<"/[locale]/account">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = await requireMember(locale);
  const m = getMessages(locale);
  const supabase = await createClient();
  const { data: posts } = await supabase.from("posts").select("*").eq("status", "published").eq("visibility", "members").order("published_at", { ascending: false }).limit(6);
  const welcome = (await searchParams).welcome === "1";
  return (
    <>
      <AccountNav locale={locale} profile={profile} current="" />
      <div className="container-page py-10">
        {welcome && <p role="status" className="mb-6 rounded-xl bg-moss px-4 py-3">{m.auth.confirmed}</p>}
        <h1 className="font-serif text-4xl font-semibold">{format(m.account.welcome, { name: profile.full_name || "—" })}</h1>
        <p className="mt-2 text-soft">{m.account.role}: {m.account.roles[profile.role]}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link href={path(locale, "/account/documents")} className="rounded-2xl border border-line bg-white p-6 font-serif text-xl font-semibold hover:border-juniper">{m.account.internalDocuments} →</Link>
          <Link href={path(locale, "/account/chat")} className="rounded-2xl border border-line bg-white p-6 font-serif text-xl font-semibold hover:border-juniper">{m.account.chat} →</Link>
        </div>
        <h2 className="mt-14 font-serif text-3xl font-semibold">{m.account.internalNews}</h2>
        {posts?.length ? (
          <div className="mt-8 grid gap-8 md:grid-cols-3">{posts.map((p) => <PostCard key={p.id} post={p} locale={locale} />)}</div>
        ) : (
          <p className="mt-4 text-soft">{m.news.empty}</p>
        )}
      </div>
    </>
  );
}
