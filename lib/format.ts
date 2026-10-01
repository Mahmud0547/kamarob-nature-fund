import { htmlLang, type Locale } from "./i18n";

export function formatDate(iso: string | null, locale: Locale): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat(locale === "tj" ? "ru" : htmlLang[locale], { dateStyle: "long", timeZone: "Asia/Dushanbe" }).format(new Date(iso));
}

export function formatTime(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "tj" ? "ru" : htmlLang[locale], { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Dushanbe" }).format(new Date(iso));
}

export function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
