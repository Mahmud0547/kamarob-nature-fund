import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/gallery">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).gallery.title } : {};
}

const PHOTOS = ["hero", "photo2", "photo3", "photo4", "photo5", "photo6", "photo7", "photo8", "photo9", "photo10"];
const VIDEOS = ["spring-drink", "spring-stream"];

export default async function GalleryPage({ params }: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale).gallery;
  return (
    <div className="container-page py-16 lg:py-24">
      <h1 className="font-serif text-[clamp(34px,5vw,52px)] font-semibold">{t.title}</h1>
      <p className="mt-3 text-lg text-soft">{t.lead}</p>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {VIDEOS.map((name) => (
          <video key={name} src={`/media/${name}.mp4`} poster={`/media/${name}-poster.webp`} controls muted playsInline preload="none" className="aspect-[9/16] w-full rounded-2xl bg-forest object-cover" aria-label={t.title} />
        ))}
        {PHOTOS.map((name, i) => (
          <a key={name} href={`/media/${name}-1600.webp`} className="block">
            <Image src={`/media/${name}-800.webp`} alt={`${t.title} ${i + 1}`} width={600} height={800} sizes="(min-width: 1024px) 300px, 50vw" className="aspect-[3/4] w-full rounded-2xl object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
}
