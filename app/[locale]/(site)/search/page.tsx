import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { search, snippet } from "@/lib/content";
import { searchIndex } from "@/lib/data";
import { format, getMessages, isLocale, path } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[locale]/search">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).search.title, robots: { index: false } } : {};
}

export default async function SearchPage({ params, searchParams }: PageProps<"/[locale]/search">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getMessages(locale).search;
  const raw = (await searchParams).q;
  const query = (Array.isArray(raw) ? raw[0] : raw ?? "").slice(0, 100).trim();
  const results = query.length > 1 ? search(await searchIndex(locale), query) : [];

  return (
    <div className="container-page max-w-3xl py-16 lg:py-24">
      <h1 className="font-serif text-[clamp(34px,5vw,52px)] font-semibold">{t.title}</h1>
      <form role="search" action={path(locale, "/search")} className="mt-8 flex gap-2">
        <label htmlFor="q" className="sr-only">{t.placeholder}</label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder={t.placeholder}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-full border border-line bg-white px-5 py-3 text-lg outline-none focus:border-juniper"
        />
        <button className="rounded-full bg-forest px-6 py-3 font-semibold text-white">{t.button}</button>
      </form>

      {query.length === 1 && <p className="mt-6 text-soft">{t.hint}</p>}
      {query.length > 1 && (
        <p className="mt-6 text-soft" role="status">
          {results.length ? format(t.results, { count: results.length, query }) : format(t.empty, { query })}
        </p>
      )}

      <ul className="mt-6 flex flex-col divide-y divide-line">
        {results.map((r) => (
          <li key={`${r.kind}:${r.title}`} className="py-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-juniper">{t.kinds[r.kind]}</p>
            <h2 className="mt-1 font-serif text-xl font-semibold">
              <Link href={r.href} className="hover:underline">{r.title}</Link>
            </h2>
            <p className="mt-1 text-[15px] leading-relaxed text-soft">{snippet(r.text, query)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
