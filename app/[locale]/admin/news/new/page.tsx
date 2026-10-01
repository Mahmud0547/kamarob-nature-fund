import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { PostEditor } from "@/components/PostEditor";
import { canWrite, requireStaff } from "@/lib/auth";
import { SUPABASE_URL } from "@/lib/env";
import { getMessages, isLocale } from "@/lib/i18n";

export default async function NewPostPage({ params }: PageProps<"/[locale]/admin/news/new">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = await requireStaff(locale);
  const t = getMessages(locale).admin;
  return (
    <AdminShell locale={locale} profile={profile} current="/news">
      <h1 className="mb-8 font-serif text-4xl font-semibold">{t.newPost}</h1>
      <PostEditor post={null} locale={locale} t={t} readOnly={!canWrite(profile)} mediaBase={SUPABASE_URL} />
    </AdminShell>
  );
}
