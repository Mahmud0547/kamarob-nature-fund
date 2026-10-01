"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register, requestReset, setNewPassword, type AuthState } from "@/app/actions/auth";
import { format, path, type Locale, type Messages } from "@/lib/i18n";

const input = "w-full rounded-xl border border-line bg-white px-4 py-3 text-base outline-none focus:border-juniper";
const button = "w-full rounded-full bg-forest px-6 py-3 font-semibold text-white disabled:opacity-60";

function Field({ label, hint, ...props }: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      <input className={input} {...props} />
      {hint && <span className="text-xs text-soft">{hint}</span>}
    </label>
  );
}

function Problem({ state, t }: { state: AuthState; t: Messages["auth"] }) {
  if (!state.error) return null;
  const text = state.error === "invalid" ? t.genericError : t[state.error];
  return <p role="alert" className="rounded-xl bg-sand px-4 py-3 text-sm text-rust">{text}</p>;
}

export function LoginForm({ locale, t, next, email, notice }: { locale: Locale; t: Messages["auth"]; next?: string; email?: string; notice?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(login, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <h1 className="font-serif text-3xl font-semibold">{t.loginTitle}</h1>
      {notice && <p role="status" className="rounded-xl bg-moss px-4 py-3 text-sm">{notice}</p>}
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label={t.email} name="email" type="email" autoComplete="email" required defaultValue={state.email ?? email} />
      <Field label={t.password} name="password" type="password" autoComplete="current-password" required />
      <Problem state={state} t={t} />
      <button className={button} disabled={pending}>{t.login}</button>
      <p className="text-sm"><Link href={path(locale, "/reset")} className="text-juniper underline">{t.forgot}</Link></p>
      <p className="text-sm text-soft">{t.noAccount} <Link href={path(locale, "/register")} className="font-semibold text-juniper underline">{t.register}</Link></p>
    </form>
  );
}

export function RegisterForm({ locale, t }: { locale: Locale; t: Messages["auth"] }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(register, {});
  if (state.done) return <p role="status" className="rounded-2xl bg-moss p-6 text-lg">{format(t.checkEmail, { email: state.email ?? "" })}</p>;
  return (
    <form action={action} className="flex flex-col gap-4">
      <h1 className="font-serif text-3xl font-semibold">{t.registerTitle}</h1>
      <input type="hidden" name="locale" value={locale} />
      <Field label={t.fullName} name="full_name" autoComplete="name" required maxLength={100} />
      <Field label={t.email} name="email" type="email" autoComplete="email" required defaultValue={state.email} />
      <Field label={t.password} hint={t.passwordHint} name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={72} />
      <Problem state={state} t={t} />
      <button className={button} disabled={pending}>{t.register}</button>
      <p className="text-sm text-soft">{t.haveAccount} <Link href={path(locale, "/login")} className="font-semibold text-juniper underline">{t.login}</Link></p>
    </form>
  );
}

export function ResetForm({ locale, t }: { locale: Locale; t: Messages["auth"] }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(requestReset, {});
  if (state.done) return <p role="status" className="rounded-2xl bg-moss p-6 text-lg">{format(t.resetSent, { email: state.email ?? "" })}</p>;
  return (
    <form action={action} className="flex flex-col gap-4">
      <h1 className="font-serif text-3xl font-semibold">{t.resetTitle}</h1>
      <input type="hidden" name="locale" value={locale} />
      <Field label={t.email} name="email" type="email" autoComplete="email" required />
      <Problem state={state} t={t} />
      <button className={button} disabled={pending}>{t.sendReset}</button>
    </form>
  );
}

export function NewPasswordForm({ locale, t }: { locale: Locale; t: Messages["auth"] }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(setNewPassword, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <h1 className="font-serif text-3xl font-semibold">{t.newPasswordTitle}</h1>
      <input type="hidden" name="locale" value={locale} />
      <Field label={t.password} hint={t.passwordHint} name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={72} />
      <Problem state={state} t={t} />
      <button className={button} disabled={pending}>{t.savePassword}</button>
    </form>
  );
}
