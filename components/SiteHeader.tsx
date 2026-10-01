import Link from "next/link";
import { currentProfile } from "@/lib/auth";
import { getMessages, path, type Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = getMessages(locale).nav;
  const profile = await currentProfile();
  const links = [
    ["/about", t.about],
    ["/programmes", t.programmes],
    ["/news", t.news],
    ["/documents", t.documents],
    ["/gallery", t.gallery],
    ["/contact", t.contact],
  ] as const;
  const staff = profile && ["editor", "admin", "demo_admin"].includes(profile.role);

  const accountLinks = profile ? (
    <>
      {staff && <Link href={path(locale, "/admin")} className="text-sm font-semibold text-white hover:underline">{t.admin}</Link>}
      <Link href={path(locale, "/account")} className="rounded-full bg-sun px-4 py-2 text-sm font-semibold text-ink">{t.account}</Link>
    </>
  ) : (
    <>
      <Link href={path(locale, "/login")} className="text-sm font-semibold text-white hover:underline">{t.login}</Link>
      <Link href={path(locale, "/register")} className="rounded-full bg-sun px-4 py-2 text-sm font-semibold text-ink">{t.join}</Link>
    </>
  );

  return (
    <header className="dark-surface bg-forest">
      <a href="#main" className="sr-only rounded bg-sun px-3 py-2 text-ink focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50">{t.skip}</a>
      <div className="container-page flex h-16 items-center gap-6 lg:h-[72px]">
        <Logo locale={locale} />
        <nav aria-label={t.menu} className="hidden flex-1 lg:block">
          <ul className="flex gap-6">
            {links.map(([href, label]) => (
              <li key={href}><Link href={path(locale, href)} className="text-[15px] font-medium text-mist hover:text-white">{label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <LanguageSwitcher locale={locale} label={t.language} />
          {accountLinks}
        </div>
        <details className="group relative ml-auto lg:hidden">
          <summary className="cursor-pointer list-none rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">{t.menu}</summary>
          <div className="absolute right-0 top-12 z-40 flex w-64 flex-col gap-3 rounded-2xl bg-forest p-5 shadow-xl">
            {links.map(([href, label]) => (
              <Link key={href} href={path(locale, href)} className="text-base font-medium text-mist hover:text-white">{label}</Link>
            ))}
            <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-3">{accountLinks}</div>
            <LanguageSwitcher locale={locale} label={t.language} />
          </div>
        </details>
      </div>
    </header>
  );
}
