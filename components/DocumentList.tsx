import { formatDate, formatSize } from "@/lib/format";
import { getMessages, localized, type Locale } from "@/lib/i18n";
import type { DocumentRow } from "@/lib/supabase/types";
import { SampleTag } from "./DemoBanner";

export function DocumentList({ documents, locale }: { documents: DocumentRow[]; locale: Locale }) {
  const m = getMessages(locale);
  if (documents.length === 0) return <p className="text-soft">{m.documents.empty}</p>;
  return (
    <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
      {documents.map((doc) => (
        <li key={doc.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{localized(doc.title, locale)}</h3>
              {doc.is_sample && <SampleTag label={m.demo.sample} />}
              {doc.visibility === "members" && <span className="text-xs font-semibold text-rust">{m.news.membersOnly}</span>}
            </div>
            <p className="mt-1 text-sm text-soft">{localized(doc.description, locale)}</p>
            <p className="mt-1 text-xs text-soft">{doc.file_name} · {formatSize(doc.size_bytes)} · {formatDate(doc.created_at, locale)}</p>
          </div>
          <a href={`/api/documents/${doc.id}`} className="shrink-0 rounded-full border border-forest px-4 py-2 text-sm font-semibold text-forest hover:bg-forest hover:text-white">
            {m.documents.download}
          </a>
        </li>
      ))}
    </ul>
  );
}
