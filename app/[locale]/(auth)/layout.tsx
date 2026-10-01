import Image from "next/image";
import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/DemoBanner";
import { Logo } from "@/components/Logo";
import { getMessages, isLocale } from "@/lib/i18n";

export default async function AuthLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <DemoBanner t={getMessages(locale).demo} />
      <div className="grid min-h-[calc(100dvh-36px)] lg:grid-cols-2">
        <div className="dark-surface relative hidden bg-forest lg:block">
          <Image src="/media/photo6-1600.webp" alt="" fill sizes="50vw" className="object-cover opacity-80" />
          <div className="absolute left-10 top-10"><Logo locale={locale} /></div>
        </div>
        <main id="main" className="flex flex-col items-center justify-center px-4 py-12">
          <div className="mb-8 lg:hidden"><Logo locale={locale} light={false} /></div>
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </>
  );
}
