import { notFound } from "next/navigation";
import { deleteDocument } from "@/app/actions/admin";
import { AdminShell, Pill } from "@/components/AdminShell";
import { DocumentUploader } from "@/components/DocumentUploader";
import { canWrite, requireStaff } from "@/lib/auth";
import { formatDate, formatSize } from "@/lib/format";
import { getMessages, isLocale, localized } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDocuments({ params }: PageProps<"/[locale]/admin/documents">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = await requireStaff(locale);
  const m = getMessages(locale);
  const t = m.admin;
  const supabase = await createClient();
  const { data: docs } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
  const writable = canWrite(profile);
  return (
    <AdminShell locale={locale} profile={profile} current="/documents">
      <h1 className="mb-8 font-serif text-4xl font-semibold">{t.documents}</h1>
      {writable && <DocumentUploader t={t} error={m.auth.genericError} />}
      <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
        {docs?.map((d) => (
          <li key={d.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{localized(d.title, locale)}</p>
              <p className="text-sm text-soft">{d.file_name} · {formatSize(d.size_bytes)} · {formatDate(d.created_at, locale)}{d.is_sample ? ` · ${m.demo.sample}` : ""}</p>
            </div>
            <Pill>{t.visibility[d.visibility]}</Pill>
            <a href={`/api/documents/${d.id}`} className="text-sm font-semibold text-juniper">{m.documents.download}</a>
            {writable && (
              <form action={deleteDocument}>
                <input type="hidden" name="id" value={d.id} />
                <button className="text-sm font-semibold text-rust">{t.delete}</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
