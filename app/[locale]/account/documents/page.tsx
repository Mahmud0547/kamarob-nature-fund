import { notFound } from "next/navigation";
import { AccountNav } from "@/components/AccountShell";
import { DocumentList } from "@/components/DocumentList";
import { requireMember } from "@/lib/auth";
import { visibleDocuments } from "@/lib/data";
import { getMessages, isLocale } from "@/lib/i18n";

export default async function MemberDocumentsPage({ params }: PageProps<"/[locale]/account/documents">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = await requireMember(locale);
  const documents = await visibleDocuments();
  return (
    <>
      <AccountNav locale={locale} profile={profile} current="/documents" />
      <div className="container-page max-w-4xl py-10">
        <h1 className="mb-8 font-serif text-4xl font-semibold">{getMessages(locale).account.internalDocuments}</h1>
        <DocumentList documents={documents} locale={locale} />
      </div>
    </>
  );
}
