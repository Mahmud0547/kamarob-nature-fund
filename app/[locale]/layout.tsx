import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { SITE_URL } from "@/lib/env";
import { inter, lora } from "@/lib/fonts";
import { getMessages, htmlLang, isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale).meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.title, template: `%s · Kamarob` },
    description: t.description,
    openGraph: { title: t.title, description: t.description, images: ["/media/hero-1600.webp"], type: "website" },
    alternates: { languages: { en: "/en", ru: "/ru", tg: "/tj", "x-default": "/en" } },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={htmlLang[locale]} className={`${inter.variable} ${lora.variable}`}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
