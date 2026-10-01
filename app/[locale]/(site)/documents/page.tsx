import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentList } from "@/components/DocumentList";
import { currentProfile } from "@/lib/auth";
import { visibleDocuments } from "@/lib/data";
import { getMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/documents">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).documents.title } : {};
}

export default async function DocumentsPage({ params }: PageProps<"/[locale]/documents">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale).documents;
  const [documents, profile] = await Promise.all([visibleDocuments(), currentProfile()]);
  return (
    <div className="container-page max-w-4xl py-16 lg:py-24">
      <h1 className="font-serif text-[clamp(34px,5vw,52px)] font-semibold">{t.title}</h1>
      <p className="mt-3 text-lg text-soft">{t.lead}</p>
      {!profile && <p className="mt-4 rounded-xl bg-sand px-4 py-3 text-sm">{t.membersHint}</p>}
      <div className="mt-10"><DocumentList documents={documents} locale={locale} /></div>
    </div>
  );
}
