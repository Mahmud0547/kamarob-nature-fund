import { DemoBanner } from "@/components/DemoBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getMessages, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function SiteLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <DemoBanner t={getMessages(locale).demo} />
      <SiteHeader locale={locale} />
      <main id="main">{children}</main>
      <SiteFooter locale={locale} />
    </>
  );
}
