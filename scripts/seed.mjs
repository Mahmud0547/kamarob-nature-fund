// Fills the database with clearly labelled sample content and creates the demo accounts.
// Safe to run again: everything is upserted by a stable key.
//
//   SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/seed.mjs
//
// The service role key bypasses Row Level Security. Never commit it and never use it in the app.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
const db = createClient(url, key, { auth: { persistSession: false } });

async function check(label, promise) {
  const { data, error } = await promise;
  if (error) throw new Error(`${label}: ${error.message}`);
  return data;
}

async function user(email, password, fullName, profile) {
  const { data: list } = await db.auth.admin.listUsers({ perPage: 1000 });
  let found = list.users.find((u) => u.email === email);
  if (!found) {
    const created = await check(`create ${email}`, db.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: fullName } }));
    found = created.user;
  }
  await check(`profile ${email}`, db.from("profiles").update({ full_name: fullName, ...profile }).eq("id", found.id));
  return found.id;
}

// --- people ------------------------------------------------------------------
const demoAdmin = await user("demo-admin@kamarob.example", "Kamarob-demo-2026", "Demo administrator", { role: "demo_admin", status: "active", is_sample: true });
const random = () => crypto.randomUUID() + "Aa1!";
const editor = await user("sample-editor@kamarob.example", random(), "Sample editor", { role: "editor", status: "active", is_sample: true });
const memberA = await user("sample-member-a@kamarob.example", random(), "Sample member A", { role: "member", status: "active", is_sample: true });
await user("sample-pending-b@kamarob.example", random(), "Sample member B", { role: "member", status: "pending", is_sample: true });
await user("sample-pending-c@kamarob.example", random(), "Sample member C", { role: "member", status: "pending", is_sample: true });
console.log("users ok");

// --- news --------------------------------------------------------------------
const posts = JSON.parse(readFileSync(new URL("./seed-posts.json", import.meta.url), "utf8"));
for (const post of posts) {
  await check(`post ${post.slug}`, db.from("posts").upsert({ ...post, is_sample: true, author_id: editor }, { onConflict: "slug" }));
}
console.log(`posts ok: ${posts.length}`);

// --- documents ---------------------------------------------------------------
const docs = [
  { file: "editor-guide.pdf", visibility: "public", title: { en: "Platform guide for editors", ru: "Руководство для редакторов", tj: "Дастур барои муҳаррирон" }, description: { en: "How to publish news and upload documents.", ru: "Как публиковать новости и загружать документы.", tj: "Чӣ тавр хабар нашр кардан ва ҳуҷҷат боргузорӣ кардан." } },
  { file: "report-template.pdf", visibility: "members", title: { en: "Annual report template (sample)", ru: "Шаблон годового отчёта (пример)", tj: "Намунаи ҳисоботи солона" }, description: { en: "An empty structure for a nonprofit's annual report.", ru: "Пустая структура годового отчёта НКО.", tj: "Сохтори холии ҳисоботи солонаи ТҒТ." } },
];
for (const doc of docs) {
  const body = readFileSync(new URL(`./seed-files/${doc.file}`, import.meta.url));
  await db.storage.from("documents").upload(`sample/${doc.file}`, body, { contentType: "application/pdf", upsert: true });
  const existing = await check("doc lookup", db.from("documents").select("id").eq("file_path", `sample/${doc.file}`).maybeSingle());
  const row = { title: doc.title, description: doc.description, file_path: `sample/${doc.file}`, file_name: doc.file, mime_type: "application/pdf", size_bytes: body.length, visibility: doc.visibility, is_sample: true, uploaded_by: editor };
  await check(`doc ${doc.file}`, existing ? db.from("documents").update(row).eq("id", existing.id) : db.from("documents").insert(row));
}
console.log("documents ok");

// --- chat --------------------------------------------------------------------
const channels = [
  { slug: "general", position: 0, name: { en: "general", ru: "общий", tj: "умумӣ" }, description: { en: "Everyday talk for the whole team.", ru: "Общение всей команды.", tj: "Сӯҳбати ҳаррӯзаи даста." } },
  { slug: "field-trips", position: 1, name: { en: "field-trips", ru: "выезды", tj: "сафарҳо" }, description: { en: "Planning trips to the gorge.", ru: "Планирование выездов в ущелье.", tj: "Банақшагирии сафарҳо ба дара." } },
];
for (const channel of channels) await check(`channel ${channel.slug}`, db.from("channels").upsert(channel, { onConflict: "slug" }));
const general = await check("general", db.from("channels").select("id").eq("slug", "general").single());
const { count } = await db.from("messages").select("id", { count: "exact", head: true }).eq("is_sample", true);
if (!count) {
  await check("messages", db.from("messages").insert([
    { channel_id: general.id, author_id: editor, body: "Welcome to the team chat! This is a sample message.", is_sample: true },
    { channel_id: general.id, author_id: memberA, body: "Hello! The internal documents are in the member area.", is_sample: true },
  ]));
}
await check("contact", db.from("contact_messages").upsert([
  { id: "00000000-0000-4000-8000-000000000001", name: "Sample visitor", email: "visitor@example.org", message: "Hello! We would like to volunteer on a field day. This is a sample message.", is_sample: true },
], { onConflict: "id" }));
console.log("chat and inbox ok");
console.log(`demo admin id: ${demoAdmin}`);
