import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMessages, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).about.title } : {};
}

const STACK = ["Next.js 16 · React 19 · TypeScript", "Supabase Auth: email confirmation, password reset", "Postgres with Row Level Security on every table", "Supabase Storage: public images, private documents with signed links", "Supabase Realtime: team chat", "Cloudflare Workers hosting"];

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale).about;
  return (
    <div className="container-page grid gap-12 py-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:py-24">
      <article className="flex max-w-2xl flex-col gap-5">
        <h1 className="font-serif text-[clamp(34px,5vw,52px)] font-semibold leading-tight">{t.title}</h1>
        <p className="text-xl leading-relaxed text-soft">{t.lead}</p>
        <p className="text-lg leading-relaxed">{t.p1}</p>
        <p className="text-lg leading-relaxed">{t.p2}</p>
        <p className="text-lg leading-relaxed">{t.p3}</p>
        <h2 className="mt-6 font-serif text-2xl font-semibold">{t.techTitle}</h2>
        <ul className="flex flex-col gap-2">
          {STACK.map((item) => <li key={item} className="rounded-xl border border-line bg-white px-4 py-3">{item}</li>)}
        </ul>
      </article>
      <Image src="/media/photo3-1600.webp" alt="" width={960} height={1280} sizes="(min-width: 1024px) 480px, 100vw" className="w-full rounded-3xl object-cover lg:sticky lg:top-8" />
    </div>
  );
}
