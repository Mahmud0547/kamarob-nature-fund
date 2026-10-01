"use client";

import { useActionState } from "react";
import { saveProfile, type ProfileState } from "@/app/actions/profile";
import type { Messages } from "@/lib/i18n";
import type { Profile } from "@/lib/supabase/types";

export function ProfileForm({ profile, t, auth }: { profile: Profile; t: Messages["account"]; auth: Messages["auth"] }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(saveProfile, {});
  return (
    <form action={action} className="flex max-w-md flex-col gap-4 rounded-2xl border border-line bg-white p-6">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">{auth.fullName}</span>
        <input name="full_name" defaultValue={profile.full_name} required maxLength={100} className="rounded-xl border border-line bg-paper px-4 py-3" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Language / Язык / Забон</span>
        <select name="profile_locale" defaultValue={profile.locale} className="rounded-xl border border-line bg-paper px-4 py-3">
          <option value="en">English</option>
          <option value="ru">Русский</option>
          <option value="tj">Тоҷикӣ</option>
        </select>
      </label>
      {state.saved && <p role="status" className="text-sm text-juniper">{t.saved}</p>}
      {state.error && <p role="alert" className="text-sm text-rust">{auth.genericError}</p>}
      <button disabled={pending} className="rounded-full bg-forest px-6 py-3 font-semibold text-white disabled:opacity-60">{t.save}</button>
    </form>
  );
}
