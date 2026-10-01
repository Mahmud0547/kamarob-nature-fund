import en from "@/messages/en.json";
import ru from "@/messages/ru.json";
import tj from "@/messages/tj.json";

export const locales = ["en", "ru", "tj"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export type Messages = typeof en;

const dictionaries: Record<Locale, Messages> = { en, ru, tj };

/** Language tag for <html lang> and hreflang: the URL uses "tj", the ISO code is "tg". */
export const htmlLang: Record<Locale, string> = { en: "en", ru: "ru", tj: "tg" };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

/** Picks the text for `locale` from a {"en": …, "ru": …, "tj": …} column, falling back to English. */
export function localized(value: unknown, locale: Locale): string {
  if (typeof value !== "object" || value === null) return "";
  const texts = value as Record<string, unknown>;
  const text = texts[locale] ?? texts.en;
  return typeof text === "string" ? text : "";
}

export const path = (locale: Locale, rest = "") => `/${locale}${rest}`;
