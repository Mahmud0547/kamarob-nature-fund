import Link from "next/link";
import { path, type Locale } from "@/lib/i18n";

export function Logo({ locale, light = true }: { locale: Locale; light?: boolean }) {
  return (
    <Link href={path(locale)} className={`flex items-center gap-2.5 font-serif text-xl font-semibold ${light ? "text-white" : "text-forest"}`}>
      <svg aria-hidden="true" width="28" height="28" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="15" fill="#e2a13b" />
        <path d="M5 23 L12 13 L16 18 L20 11 L27 23 Z" fill="#1f3b2d" />
      </svg>
      Kamarob
    </Link>
  );
}
