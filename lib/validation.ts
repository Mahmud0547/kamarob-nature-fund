/** Input rules shared by forms and server actions. They mirror the CHECK constraints in the database. */

export const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export type ContactInput = { name: string; email: string; message: string };

export function validateContact(input: ContactInput): "name" | "email" | "message" | null {
  if (input.name.trim().length < 1 || input.name.trim().length > 100) return "name";
  if (input.email.length > 200 || !EMAIL.test(input.email.trim())) return "email";
  const length = input.message.trim().length;
  if (length < 20 || length > 4000) return "message";
  return null;
}

export function validatePassword(password: string): boolean {
  return password.length >= 8 && password.length <= 72;
}

/** "Two days on the Kamarob trail!" → "two-days-on-the-kamarob-trail". Latin only; other scripts are dropped. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

/** Only same-site paths may be used as redirect targets (prevents open redirects). */
export function safeNext(next: string | null | undefined, fallback: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}
