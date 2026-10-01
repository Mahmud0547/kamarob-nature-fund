import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegisterForm } from "@/components/AuthForms";
import { getMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/register">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).auth.registerTitle, robots: { index: false } } : {};
}

export default async function Page({ params }: PageProps<"/[locale]/register">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <RegisterForm locale={locale} t={getMessages(locale).auth} />;
}
