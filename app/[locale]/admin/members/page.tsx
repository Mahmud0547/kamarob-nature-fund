import { notFound, redirect } from "next/navigation";
import { setMember } from "@/app/actions/admin";
import { AdminShell, Pill } from "@/components/AdminShell";
import { isAdmin, requireStaff } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getMessages, isLocale, path } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

function Action({ id, role, status, label }: { id: string; role: string; status: string; label: string }) {
  return (
    <form action={setMember}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="status" value={status} />
      <button className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold hover:bg-paper">{label}</button>
    </form>
  );
}

export default async function AdminMembers({ params }: PageProps<"/[locale]/admin/members">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const profile = await requireStaff(locale);
  if (profile.role === "editor") redirect(path(locale, "/admin"));
  const m = getMessages(locale);
  const t = m.admin;
  const supabase = await createClient();
  const { data: people } = await supabase.from("profiles").select("*").order("status").order("created_at", { ascending: false });
  const admin = isAdmin(profile);
  return (
    <AdminShell locale={locale} profile={profile} current="/members">
      <h1 className="mb-8 font-serif text-4xl font-semibold">{t.members}</h1>
      <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
        {people?.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{p.full_name || "—"}{p.is_sample ? ` · ${m.demo.sample}` : ""}</p>
              <p className="text-sm text-soft">{formatDate(p.created_at, locale)}</p>
            </div>
            <Pill>{m.account.roles[p.role]}</Pill>
            <Pill tone={p.status === "active" ? "good" : "warn"}>{p.status}</Pill>
            {admin && p.id !== profile.id && (
              <div className="flex flex-wrap gap-2">
                {p.status !== "active" && <Action id={p.id} role={p.role === "demo_admin" ? "member" : p.role} status="active" label={t.approve} />}
                {p.status !== "blocked" && <Action id={p.id} role={p.role === "demo_admin" ? "member" : p.role} status="blocked" label={t.block} />}
                {p.role === "member" && <Action id={p.id} role="editor" status={p.status} label={t.makeEditor} />}
                {p.role === "editor" && <Action id={p.id} role="member" status={p.status} label={t.makeMember} />}
              </div>
            )}
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
