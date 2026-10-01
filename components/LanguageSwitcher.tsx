"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

/** Keeps the current page when switching language: /ru/news → /tj/news. */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(en|ru|tj)(?=\/|$)/, "");
  return (
    <nav aria-label={label} className="flex gap-1 rounded-full bg-white/10 p-1">
      {locales.map((code) => (
        <Link
          key={code}
          href={`/${code}${rest}`}
          hrefLang={code === "tj" ? "tg" : code}
          aria-current={code === locale ? "true" : undefined}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${code === locale ? "bg-white/20 text-white" : "text-mist hover:text-white"}`}
        >
          {code}
        </Link>
      ))}
    </nav>
  );
}
