"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveDocument } from "@/app/actions/admin";
import type { Messages } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

const ALLOWED = ["application/pdf", "image/jpeg", "image/png", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
const MAX_BYTES = 20 * 1024 * 1024;

/** Uploads the file straight to Supabase Storage (policies allow editors only), then records it in the documents table. */
export function DocumentUploader({ t, error }: { t: Messages["admin"]; error: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    if (!(file instanceof File) || !ALLOWED.includes(file.type) || file.size === 0 || file.size > MAX_BYTES) {
      setProblem(t.fields.file);
      return;
    }
    setBusy(true);
    setProblem("");
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const filePath = `${crypto.randomUUID()}.${extension}`;
    const upload = await createClient().storage.from("documents").upload(filePath, file, { contentType: file.type });
    if (upload.error) {
      setBusy(false);
      setProblem(error);
      return;
    }
    const result = await saveDocument({
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      file_path: filePath,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      visibility: form.get("visibility") === "public" ? "public" : "members",
    });
    setBusy(false);
    if (result.error) {
      setProblem(error);
      return;
    }
    event.currentTarget?.reset();
    router.refresh();
  }

  const input = "w-full rounded-xl border border-line bg-white px-4 py-2.5";
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-line bg-white p-6 md:grid-cols-2">
      <label className="flex flex-col gap-1.5"><span className="text-sm font-semibold">{t.fields.title}</span><input name="title" required maxLength={200} className={input} /></label>
      <label className="flex flex-col gap-1.5"><span className="text-sm font-semibold">{t.fields.visibility}</span>
        <select name="visibility" className={input} defaultValue="members">
          <option value="members">{t.visibility.members}</option>
          <option value="public">{t.visibility.public}</option>
        </select>
      </label>
      <label className="flex flex-col gap-1.5 md:col-span-2"><span className="text-sm font-semibold">{t.fields.description}</span><input name="description" maxLength={500} className={input} /></label>
      <label className="flex flex-col gap-1.5 md:col-span-2"><span className="text-sm font-semibold">{t.fields.file}</span><input name="file" type="file" required accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx" className="text-sm" /></label>
      {problem && <p role="alert" className="text-sm text-rust md:col-span-2">{problem}</p>}
      <button disabled={busy} className="justify-self-start rounded-full bg-forest px-6 py-2.5 font-semibold text-white disabled:opacity-60">{t.upload}</button>
    </form>
  );
}
