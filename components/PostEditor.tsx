"use client";

import { useActionState, useState } from "react";
import { savePost, type AdminState } from "@/app/actions/admin";
import { locales, type Locale, type Messages } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/lib/supabase/types";
import { slugify } from "@/lib/validation";

const input = "w-full rounded-xl border border-line bg-white px-4 py-2.5 outline-none focus:border-juniper disabled:bg-paper";
const LANG_NAMES: Record<Locale, string> = { en: "English", ru: "Русский", tj: "Тоҷикӣ" };

export function PostEditor({ post, locale, t, readOnly, mediaBase }: { post: Post | null; locale: Locale; t: Messages["admin"]; readOnly: boolean; mediaBase: string }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(savePost, {});
  const [tab, setTab] = useState<Locale>("en");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [cover, setCover] = useState(post?.cover_path ?? "");
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    const name = `covers/${crypto.randomUUID()}.${file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"}`;
    const { error } = await createClient().storage.from("media").upload(name, file, { contentType: file.type, upsert: false });
    setUploading(false);
    if (!error) setCover(name);
  }

  const coverUrl = cover ? (cover.startsWith("/") ? cover : `${mediaBase}/storage/v1/object/public/media/${cover}`) : null;

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <input type="hidden" name="cover_path" value={cover} />
      <fieldset disabled={readOnly} className="flex flex-col gap-6">
        <div role="tablist" aria-label="Language" className="flex gap-1 self-start rounded-full bg-white p-1">
          {locales.map((l) => (
            <button key={l} type="button" role="tab" aria-selected={tab === l} onClick={() => setTab(l)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tab === l ? "bg-forest text-white" : "text-soft"}`}>
              {LANG_NAMES[l]}
            </button>
          ))}
        </div>
        {locales.map((l) => (
          <div key={l} hidden={tab !== l} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold">{t.fields.title} ({LANG_NAMES[l]}){l === "en" ? " *" : ""}</span>
              <input
                name={`title_${l}`}
                defaultValue={(post?.title as Record<string, string>)?.[l] ?? ""}
                required={l === "en"}
                maxLength={200}
                className={input}
                onBlur={(e) => l === "en" && !slug && setSlug(slugify(e.target.value))}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold">{t.fields.summary}</span>
              <textarea name={`summary_${l}`} defaultValue={(post?.summary as Record<string, string>)?.[l] ?? ""} rows={2} maxLength={400} className={input} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold">{t.fields.body}</span>
              <textarea name={`body_${l}`} defaultValue={(post?.body as Record<string, string>)?.[l] ?? ""} rows={12} maxLength={20000} className={`${input} font-mono text-sm`} />
            </label>
          </div>
        ))}
        <div className="grid gap-4 rounded-2xl border border-line bg-white p-6 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">{t.fields.slug}</span>
            <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required pattern="[a-z0-9]+(-[a-z0-9]+)*" minLength={3} maxLength={80} className={input} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Tags</span>
            <input name="tags" defaultValue={post?.tags.join(", ") ?? ""} maxLength={120} className={input} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">{t.fields.kind}</span>
            <select name="kind" defaultValue={post?.kind ?? "news"} className={input}>
              <option value="news">{t.kind.news}</option>
              <option value="announcement">{t.kind.announcement}</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">{t.fields.visibility}</span>
            <select name="visibility" defaultValue={post?.visibility ?? "public"} className={input}>
              <option value="public">{t.visibility.public}</option>
              <option value="members">{t.visibility.members}</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">{t.fields.status}</span>
            <select name="status" defaultValue={post?.status ?? "draft"} className={input}>
              <option value="draft">{t.status.draft}</option>
              <option value="published">{t.status.published}</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">{t.fields.cover}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="text-sm" />
            {uploading && <span className="text-xs text-soft">…</span>}
          </label>
          {coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="" className="aspect-[16/10] w-full max-w-sm rounded-xl object-cover md:col-span-2" />
          )}
        </div>
      </fieldset>
      {state.error && <p role="alert" className="rounded-xl bg-sand px-4 py-3 text-sm text-rust">{state.error === "slug" ? `${t.fields.slug}: /${slug}` : t.forbidden}</p>}
      {!readOnly && <button disabled={pending || uploading} className="self-start rounded-full bg-forest px-6 py-3 font-semibold text-white disabled:opacity-60">{t.save}</button>}
    </form>
  );
}
