import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell, Pill } from "@/components/AdminShell";
import { requireStaff } from "@/lib/auth";
import { signupsByWeek } from "@/lib/data";
import { formatDay } from "@/lib/format";
import { format, getMessages, isLocale, localized, path } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { robots: { index: false } };

type Overview = Record<"posts_published" | "posts_draft" | "members_active" | "members_pending" | "documents" | "documents_members" | "messages_new", number>;

export default async function AdminOverview({ params }: PageProps<"/[locale]/admin">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = await requireStaff(locale);
  const t = getMessages(locale).admin;
  const supabase = await createClient();
  const [{ data: overview }, { data: posts }, { data: pending }, weeks] = await Promise.all([
    supabase.rpc("admin_overview"),
    supabase.from("posts").select("id, slug, title, status, visibility").order("updated_at", { ascending: false }).limit(6),
    supabase.from("profiles").select("id, full_name, created_at").eq("status", "pending").order("created_at").limit(5),
    signupsByWeek(8),
  ]);
  const peak = Math.max(1, ...weeks.map((w) => w.count));
  const o = (overview ?? {}) as Partial<Overview>;
  const cards = [
    [t.stats.posts, o.posts_published, format(t.stats.drafts, { count: o.posts_draft ?? 0 })],
    [t.stats.members, o.members_active, format(t.stats.pending, { count: o.members_pending ?? 0 })],
    [t.stats.documents, o.documents, format(t.stats.membersDocs, { count: o.documents_members ?? 0 })],
    [t.stats.newMessages, o.messages_new, t.stats.fromContact],
  ] as const;
  return (
    <AdminShell locale={locale} profile={profile} current="">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-4xl font-semibold">{t.overview}</h1>
        <Link href={path(locale, "/admin/news/new")} className="rounded-full bg-sun px-5 py-2.5 font-semibold text-ink">+ {t.newPost}</Link>
      </div>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, note]) => (
          <div key={label} className="rounded-2xl border border-line bg-white p-6">
            <dt className="text-sm font-medium text-soft">{label}</dt>
            <dd className="mt-1 text-3xl font-bold">{value ?? "—"}</dd>
            <dd className="mt-1 text-sm text-juniper">{note}</dd>
          </div>
        ))}
      </dl>
      <section aria-labelledby="signups" className="mt-6 rounded-2xl border border-line bg-white p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="signups" className="font-serif text-xl font-semibold">{t.signups}</h2>
          <p className="text-sm text-soft">{t.signupsHint}</p>
        </div>
        {/* A plain bar chart: each bar is a week, its height is the number of new members. */}
        <ol className="mt-6 flex h-40 items-end gap-2">
          {weeks.map((w) => (
            <li key={w.start} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className="text-sm font-semibold">{w.count}</span>
              <span className="w-full rounded-t-lg bg-juniper" style={{ height: `${Math.max(4, (w.count / peak) * 100)}%` }} />
              <span className="text-xs text-soft">{formatDay(w.start, locale)}</span>
            </li>
          ))}
        </ol>
      </section>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-serif text-xl font-semibold">{t.recentPosts}</h2>
          <ul className="mt-4 divide-y divide-line">
            {posts?.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-2 py-3">
                <Link href={path(locale, `/admin/news/${p.id}`)} className="flex-1 font-medium hover:underline">{localized(p.title, locale)}</Link>
                <Pill tone={p.status === "published" ? "good" : "warn"}>{t.status[p.status]}</Pill>
                <Pill>{t.visibility[p.visibility]}</Pill>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-serif text-xl font-semibold">{t.waiting}</h2>
          {pending?.length ? (
            <ul className="mt-4 flex flex-col gap-3">{pending.map((p) => <li key={p.id} className="font-medium">{p.full_name || "—"}</li>)}</ul>
          ) : (
            <p className="mt-4 text-soft">{t.noPending}</p>
          )}
          <Link href={path(locale, "/admin/members")} className="mt-4 inline-block text-sm font-semibold text-juniper">{t.members} →</Link>
        </section>
      </div>
    </AdminShell>
  );
}
