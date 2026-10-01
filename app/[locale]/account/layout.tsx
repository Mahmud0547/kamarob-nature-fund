import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/DemoBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { getMessages, isLocale } from "@/lib/i18n";

export default async function AccountLayout({ children, params }: LayoutProps<"/[locale]/account">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <DemoBanner t={getMessages(locale).demo} />
      <SiteHeader locale={locale} />
      <main id="main" className="pb-20">{children}</main>
    </>
  );
}
