"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isLocale, locales, path } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { SLUG } from "@/lib/validation";

// Every write below runs as the logged-in user: Row Level Security rejects it unless the user is an editor/admin,
// so the read-only demo admin cannot change anything even by calling these actions directly.

export type AdminState = { error?: string; saved?: boolean };

const texts = (form: FormData, field: string) =>
  Object.fromEntries(locales.map((l) => [l, String(form.get(`${field}_${l}`) ?? "").trim()]).filter(([, v]) => v));

export async function savePost(_prev: AdminState, form: FormData): Promise<AdminState> {
  const locale = String(form.get("locale") ?? "en");
  const id = String(form.get("id") ?? "");
  const slug = String(form.get("slug") ?? "").trim();
  const title = texts(form, "title");
  if (!SLUG.test(slug) || slug.length < 3 || !title.en) return { error: "invalid" };
  const row = {
    slug,
    title,
    summary: texts(form, "summary"),
    body: texts(form, "body"),
    kind: form.get("kind") === "announcement" ? ("announcement" as const) : ("news" as const),
    visibility: form.get("visibility") === "members" ? ("members" as const) : ("public" as const),
    status: form.get("status") === "published" ? ("published" as const) : ("draft" as const),
    cover_path: String(form.get("cover_path") ?? "") || null,
    tags: String(form.get("tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5),
  };
  const supabase = await createClient();
  const { error } = id ? await supabase.from("posts").update(row).eq("id", id) : await supabase.from("posts").insert(row);
  if (error) return { error: error.code === "23505" ? "slug" : "denied" };
  revalidatePath("/", "layout");
  redirect(path(isLocale(locale) ? locale : "en", "/admin/news"));
}

export async function deletePost(form: FormData): Promise<void> {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", String(form.get("id")));
  revalidatePath("/", "layout");
}

export async function saveDocument(input: {
  title: string;
  description: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  visibility: "public" | "members";
}): Promise<AdminState> {
  if (!input.title.trim()) return { error: "invalid" };
  const supabase = await createClient();
  const { error } = await supabase.from("documents").insert({
    title: { en: input.title.trim().slice(0, 200) },
    description: input.description.trim() ? { en: input.description.trim().slice(0, 500) } : {},
    file_path: input.file_path,
    file_name: input.file_name.slice(0, 200),
    mime_type: input.mime_type,
    size_bytes: input.size_bytes,
    visibility: input.visibility,
  });
  if (error) {
    await supabase.storage.from("documents").remove([input.file_path]);
    return { error: "denied" };
  }
  revalidatePath("/", "layout");
  return { saved: true };
}

export async function deleteDocument(form: FormData): Promise<void> {
  const supabase = await createClient();
  const { data } = await supabase.from("documents").delete().eq("id", String(form.get("id"))).select("file_path").maybeSingle();
  if (data) await supabase.storage.from("documents").remove([data.file_path]);
  revalidatePath("/", "layout");
}

export async function setMember(form: FormData): Promise<void> {
  const role = String(form.get("role"));
  const status = String(form.get("status"));
  if (!["member", "editor", "admin"].includes(role) || !["pending", "active", "blocked"].includes(status)) return;
  const supabase = await createClient();
  await supabase.rpc("set_member", {
    target: String(form.get("id")),
    new_role: role as "member" | "editor" | "admin",
    new_status: status as "pending" | "active" | "blocked",
  });
  revalidatePath("/", "layout");
}

export async function markHandled(form: FormData): Promise<void> {
  const supabase = await createClient();
  await supabase.from("contact_messages").update({ handled: true }).eq("id", String(form.get("id")));
  revalidatePath("/", "layout");
}
