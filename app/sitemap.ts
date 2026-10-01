import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";
import { locales } from "@/lib/i18n";

const PAGES = ["", "/about", "/programmes", "/news", "/documents", "/gallery", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${page}`,
      alternates: { languages: { en: `${SITE_URL}/en${page}`, ru: `${SITE_URL}/ru${page}`, tg: `${SITE_URL}/tj${page}` } },
    })),
  );
}
