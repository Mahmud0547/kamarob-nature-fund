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

  const searchLink = (
    <Link href={path(locale, "/search")} aria-label={t.search} title={t.search} className="grid size-10 place-items-center rounded-full text-mist hover:bg-white/10 hover:text-white">
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    </Link>
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
          {searchLink}
          <LanguageSwitcher locale={locale} label={t.language} />
          {accountLinks}
        </div>
        <div className="ml-auto lg:hidden">{searchLink}</div>
        <details className="group lg:hidden">
          <summary className="cursor-pointer list-none rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">{t.menu}</summary>
          {/* On phones the menu opens as a full-width panel with large, easy-to-tap links. */}
          <div className="fixed inset-x-3 top-[4.5rem] z-40 flex max-h-[calc(100dvh-6rem)] flex-col gap-1 overflow-y-auto rounded-3xl bg-forest p-4 shadow-2xl">
            {links.map(([href, label]) => (
              <Link key={href} href={path(locale, href)} className="rounded-2xl px-4 py-3 text-lg font-medium text-mist hover:bg-white/10 hover:text-white">{label}</Link>
            ))}
            <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-white/10 px-4 pt-4">{accountLinks}</div>
            <div className="px-4 pb-2 pt-3"><LanguageSwitcher locale={locale} label={t.language} /></div>
          </div>
        </details>
      </div>
    </header>
  );
}
