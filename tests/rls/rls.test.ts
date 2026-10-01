// Row Level Security checks against a real Supabase project (run with: npm run test:rls).
// They use only the public anon key and the public demo-admin login — never the service key.
import { createClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";
import { DEMO_ADMIN } from "@/lib/env";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const fresh = () => createClient(url, anonKey, { auth: { persistSession: false } });

describe("anonymous visitor", () => {
  const db = fresh();

  it("sees only published public posts", async () => {
    const { data } = await db.from("posts").select("slug, status, visibility");
    expect(data?.length).toBeGreaterThan(0);
    expect(data?.every((p) => p.status === "published" && p.visibility === "public")).toBe(true);
  });

  it("sees only public documents", async () => {
    const { data } = await db.from("documents").select("visibility");
    expect(data?.every((d) => d.visibility === "public")).toBe(true);
  });

  it("cannot read profiles, chat, channels or the inbox", async () => {
    for (const table of ["profiles", "messages", "channels", "contact_messages"] as const) {
      const { data } = await db.from(table).select("*");
      expect(data, table).toEqual([]);
    }
  });

  it("can send a valid contact message but not a fake sample or handled one", async () => {
    expect((await db.from("contact_messages").insert({ name: "RLS test", email: "rls@example.org", message: "Automated RLS check, please ignore." })).error).toBeNull();
    expect((await db.from("contact_messages").insert({ name: "x", email: "x@example.org", message: "Trying to mark it as handled.", handled: true })).error).not.toBeNull();
  });

  it("cannot write posts or call admin functions", async () => {
    expect((await db.from("posts").insert({ slug: "hack-attempt", title: { en: "x" } })).error).not.toBeNull();
    expect((await db.rpc("admin_overview")).error).not.toBeNull();
  });

  it("cannot download members-only files", async () => {
    const { error } = await db.storage.from("documents").createSignedUrl("sample/report-template.pdf", 60);
    expect(error).not.toBeNull();
  });
});

describe("demo admin (read-only)", () => {
  const db = fresh();
  let myId = "";

  beforeAll(async () => {
    const { data, error } = await db.auth.signInWithPassword(DEMO_ADMIN);
    expect(error).toBeNull();
    myId = data.user!.id;
  });

  it("sees drafts, members-only posts and the overview", async () => {
    const { data } = await db.from("posts").select("status, visibility");
    expect(data?.some((p) => p.status === "draft")).toBe(true);
    expect((await db.rpc("admin_overview")).error).toBeNull();
  });

  it("sees only sample people and sample inbox messages", async () => {
    const { data: people } = await db.from("profiles").select("is_sample, id");
    expect(people?.every((p) => p.is_sample || p.id === myId)).toBe(true);
    const { data: inbox } = await db.from("contact_messages").select("is_sample");
    expect(inbox?.length).toBeGreaterThan(0);
    expect(inbox?.every((m) => m.is_sample)).toBe(true);
  });

  it("cannot change anything", async () => {
    const { data: post } = await db.from("posts").select("id").limit(1).single();
    const update = await db.from("posts").update({ status: "draft" }).eq("id", post!.id).select();
    expect(update.data ?? []).toEqual([]);
    expect((await db.from("posts").insert({ slug: "demo-write", title: { en: "x" } })).error).not.toBeNull();
    expect((await db.from("messages").insert({ channel_id: "00000000-0000-0000-0000-000000000000", body: "hi" })).error).not.toBeNull();
    const { data: people } = await db.from("profiles").select("id").neq("id", myId).limit(1);
    expect((await db.rpc("set_member", { target: people![0]!.id, new_role: "admin", new_status: "active" })).error).not.toBeNull();
    expect((await db.from("profiles").update({ role: "admin" } as never).eq("id", myId)).error).not.toBeNull();
    const upload = await db.storage.from("media").upload(`covers/demo-${Date.now()}.png`, new Blob(["x"], { type: "image/png" }));
    expect(upload.error).not.toBeNull();
  });

  it("can download members-only files", async () => {
    const { error } = await db.storage.from("documents").createSignedUrl("sample/report-template.pdf", 60);
    expect(error).toBeNull();
  });
});
