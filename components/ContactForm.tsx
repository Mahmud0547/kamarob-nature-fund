"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "@/app/actions/contact";
import type { Messages } from "@/lib/i18n";

const field = "w-full rounded-xl border border-line bg-paper px-4 py-3 text-base outline-none focus:border-juniper";

export function ContactForm({ t }: { t: Messages["contact"] }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  if (state.status === "sent") return <p role="status" className="rounded-2xl bg-moss p-6 text-lg font-semibold">{t.sent}</p>;
  return (
    <form action={action} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6 lg:p-8">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">{t.name}</span>
        <input name="name" required maxLength={100} autoComplete="name" className={field} aria-invalid={state.field === "name"} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">{t.email}</span>
        <input name="email" type="email" required maxLength={200} autoComplete="email" className={field} aria-invalid={state.field === "email"} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">{t.message}</span>
        <textarea name="message" required minLength={20} maxLength={4000} rows={5} className={field} aria-invalid={state.field === "message"} />
      </label>
      <div className="hidden" aria-hidden="true">
        <label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {state.status === "invalid" && <p role="alert" className="text-sm text-rust">{state.field === "message" ? t.tooShort : t.error}</p>}
      {state.status === "error" && <p role="alert" className="text-sm text-rust">{t.error}</p>}
      <button type="submit" disabled={pending} className="rounded-full bg-forest px-6 py-3 font-semibold text-white disabled:opacity-60">
        {pending ? t.sending : t.send}
      </button>
    </form>
  );
}
