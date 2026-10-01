"use server";

import { createClient } from "@/lib/supabase/server";
import { validateContact } from "@/lib/validation";

export type ContactState = { status: "idle" | "sent" | "invalid" | "error"; field?: "name" | "email" | "message" };

export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Bots fill the hidden "website" field; pretend success and store nothing.
  if (String(form.get("website") ?? "")) return { status: "sent" };
  const input = {
    name: String(form.get("name") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    message: String(form.get("message") ?? "").trim(),
  };
  const field = validateContact(input);
  if (field) return { status: "invalid", field };
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(input);
  return error ? { status: "error" } : { status: "sent" };
}
