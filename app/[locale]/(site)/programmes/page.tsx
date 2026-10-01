import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SampleTag } from "@/components/DemoBanner";
import { getMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/programmes">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).programmes.title } : {};
}

const PHOTOS = ["photo6", "photo10", "photo4"];

export default async function ProgrammesPage({ params }: PageProps<"/[locale]/programmes">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const t = m.programmes;
  return (
    <div className="container-page py-16 lg:py-24">
      <h1 className="font-serif text-[clamp(34px,5vw,52px)] font-semibold">{t.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-soft">{t.lead}</p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {t.items.map((item, i) => (
          <article key={item.title} className="overflow-hidden rounded-2xl border border-line bg-white">
            <Image src={`/media/${PHOTOS[i]}-800.webp`} alt="" width={800} height={600} sizes="(min-width: 768px) 400px, 100vw" className="aspect-[4/3] w-full object-cover" />
            <div className="flex flex-col gap-3 p-6">
              <SampleTag label={m.demo.sample} />
              <h2 className="font-serif text-2xl font-semibold">{item.title}</h2>
              <p className="leading-relaxed text-soft">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
