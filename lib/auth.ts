import { redirect } from "next/navigation";
import { path, type Locale } from "./i18n";
import { createClient } from "./supabase/server";
import type { Profile } from "./supabase/types";

/** The logged-in user's profile, or null. Uses getUser(), which verifies the session with Supabase. */
export async function currentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
  return profile ?? null;
}

/** Active members only; others go to the login page. */
export async function requireMember(locale: Locale): Promise<Profile> {
  const profile = await currentProfile();
  if (!profile) redirect(path(locale, "/login"));
  if (profile.status !== "active") redirect(path(locale, "/login?state=" + profile.status));
  return profile;
}

/** Editors, admins and the read-only demo admin. */
export async function requireStaff(locale: Locale): Promise<Profile> {
  const profile = await requireMember(locale);
  if (!["editor", "admin", "demo_admin"].includes(profile.role)) redirect(path(locale, "/account"));
  return profile;
}

export const canWrite = (profile: Profile) => profile.role === "editor" || profile.role === "admin";
export const isAdmin = (profile: Profile) => profile.role === "admin";
