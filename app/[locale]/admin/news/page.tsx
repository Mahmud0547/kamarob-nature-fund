import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePost } from "@/app/actions/admin";
import { AdminShell, Pill } from "@/components/AdminShell";
import { canWrite, requireStaff } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getMessages, isLocale, localized, path } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export default async function AdminNews({ params }: PageProps<"/[locale]/admin/news">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = await requireStaff(locale);
  const m = getMessages(locale);
  const t = m.admin;
  const supabase = await createClient();
  const { data: posts } = await supabase.from("posts").select("*").order("updated_at", { ascending: false });
  const writable = canWrite(profile);
  return (
    <AdminShell locale={locale} profile={profile} current="/news">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-4xl font-semibold">{t.news}</h1>
        {writable && <Link href={path(locale, "/admin/news/new")} className="rounded-full bg-sun px-5 py-2.5 font-semibold text-ink">+ {t.newPost}</Link>}
      </div>
      <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
        {posts?.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{localized(p.title, locale)}</p>
              <p className="text-sm text-soft">/{p.slug} · {formatDate(p.updated_at, locale)}{p.is_sample ? ` · ${m.demo.sample}` : ""}</p>
            </div>
            <Pill>{t.kind[p.kind]}</Pill>
            <Pill tone={p.status === "published" ? "good" : "warn"}>{t.status[p.status]}</Pill>
            <Pill>{t.visibility[p.visibility]}</Pill>
            <Link href={path(locale, `/admin/news/${p.id}`)} className="text-sm font-semibold text-juniper">{t.edit}</Link>
            {writable && (
              <form action={deletePost}>
                <input type="hidden" name="id" value={p.id} />
                <button className="text-sm font-semibold text-rust">{t.delete}</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
