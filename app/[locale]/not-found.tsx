import Link from "next/link";
import { getMessages } from "@/lib/i18n";

export default function NotFound() {
  const t = getMessages("en").errors;
  return (
    <main id="main" className="dark-surface flex min-h-dvh flex-col items-center justify-center gap-5 bg-forest px-4 text-center text-white">
      <p className="font-serif text-8xl font-semibold text-sun">404</p>
      <h1 className="font-serif text-3xl font-semibold">{t.notFound}</h1>
      <Link href="/" className="rounded-full bg-sun px-6 py-3 font-semibold text-ink">{t.home}</Link>
    </main>
  );
}
