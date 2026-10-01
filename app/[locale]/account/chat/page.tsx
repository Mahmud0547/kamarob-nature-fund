import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountNav } from "@/components/AccountShell";
import { Chat } from "@/components/Chat";
import { requireMember } from "@/lib/auth";
import { getMessages, isLocale, localized, path } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export default async function ChatPage({ params, searchParams }: PageProps<"/[locale]/account/chat">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = await requireMember(locale);
  const m = getMessages(locale);
  const supabase = await createClient();
  const { data: channels } = await supabase.from("channels").select("*").order("position");
  const wanted = (await searchParams).channel;
  const current = channels?.find((c) => c.slug === wanted) ?? channels?.[0];

  const { data: recent } = current
    ? await supabase.from("messages").select("*").eq("channel_id", current.id).order("created_at", { ascending: false }).limit(100)
    : { data: [] };
  const initial = (recent ?? []).reverse();
  const authorIds = [...new Set(initial.map((x) => x.author_id))];
  const { data: authors } = authorIds.length ? await supabase.from("profiles").select("id, full_name").in("id", authorIds) : { data: [] };
  const names = Object.fromEntries((authors ?? []).map((a) => [a.id, a.full_name]));

  return (
    <>
      <AccountNav locale={locale} profile={profile} current="/chat" />
      <div className="container-page grid gap-6 py-10 lg:grid-cols-[240px_1fr]">
        <nav aria-label={m.chat.title} className="flex gap-2 overflow-x-auto lg:flex-col">
          {channels?.map((c) => (
            <Link
              key={c.id}
              href={path(locale, `/account/chat?channel=${c.slug}`)}
              aria-current={c.id === current?.id ? "page" : undefined}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold ${c.id === current?.id ? "bg-forest text-white" : "bg-white text-ink hover:bg-moss"}`}
            >
              # {localized(c.name, locale)}
            </Link>
          ))}
        </nav>
        {current ? (
          <section aria-label={localized(current.name, locale)}>
            <h1 className="mb-1 font-serif text-3xl font-semibold"># {localized(current.name, locale)}</h1>
            <p className="mb-4 text-soft">{localized(current.description, locale)}</p>
            <Chat channelId={current.id} initial={initial} names={names} myId={profile.id} canWrite={profile.role !== "demo_admin"} t={m.chat} locale={locale} />
          </section>
        ) : (
          <p className="text-soft">{m.chat.empty}</p>
        )}
      </div>
    </>
  );
}
