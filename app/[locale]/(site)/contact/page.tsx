import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { getMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).contact.title } : {};
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale).contact;
  return (
    <div className="container-page grid gap-10 py-16 lg:grid-cols-2 lg:py-24">
      <div className="flex flex-col gap-4">
        <h1 className="font-serif text-[clamp(34px,5vw,52px)] font-semibold">{t.title}</h1>
        <p className="text-lg text-soft">{t.lead}</p>
        <Image src="/media/photo9-800.webp" alt="" width={800} height={1067} sizes="(min-width: 1024px) 560px, 100vw" className="mt-4 hidden aspect-[4/3] w-full rounded-3xl object-cover lg:block" />
      </div>
      <ContactForm t={t} />
    </div>
  );
}
