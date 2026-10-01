import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { getMessages, path, type Locale } from "@/lib/i18n";
import type { Profile } from "@/lib/supabase/types";

/** Tabs of the member area plus the admin link for staff. */
export function AccountNav({ locale, profile, current }: { locale: Locale; profile: Profile; current: string }) {
  const m = getMessages(locale);
  const tabs = [
    ["", m.account.title],
    ["/documents", m.account.internalDocuments],
    ["/chat", m.account.chat],
    ["/profile", m.account.profile],
  ] as const;
  const staff = ["editor", "admin", "demo_admin"].includes(profile.role);
  return (
    <div className="border-b border-line bg-white">
      <div className="container-page flex flex-wrap items-center gap-2 py-3">
        <nav aria-label={m.account.title} className="flex flex-wrap gap-1">
          {tabs.map(([href, label]) => (
            <Link
              key={href}
              href={path(locale, `/account${href}`)}
              aria-current={current === href ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${current === href ? "bg-forest text-white" : "text-soft hover:bg-paper"}`}
            >
              {label}
            </Link>
          ))}
          {staff && <Link href={path(locale, "/admin")} className="rounded-full px-4 py-2 text-sm font-semibold text-juniper hover:bg-paper">{m.nav.admin}</Link>}
        </nav>
        <form action={logout} className="ml-auto">
          <input type="hidden" name="locale" value={locale} />
          <button className="rounded-full px-4 py-2 text-sm font-semibold text-soft hover:bg-paper">{m.nav.logout}</button>
        </form>
      </div>
    </div>
  );
}
