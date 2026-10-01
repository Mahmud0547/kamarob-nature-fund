"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SITE_URL } from "@/lib/env";
import { isLocale, path, type Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { EMAIL, safeNext, validatePassword } from "@/lib/validation";

export type AuthState = { error?: "wrongCredentials" | "notConfirmed" | "genericError" | "invalid"; done?: "checkEmail" | "resetSent"; email?: string };

const localeOf = (form: FormData): Locale => {
  const value = String(form.get("locale") ?? "en");
  return isLocale(value) ? value : "en";
};

/** The site address for links in emails: the request's own origin, so preview deployments work too. */
async function origin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : SITE_URL;
}

export async function login(_prev: AuthState, form: FormData): Promise<AuthState> {
  const locale = localeOf(form);
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!EMAIL.test(email) || !password) return { error: "invalid", email };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.code === "email_not_confirmed" ? "notConfirmed" : "wrongCredentials", email };
  redirect(safeNext(String(form.get("next") ?? ""), path(locale, "/account")));
}

export async function register(_prev: AuthState, form: FormData): Promise<AuthState> {
  const locale = localeOf(form);
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const fullName = String(form.get("full_name") ?? "").trim().slice(0, 100);
  if (!EMAIL.test(email) || !validatePassword(password) || !fullName) return { error: "invalid", email };
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, locale },
      emailRedirectTo: `${await origin()}/auth/confirm?next=${encodeURIComponent(path(locale, "/account"))}`,
    },
  });
  // Supabase answers the same way for existing emails, so nobody can probe which addresses have accounts.
  if (error && error.code !== "user_already_exists") return { error: "genericError", email };
  return { done: "checkEmail", email };
}

export async function requestReset(_prev: AuthState, form: FormData): Promise<AuthState> {
  const locale = localeOf(form);
  const email = String(form.get("email") ?? "").trim();
  if (!EMAIL.test(email)) return { error: "invalid", email };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await origin()}/auth/confirm?next=${encodeURIComponent(path(locale, "/new-password"))}`,
  });
  return { done: "resetSent", email };
}

export async function setNewPassword(_prev: AuthState, form: FormData): Promise<AuthState> {
  const locale = localeOf(form);
  const password = String(form.get("password") ?? "");
  if (!validatePassword(password)) return { error: "invalid" };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "genericError" };
  redirect(path(locale, "/account"));
}

export async function logout(form: FormData): Promise<void> {
  const locale = localeOf(form);
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(path(locale));
}
