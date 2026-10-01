import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { getMessages, path, type Locale } from "@/lib/i18n";
import type { Profile } from "@/lib/supabase/types";
import { Logo } from "./Logo";

export function AdminShell({ locale, profile, current, children }: { locale: Locale; profile: Profile; current: string; children: React.ReactNode }) {
  const m = getMessages(locale);
  const t = m.admin;
  const items = [
    ["", t.overview],
    ["/news", t.news],
    ["/documents", t.documents],
    ...(profile.role === "editor" ? [] : ([["/members", t.members], ["/messages", t.messages]] as const)),
  ] as const;
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="dark-surface flex flex-col gap-1 bg-forest p-5 lg:w-60 lg:shrink-0">
        <div className="mb-6"><Logo locale={locale} /></div>
        <nav aria-label={t.title} className="flex flex-wrap gap-1 lg:flex-col">
          {items.map(([href, label]) => (
            <Link
              key={href}
              href={path(locale, `/admin${href}`)}
              aria-current={current === href ? "page" : undefined}
              className={`rounded-xl px-3 py-2.5 text-[15px] font-medium ${current === href ? "bg-white/15 text-white" : "text-mist hover:text-white"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1 pt-6 text-sm">
          <Link href={path(locale, "/account")} className="px-3 py-2 text-mist hover:text-white">{m.nav.account}</Link>
          <Link href={path(locale)} className="px-3 py-2 text-mist hover:text-white">Kamarob ↗</Link>
          <form action={logout}>
            <input type="hidden" name="locale" value={locale} />
            <button className="px-3 py-2 text-mist hover:text-white">{m.nav.logout}</button>
          </form>
        </div>
      </aside>
      <main id="main" className="min-w-0 flex-1 p-5 lg:p-10">
        {profile.role === "demo_admin" && <p role="note" className="mb-6 rounded-xl bg-sand px-4 py-3 text-sm font-medium text-forest">{t.readOnly}</p>}
        {children}
      </main>
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" }) {
  const tones = { neutral: "bg-paper text-soft", good: "bg-moss text-juniper", warn: "bg-sand text-rust" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
