import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewPasswordForm } from "@/components/AuthForms";
import { getMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/new-password">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).auth.newPasswordTitle, robots: { index: false } } : {};
}

export default async function Page({ params }: PageProps<"/[locale]/new-password">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <NewPasswordForm locale={locale} t={getMessages(locale).auth} />;
}
