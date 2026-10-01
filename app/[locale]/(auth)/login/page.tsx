import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoginForm } from "@/components/AuthForms";
import { DEMO_ADMIN } from "@/lib/env";
import { getMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/login">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).auth.loginTitle, robots: { index: false } } : {};
}

export default async function LoginPage({ params, searchParams }: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale).auth;
  const query = await searchParams;
  const state = typeof query.state === "string" ? query.state : undefined;
  const notice = state === "pending" ? t.pending : state === "blocked" ? t.blocked : state === "link" ? t.linkInvalid : undefined;
  const next = typeof query.next === "string" ? query.next : undefined;
  return <LoginForm locale={locale} t={t} next={next} notice={notice} email={query.demo === "admin" ? DEMO_ADMIN.email : undefined} />;
}
