"use server";

import { revalidatePath } from "next/cache";
import { isLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { saved?: boolean; error?: boolean };

export async function saveProfile(_prev: ProfileState, form: FormData): Promise<ProfileState> {
  const fullName = String(form.get("full_name") ?? "").trim().slice(0, 100);
  const locale = String(form.get("profile_locale") ?? "en");
  if (!fullName || !isLocale(locale)) return { error: true };
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { error: true };
  // RLS allows updating only your own row, and column grants allow only these two columns.
  const { error } = await supabase.from("profiles").update({ full_name: fullName, locale }).eq("id", data.user.id);
  revalidatePath("/", "layout");
  return error ? { error: true } : { saved: true };
}
