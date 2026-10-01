import { notFound, redirect } from "next/navigation";
import { markHandled } from "@/app/actions/admin";
import { AdminShell, Pill } from "@/components/AdminShell";
import { isAdmin, requireStaff } from "@/lib/auth";
import { formatTime } from "@/lib/format";
import { getMessages, isLocale, path } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export default async function AdminMessages({ params }: PageProps<"/[locale]/admin/messages">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = await requireStaff(locale);
  if (profile.role === "editor") redirect(path(locale, "/admin"));
  const m = getMessages(locale);
  const t = m.admin;
  const supabase = await createClient();
  const { data: messages } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(100);
  return (
    <AdminShell locale={locale} profile={profile} current="/messages">
      <h1 className="mb-8 font-serif text-4xl font-semibold">{t.messages}</h1>
      {messages?.length ? (
        <ul className="flex flex-col gap-4">
          {messages.map((msg) => (
            <li key={msg.id} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{msg.name}</p>
                <a href={`mailto:${msg.email}`} className="text-sm text-juniper underline">{msg.email}</a>
                <span className="text-sm text-soft">{formatTime(msg.created_at, locale)}</span>
                {msg.is_sample && <Pill>{m.demo.sample}</Pill>}
                {msg.handled && <Pill tone="good">{t.handled}</Pill>}
              </div>
              <p className="mt-3 whitespace-pre-wrap">{msg.message}</p>
              {isAdmin(profile) && !msg.handled && (
                <form action={markHandled} className="mt-3">
                  <input type="hidden" name="id" value={msg.id} />
                  <button className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold hover:bg-paper">{t.markHandled}</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-soft">{t.noMessages}</p>
      )}
    </AdminShell>
  );
}
