import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { PostEditor } from "@/components/PostEditor";
import { canWrite, requireStaff } from "@/lib/auth";
import { SUPABASE_URL } from "@/lib/env";
import { getMessages, isLocale, localized } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export default async function EditPostPage({ params }: PageProps<"/[locale]/admin/news/[id]">) {
  const { locale, id } = await params;
  if (!isLocale(locale) || !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const profile = await requireStaff(locale);
  const supabase = await createClient();
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!post) notFound();
  const t = getMessages(locale).admin;
  return (
    <AdminShell locale={locale} profile={profile} current="/news">
      <h1 className="mb-8 font-serif text-4xl font-semibold">{localized(post.title, locale)}</h1>
      <PostEditor post={post} locale={locale} t={t} readOnly={!canWrite(profile)} mediaBase={SUPABASE_URL} />
    </AdminShell>
  );
}
