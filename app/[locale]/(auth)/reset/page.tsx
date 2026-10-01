import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResetForm } from "@/components/AuthForms";
import { getMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/reset">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).auth.resetTitle, robots: { index: false } } : {};
}

export default async function Page({ params }: PageProps<"/[locale]/reset">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ResetForm locale={locale} t={getMessages(locale).auth} />;
}
